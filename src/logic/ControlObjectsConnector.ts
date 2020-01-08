let _ = require('lodash');
let async = require('async');

import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';

export class ControlObjectsConnector {

    public constructor(
        private _objectsClient: IControlObjectsClientV1
    ) {}

    public getAffectedIds(correlationId: string, correction: CorrectionV1,
        callback: (err: any, ids: string[]) => void) : void {
        
        // Exit if correction is not set
        if (correction == null) {
            callback(null, []);
            return;
        }

        // Calculate obvious ids
        let ids: string[] = [];
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
        this._objectsClient.getObjectById(
            correlationId, correction.object_id, (err, obj) => {
                if (obj)
                    ids = ids.concat(obj.group_ids);
                callback(err, ids);
            }
        );
    }

}