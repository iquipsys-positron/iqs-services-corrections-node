import { IReferences } from 'pip-services3-commons-node';
import { ProcessContainer } from 'pip-services3-container-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

import { StatisticsClientFactory } from 'pip-clients-statistics-node';
import { OrganizationsClientFactory } from 'pip-clients-organizations-node';
import { ControlObjectsClientFactory } from 'iqs-clients-controlobjects-node';


import { CorrectionsServiceFactory } from '../build/CorrectionsServiceFactory';

export class CorrectionsProcess extends ProcessContainer {

    public constructor() {
        super("corrections", "Manual corrections microservice");
        this._factories.add(new OrganizationsClientFactory());
        this._factories.add(new StatisticsClientFactory());
        this._factories.add(new ControlObjectsClientFactory());
        this._factories.add(new CorrectionsServiceFactory());
        this._factories.add(new DefaultRpcFactory);
    }

}
