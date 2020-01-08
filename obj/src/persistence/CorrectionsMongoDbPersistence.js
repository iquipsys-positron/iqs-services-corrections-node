"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class CorrectionsMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('corrections');
        super.ensureIndex({ org_id: 1, create_time: -1 });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let criteria = [];
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });
        let org_id = filter.getAsNullableString('org_id');
        if (org_id != null)
            criteria.push({ org_id: org_id });
        let status = filter.getAsNullableString('status');
        if (status != null)
            criteria.push({ status: status });
        let statuses = filter.getAsObject('statuses');
        if (_.isString(statuses))
            statuses = statuses.split(',');
        if (_.isArray(statuses))
            criteria.push({ status: { $in: statuses } });
        let creator_id = filter.getAsNullableString('creator_id');
        if (creator_id != null)
            criteria.push({ creator_id: creator_id });
        let object_id = filter.getAsNullableString('object_id');
        if (object_id != null)
            criteria.push({ object_id: object_id });
        let group_id = filter.getAsNullableString('group_id');
        if (group_id != null)
            criteria.push({ group_id: group_id });
        let fromTime = filter.getAsNullableDateTime('from_time');
        if (fromTime != null)
            criteria.push({ time: { $gte: fromTime } });
        let toTime = filter.getAsNullableDateTime('to_time');
        if (toTime != null)
            criteria.push({ time: { $lt: toTime } });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
}
exports.CorrectionsMongoDbPersistence = CorrectionsMongoDbPersistence;
//# sourceMappingURL=CorrectionsMongoDbPersistence.js.map