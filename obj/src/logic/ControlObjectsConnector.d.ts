import { IControlObjectsClientV1 } from 'iqs-clients-controlobjects-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
export declare class ControlObjectsConnector {
    private _objectsClient;
    constructor(_objectsClient: IControlObjectsClientV1);
    getAffectedIds(correlationId: string, correction: CorrectionV1, callback: (err: any, ids: string[]) => void): void;
}
