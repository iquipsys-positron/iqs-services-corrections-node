let _ = require('lodash');
let async = require('async');

import { NotFoundException } from 'pip-services3-commons-node';

import { OrganizationV1 } from 'pip-clients-organizations-node';
import { IOrganizationsClientV1 } from 'pip-clients-organizations-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';

export class OrganizationsConnector {

    public constructor(
        private _organizationsClient: IOrganizationsClientV1
    ) {}

    public getOrganization(correlationId: string, correction: CorrectionV1,
        callback: (err: any, organization: OrganizationV1) => void) : void {
        
        let orgId = correction ? correction.org_id : null;

        this._organizationsClient.getOrganizationById(
            correlationId, orgId, (err, organization) => {
                if (err == null && organization == null) {
                    err = new NotFoundException(
                        correlationId,
                        'ORGANIZATION_NOT_FOUND',
                        'Organization ' + orgId + ' was not found'
                    ).withDetails('org_id', orgId);
                }
                callback(err, organization);
            }
        );
    }

}