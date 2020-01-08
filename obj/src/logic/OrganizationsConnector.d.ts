import { OrganizationV1 } from 'pip-clients-organizations-node';
import { IOrganizationsClientV1 } from 'pip-clients-organizations-node';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
export declare class OrganizationsConnector {
    private _organizationsClient;
    constructor(_organizationsClient: IOrganizationsClientV1);
    getOrganization(correlationId: string, correction: CorrectionV1, callback: (err: any, organization: OrganizationV1) => void): void;
}
