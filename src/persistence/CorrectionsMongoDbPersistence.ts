let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { ICorrectionsPersistence } from './ICorrectionsPersistence';

export class CorrectionsMongoDbPersistence
    extends IdentifiableMongoDbPersistence<CorrectionV1, string>
    implements ICorrectionsPersistence {

    constructor() {
        super('corrections');
        super.ensureIndex({ org_id: 1, create_time: -1 });
    }
    
    private composeFilter(filter: any) {
        filter = filter || new FilterParams();

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
    
    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CorrectionV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
