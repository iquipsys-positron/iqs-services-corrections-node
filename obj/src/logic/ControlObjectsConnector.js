"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
class ControlObjectsConnector {
    constructor(_objectsClient) {
        this._objectsClient = _objectsClient;
    }
    getAffectedIds(correlationId, correction, callback) {
        // Exit if correction is not set
        if (correction == null) {
            callback(null, []);
            return;
        }
        // Calculate obvious ids
        let ids = [];
        if (correction.group_id) {
            ids.push(correction.group_id);
            callback(null, ids);
            return;
        }
        if (correction.object_id)
            ids.push(correction.object_id);
        // If client or object_id are not set then exit
        if (this._objectsClient == null || correction.object_id == null) {
            callback(null, ids);
            return;
        }
        // Retrieve group ids for the object
        this._objectsClient.getObjectById(correlationId, correction.object_id, (err, obj) => {
            if (obj)
                ids = ids.concat(obj.group_ids);
            callback(err, ids);
        });
    }
}
exports.ControlObjectsConnector = ControlObjectsConnector;
//# sourceMappingURL=ControlObjectsConnector.js.map