"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
let async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class OrganizationsConnector {
    constructor(_organizationsClient) {
        this._organizationsClient = _organizationsClient;
    }
    getOrganization(correlationId, correction, callback) {
        let orgId = correction ? correction.org_id : null;
        this._organizationsClient.getOrganizationById(correlationId, orgId, (err, organization) => {
            if (err == null && organization == null) {
                err = new pip_services3_commons_node_1.NotFoundException(correlationId, 'ORGANIZATION_NOT_FOUND', 'Organization ' + orgId + ' was not found').withDetails('org_id', orgId);
            }
            callback(err, organization);
        });
    }
}
exports.OrganizationsConnector = OrganizationsConnector;
//# sourceMappingURL=OrganizationsConnector.js.map