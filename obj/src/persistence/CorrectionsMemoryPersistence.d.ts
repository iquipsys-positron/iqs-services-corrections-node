import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { ICorrectionsPersistence } from './ICorrectionsPersistence';
export declare class CorrectionsMemoryPersistence extends IdentifiableMemoryPersistence<CorrectionV1, string> implements ICorrectionsPersistence {
    constructor();
    private contains;
    private composeFilter;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CorrectionV1>) => void): void;
}
