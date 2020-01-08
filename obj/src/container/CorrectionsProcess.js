"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
const pip_clients_statistics_node_1 = require("pip-clients-statistics-node");
const pip_clients_organizations_node_1 = require("pip-clients-organizations-node");
const iqs_clients_controlobjects_node_1 = require("iqs-clients-controlobjects-node");
const CorrectionsServiceFactory_1 = require("../build/CorrectionsServiceFactory");
class CorrectionsProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("corrections", "Manual corrections microservice");
        this._factories.add(new pip_clients_organizations_node_1.OrganizationsClientFactory());
        this._factories.add(new pip_clients_statistics_node_1.StatisticsClientFactory());
        this._factories.add(new iqs_clients_controlobjects_node_1.ControlObjectsClientFactory());
        this._factories.add(new CorrectionsServiceFactory_1.CorrectionsServiceFactory());
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.CorrectionsProcess = CorrectionsProcess;
//# sourceMappingURL=CorrectionsProcess.js.map