"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_aws_node_1 = require("pip-services3-aws-node");
const pip_clients_organizations_node_1 = require("pip-clients-organizations-node");
const iqs_clients_controlobjects_node_1 = require("iqs-clients-controlobjects-node");
const CorrectionsServiceFactory_1 = require("../build/CorrectionsServiceFactory");
class CorrectionsLambdaFunction extends pip_services3_aws_node_1.CommandableLambdaFunction {
    constructor() {
        super("corrections", "Manual corrections function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('iqs-services-corrections', 'controller', 'default', '*', '*'));
        this._factories.add(new pip_clients_organizations_node_1.OrganizationsClientFactory());
        this._factories.add(new iqs_clients_controlobjects_node_1.ControlObjectsClientFactory());
        this._factories.add(new CorrectionsServiceFactory_1.CorrectionsServiceFactory());
    }
    getReferences() {
        return this._references;
    }
}
exports.CorrectionsLambdaFunction = CorrectionsLambdaFunction;
exports.handler = new CorrectionsLambdaFunction().getHandler();
//# sourceMappingURL=CorrectionsLambdaFunction.js.map