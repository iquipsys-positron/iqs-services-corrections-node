import { IStatisticsClientV1 } from 'pip-clients-statistics-node';
import { OrganizationV1 } from 'pip-clients-organizations-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
export declare class StatisticsConnector {
    private _statisticsClient;
    constructor(_statisticsClient: IStatisticsClientV1);
    private makeCounterName;
    incrementCounter(correlationId: string, organization: OrganizationV1, correction: CorrectionV1, callback: (err: any) => void): void;
    decrementCounter(correlationId: string, organization: OrganizationV1, correction: CorrectionV1, callback: (err: any) => void): void;
}
