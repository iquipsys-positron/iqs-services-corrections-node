let _ = require('lodash');
let async = require('async');

import { IStatisticsClientV1 } from 'pip-clients-statistics-node';
import { OrganizationV1 } from 'pip-clients-organizations-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../data/version1/CorrectionStatusV1';
import { CorrectionChangeV1 } from '../data/version1/CorrectionChangeV1';

export class StatisticsConnector {

    public constructor(
        private _statisticsClient: IStatisticsClientV1
    ) {}

    private makeCounterName(id: string, change: CorrectionChangeV1): string {
        if (change.param_name)
            return "param" + "." + id + "." + change.param_name;
        else if (change.event_rule_id)
            return "event" + "." + id + "." + change.event_rule_id;
        else if (change.zone_id)
            return "time" + "." + id + "." + change.zone_id;
        else
            return null;
    }

    public incrementCounter(correlationId: string, organization: OrganizationV1, correction: CorrectionV1,
        callback: (err: any) => void) : void {
        
        if (this._statisticsClient == null || correction == null
            || correction.status != CorrectionStatusV1.Approved) {
            callback(null);
            return;
        }

        async.each(correction.affected_ids, (id, callback) => {
            async.each(correction.changes, (change: CorrectionChangeV1, callback) => {
                let counter = this.makeCounterName(id, change);
                if (counter) {
                    this._statisticsClient.incrementCounter(
                        correlationId, correction.org_id, counter,
                        correction.time, organization.timezone, change.value, callback);
                } else callback();
            }, callback);
        }, callback);
    }

    public decrementCounter(correlationId: string, organization: OrganizationV1, correction: CorrectionV1,
        callback: (err: any) => void) : void {
        
        if (this._statisticsClient == null || correction == null
            || correction.status != CorrectionStatusV1.Approved) {
            callback(null);
            return;
        }

        async.each(correction.affected_ids, (id, callback) => {
            async.each(correction.changes, (change: CorrectionChangeV1, callback) => {
                let counter = this.makeCounterName(id, change);
                if (counter) {
                    this._statisticsClient.incrementCounter(
                        correlationId, correction.org_id, counter,
                        correction.time, organization.timezone, -change.value, callback);
                } else callback();
            }, callback);
        }, callback);
    }

}