let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { ICorrectionsPersistence } from './ICorrectionsPersistence';

export class CorrectionsMemoryPersistence 
    extends IdentifiableMemoryPersistence<CorrectionV1, string> 
    implements ICorrectionsPersistence {

    constructor() {
        super();
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
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

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<CorrectionV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

}
