import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class CorrectionsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/corrections');
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-corrections', 'controller', 'default', '*', '1.0'));
    }
}