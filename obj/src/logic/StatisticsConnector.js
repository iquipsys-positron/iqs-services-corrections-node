"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const CorrectionStatusV1_1 = require("../data/version1/CorrectionStatusV1");
class StatisticsConnector {
    constructor(_statisticsClient) {
        this._statisticsClient = _statisticsClient;
    }
    makeCounterName(id, change) {
        if (change.param_name)
            return "param" + "." + id + "." + change.param_name;
        else if (change.event_rule_id)
            return "event" + "." + id + "." + change.event_rule_id;
        else if (change.zone_id)
            return "time" + "." + id + "." + change.zone_id;
        else
            return null;
    }
    incrementCounter(correlationId, organization, correction, callback) {
        if (this._statisticsClient == null || correction == null
            || correction.status != CorrectionStatusV1_1.CorrectionStatusV1.Approved) {
            callback(null);
            return;
        }
        async.each(correction.affected_ids, (id, callback) => {
            async.each(correction.changes, (change, callback) => {
                let counter = this.makeCounterName(id, change);
                if (counter) {
                    this._statisticsClient.incrementCounter(correlationId, correction.org_id, counter, correction.time, organization.timezone, change.value, callback);
                }
                else
                    callback();
            }, callback);
        }, callback);
    }
    decrementCounter(correlationId, organization, correction, callback) {
        if (this._statisticsClient == null || correction == null
            || correction.status != CorrectionStatusV1_1.CorrectionStatusV1.Approved) {
            callback(null);
            return;
        }
        async.each(correction.affected_ids, (id, callback) => {
            async.each(correction.changes, (change, callback) => {
                let counter = this.makeCounterName(id, change);
                if (counter) {
                    this._statisticsClient.incrementCounter(correlationId, correction.org_id, counter, correction.time, organization.timezone, -change.value, callback);
                }
                else
                    callback();
            }, callback);
        }, callback);
    }
}
exports.StatisticsConnector = StatisticsConnector;
//# sourceMappingURL=StatisticsConnector.js.map