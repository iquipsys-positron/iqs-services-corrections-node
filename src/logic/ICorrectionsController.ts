import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';

export interface ICorrectionsController {
    getCorrections(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<CorrectionV1>) => void): void;

    getCorrectionById(correlationId: string, correction_id: string, 
        callback: (err: any, correction: CorrectionV1) => void): void;

    createCorrection(correlationId: string, correction: CorrectionV1, 
        callback: (err: any, correction: CorrectionV1) => void): void;

    updateCorrection(correlationId: string, correction: CorrectionV1, 
        callback: (err: any, correction: CorrectionV1) => void): void;

    deleteCorrectionById(correlationId: string, correction_id: string,
        callback: (err: any, correction: CorrectionV1) => void): void;
}
