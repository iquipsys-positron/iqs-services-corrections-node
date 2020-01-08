"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
let geojson = require('geojson-utils');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const CorrectionsCommandSet_1 = require("./CorrectionsCommandSet");
const OrganizationsConnector_1 = require("./OrganizationsConnector");
const ControlObjectsConnector_1 = require("./ControlObjectsConnector");
const StatisticsConnector_1 = require("./StatisticsConnector");
class CorrectionsController {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(CorrectionsController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._organizationsClient = this._dependencyResolver.getOneOptional('organizations');
        this._organizationsConnector = new OrganizationsConnector_1.OrganizationsConnector(this._organizationsClient);
        this._objectsClient = this._dependencyResolver.getOneOptional('control-objects');
        this._objectsConnector = new ControlObjectsConnector_1.ControlObjectsConnector(this._objectsClient);
        this._statisticsClient = this._dependencyResolver.getOneOptional('statistics');
        this._statisticsConnector = new StatisticsConnector_1.StatisticsConnector(this._statisticsClient);
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new CorrectionsCommandSet_1.CorrectionsCommandSet(this);
        return this._commandSet;
    }
    getCorrections(correlationId, filter, paging, callback) {
        this._persistence.getPageByFilter(correlationId, filter, paging, callback);
    }
    getCorrectionById(correlationId, id, callback) {
        this._persistence.getOneById(correlationId, id, callback);
    }
    fixCorrection(correction) {
        correction.time = pip_services3_commons_node_3.DateTimeConverter.toNullableDateTime(correction.time);
        correction.create_time = pip_services3_commons_node_3.DateTimeConverter.toNullableDateTime(correction.create_time);
        correction.close_time = pip_services3_commons_node_3.DateTimeConverter.toNullableDateTime(correction.close_time);
    }
    createCorrection(correlationId, correction, callback) {
        let organization;
        let newCorrection;
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
    updateCorrection(correlationId, correction, callback) {
        let organization;
        let oldCorrection;
        let newCorrection;
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
                        err = new pip_services3_commons_node_4.NotFoundException(correlationId, 'CORRECTION_NOT_FOUND', 'Correction ' + correction.id + ' was not found').withDetails('correction_id', correction.id);
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
    deleteCorrectionById(correlationId, id, callback) {
        let organization;
        let oldCorrection;
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
exports.CorrectionsController = CorrectionsController;
CorrectionsController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'iqs-services-corrections:persistence:*:*:1.0', 'dependencies.organizations', 'pip-services-organizations:client:*:*:1.0', 'dependencies.control-objects', 'iqs-services-controlobjects:client:*:*:1.0', 'dependencies.statistics', 'pip-services-statistics:client:*:*:1.0');
//# sourceMappingURL=CorrectionsController.js.map