import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';
import { CorrectionsMemoryPersistence } from './CorrectionsMemoryPersistence';
import { CorrectionV1 } from '../data/version1/CorrectionV1';
export declare class CorrectionsFilePersistence extends CorrectionsMemoryPersistence {
    protected _persister: JsonFilePersister<CorrectionV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
