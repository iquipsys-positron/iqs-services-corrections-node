import { Descriptor } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { CommandableLambdaFunction } from 'pip-services3-aws-node';

import { OrganizationsClientFactory } from 'pip-clients-organizations-node';
import { ControlObjectsClientFactory } from 'iqs-clients-controlobjects-node';

import { CorrectionsServiceFactory } from '../build/CorrectionsServiceFactory';

export class CorrectionsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("corrections", "Manual corrections function");
        this._dependencyResolver.put('controller', new Descriptor('iqs-services-corrections', 'controller', 'default', '*', '*'));
        this._factories.add(new OrganizationsClientFactory());
        this._factories.add(new ControlObjectsClientFactory());
        this._factories.add(new CorrectionsServiceFactory());
    }

    public getReferences(): IReferences {
        return this._references;
    }
}

export const handler = new CorrectionsLambdaFunction().getHandler();