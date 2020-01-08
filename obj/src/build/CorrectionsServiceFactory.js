"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const CorrectionsMongoDbPersistence_1 = require("../persistence/CorrectionsMongoDbPersistence");
const CorrectionsFilePersistence_1 = require("../persistence/CorrectionsFilePersistence");
const CorrectionsMemoryPersistence_1 = require("../persistence/CorrectionsMemoryPersistence");
const CorrectionsController_1 = require("../logic/CorrectionsController");
const CorrectionsHttpServiceV1_1 = require("../services/version1/CorrectionsHttpServiceV1");
class CorrectionsServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(CorrectionsServiceFactory.MemoryPersistenceDescriptor, CorrectionsMemoryPersistence_1.CorrectionsMemoryPersistence);
        this.registerAsType(CorrectionsServiceFactory.FilePersistenceDescriptor, CorrectionsFilePersistence_1.CorrectionsFilePersistence);
        this.registerAsType(CorrectionsServiceFactory.MongoDbPersistenceDescriptor, CorrectionsMongoDbPersistence_1.CorrectionsMongoDbPersistence);
        this.registerAsType(CorrectionsServiceFactory.ControllerDescriptor, CorrectionsController_1.CorrectionsController);
        this.registerAsType(CorrectionsServiceFactory.HttpServiceDescriptor, CorrectionsHttpServiceV1_1.CorrectionsHttpServiceV1);
    }
}
exports.CorrectionsServiceFactory = CorrectionsServiceFactory;
CorrectionsServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "factory", "default", "default", "1.0");
CorrectionsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "persistence", "memory", "*", "1.0");
CorrectionsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "persistence", "file", "*", "1.0");
CorrectionsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "persistence", "mongodb", "*", "1.0");
CorrectionsServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "controller", "default", "*", "1.0");
CorrectionsServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("iqs-services-corrections", "service", "http", "*", "1.0");
//# sourceMappingURL=CorrectionsServiceFactory.js.map