import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { ICorrectionsPersistence } from './ICorrectionsPersistence';
export declare class CorrectionsMongoDbPersistence extends IdentifiableMongoDbPersistence<CorrectionV1, string> implements ICorrectionsPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CorrectionV1>) => void): void;
}
