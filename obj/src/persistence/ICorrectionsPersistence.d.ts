import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';
import { IWriter } from 'pip-services3-data-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
export interface ICorrectionsPersistence extends IGetter<CorrectionV1, string>, IWriter<CorrectionV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<CorrectionV1>) => void): void;
    getOneById(correlationId: string, id: string, callback: (err: any, item: CorrectionV1) => void): void;
    create(correlationId: string, item: CorrectionV1, callback: (err: any, item: CorrectionV1) => void): void;
    update(correlationId: string, item: CorrectionV1, callback: (err: any, item: CorrectionV1) => void): void;
    deleteById(correlationId: string, id: string, callback: (err: any, item: CorrectionV1) => void): void;
}
