import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { CorrectionsMongoDbPersistence } from '../persistence/CorrectionsMongoDbPersistence';
import { CorrectionsFilePersistence } from '../persistence/CorrectionsFilePersistence';
import { CorrectionsMemoryPersistence } from '../persistence/CorrectionsMemoryPersistence';
import { CorrectionsController } from '../logic/CorrectionsController';
import { CorrectionsHttpServiceV1 } from '../services/version1/CorrectionsHttpServiceV1';

export class CorrectionsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("iqs-services-corrections", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("iqs-services-corrections", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("iqs-services-corrections", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("iqs-services-corrections", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("iqs-services-corrections", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("iqs-services-corrections", "service", "http", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(CorrectionsServiceFactory.MemoryPersistenceDescriptor, CorrectionsMemoryPersistence);
		this.registerAsType(CorrectionsServiceFactory.FilePersistenceDescriptor, CorrectionsFilePersistence);
		this.registerAsType(CorrectionsServiceFactory.MongoDbPersistenceDescriptor, CorrectionsMongoDbPersistence);
		this.registerAsType(CorrectionsServiceFactory.ControllerDescriptor, CorrectionsController);
		this.registerAsType(CorrectionsServiceFactory.HttpServiceDescriptor, CorrectionsHttpServiceV1);
	}
	
}
