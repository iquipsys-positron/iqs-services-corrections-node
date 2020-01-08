let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');

import { ConfigParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';
import { DateTimeConverter } from 'pip-services3-commons-node';
import { NotFoundException } from 'pip-services3-commons-node';

import { OrganizationV1 } from 'pip-clients-organizations-node';
import { IOrganizationsClientV1 } from 'pip-clients-organizations-node';
import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';
import { IStatisticsClientV1 } from 'pip-clients-statistics-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../data/version1/CorrectionStatusV1';
import { ICorrectionsPersistence } from '../persistence/ICorrectionsPersistence';
import { ICorrectionsController } from './ICorrectionsController';
import { CorrectionsCommandSet } from './CorrectionsCommandSet';
import { OrganizationsConnector } from './OrganizationsConnector';
import { ControlObjectsConnector } from './ControlObjectsConnector';
import { StatisticsConnector } from './StatisticsConnector';

export class CorrectionsController implements  IConfigurable, IReferenceable, ICommandable, ICorrectionsController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'iqs-services-corrections:persistence:*:*:1.0',
        'dependencies.organizations', 'pip-services-organizations:client:*:*:1.0',
        'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0',
        'dependencies.statistics', 'pip-services-statistics:client:*:*:1.0'
    );

    private _dependencyResolver: DependencyResolver = new DependencyResolver(CorrectionsController._defaultConfig);
    private _organizationsClient: IOrganizationsClientV1;
    private _organizationsConnector: OrganizationsConnector;
    private _objectsClient: IControlObjectsClientV1;
    private _objectsConnector: ControlObjectsConnector;
    private _statisticsClient: IStatisticsClientV1;
    private _statisticsConnector: StatisticsConnector;
    private _persistence: ICorrectionsPersistence;
    private _commandSet: CorrectionsCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<ICorrectionsPersistence>('persistence');

        this._organizationsClient = this._dependencyResolver.getOneOptional<IOrganizationsClientV1>('organizations');
        this._organizationsConnector = new OrganizationsConnector(this._organizationsClient);
        this._objectsClient = this._dependencyResolver.getOneOptional<IControlObjectsClientV1>('control-objects');
        this._objectsConnector = new ControlObjectsConnector(this._objectsClient);
        this._statisticsClient = this._dependencyResolver.getOneOptional<IStatisticsClientV1>('statistics');
        this._statisticsConnector = new StatisticsConnector(this._statisticsClient);
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new CorrectionsCommandSet(this);
        return this._commandSet;
    }
    
    public getCorrections(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<CorrectionV1>) => void): void {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }

    public getCorrectionById(correlationId: string, id: string, 
        callback: (err: any, correction: CorrectionV1) => void): void {
        this._persistence.getOneById(correlationId, id, callback);
    }

    private fixCorrection(correction: CorrectionV1): void {
        correction.time = DateTimeConverter.toNullableDateTime(correction.time);
        correction.create_time = DateTimeConverter.toNullableDateTime(correction.create_time);
        correction.close_time = DateTimeConverter.toNullableDateTime(correction.close_time);
    }

    public createCorrection(correlationId: string, correction: CorrectionV1, 
        callback: (err: any, correction: CorrectionV1) => void): void {
        let organization: OrganizationV1;
        let newCorrection: CorrectionV1;

        this.fixCorrection(correction);
        correction.create_time = new Date();

        async.series([
            // Get corresponding organization
            (callback) => {
                this._organizationsConnector.getOrganization(correlationId, correction, (err, data) => {
                    organization = data;
                    callback(err);
                });
            },
            // Calculate affected ids
            (callback) => {
                this._objectsConnector.getAffectedIds(correlationId, correction, (err, ids) => {
                    correction.affected_ids = ids;
                    callback(err);
                });
            },
            // Create correction
            (callback) => {
                this._persistence.create(correlationId, correction, (err, data) => {
                    newCorrection = data;
                    callback(err);
                });
            },
            // Increment statistics
            (callback) => {
                this._statisticsConnector.incrementCounter(correlationId, organization, newCorrection, callback);
            }
        ], (err) => {
            callback(err, err == null ? newCorrection : null);
        });
    }

    public updateCorrection(correlationId: string, correction: CorrectionV1, 
        callback: (err: any, correction: CorrectionV1) => void): void {
        let organization: OrganizationV1;
        let oldCorrection: CorrectionV1;
        let newCorrection: CorrectionV1;

        this.fixCorrection(correction);

        async.series([
            // Get corresponding organization
            (callback) => {
                this._organizationsConnector.getOrganization(correlationId, correction, (err, data) => {
                    organization = data;
                    callback(err);
                });
            },
            // Retrieve previous correction
            (callback) => {
                this._persistence.getOneById(correlationId, correction.id, (err, data) => {
                    oldCorrection = data;
                    if (data == null && err == null) {
                        err = new NotFoundException(
                            correlationId, 
                            'CORRECTION_NOT_FOUND', 
                            'Correction ' + correction.id + ' was not found'
                        ).withDetails('correction_id', correction.id);
                    }
                    callback(err);
                });
            },
            // Calculate affected ids
            (callback) => {
                // If ids were not changed then take old affected ids
                if (oldCorrection.object_id == correction.object_id 
                    && oldCorrection.group_id == correction.group_id) {
                    correction.affected_ids = oldCorrection.affected_ids;
                    callback();
                    return;
                }

                this._objectsConnector.getAffectedIds(correlationId, correction, (err, ids) => {
                    correction.affected_ids = ids;
                    callback();
                });
            },
            // Update correction
            (callback) => {
                this._persistence.update(correlationId, correction, (err, data) => {
                    newCorrection = data;
                    callback(err);
                });
            },
            // Decrement previously set statistics
            (callback) => {
                this._statisticsConnector.decrementCounter(correlationId, organization, oldCorrection, callback);
            },
            // Increment new statistics
            (callback) => {
                this._statisticsConnector.incrementCounter(correlationId, organization, oldCorrection, callback);
            }
        ], (err) => {
            callback(err, err == null ? newCorrection : null);
        });
    }

    public deleteCorrectionById(correlationId: string, id: string,
        callback: (err: any, correction: CorrectionV1) => void): void {  
        let organization: OrganizationV1;
        let oldCorrection: CorrectionV1;

        async.series([
            // Delete correction
            (callback) => {
                this._persistence.deleteById(correlationId, id, (err, data) => {
                    oldCorrection = data;
                    callback(err);
                });
            },
            // Get corresponding organization
            (callback) => {
                this._organizationsConnector.getOrganization(correlationId, oldCorrection, (err, data) => {
                    organization = data;
                    callback(err);
                });
            },
            // Decrement previously set statistics
            (callback) => {
                this._statisticsConnector.decrementCounter(correlationId, organization, oldCorrection, callback);
            }
        ], (err) => {
            callback(err, err == null ? oldCorrection : null);
        });
    }

}
