"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class CorrectionsMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let id = filter.getAsNullableString('id');
        let orgId = filter.getAsNullableString('org_id');
        let creatorId = filter.getAsNullableString('creator_id');
        let objectId = filter.getAsNullableString('object_id');
        let groupId = filter.getAsNullableString('group_id');
        let statuses = filter.getAsObject('statuses');
        let status = filter.getAsNullableString('status');
        let fromTime = filter.getAsNullableDateTime('from_time');
        let toTime = filter.getAsNullableDateTime('to_time');
        return (item) => {
            if (id && item.id != id)
                return false;
            if (orgId && item.org_id != orgId)
                return false;
            if (creatorId && item.creator_id != creatorId)
                return false;
            if (objectId && item.object_id != objectId)
                return false;
            if (groupId && item.group_id != groupId)
                return false;
            if (statuses && _.indexOf(statuses, item.status) < 0)
                return false;
            if (status && item.status != status)
                return false;
            if (fromTime && item.time < fromTime)
                return false;
            if (toTime && item.time >= toTime)
                return false;
            return true;
        };
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
exports.CorrectionsMemoryPersistence = CorrectionsMemoryPersistence;
//# sourceMappingURL=CorrectionsMemoryPersistence.js.map