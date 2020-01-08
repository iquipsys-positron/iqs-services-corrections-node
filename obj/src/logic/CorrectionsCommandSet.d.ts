import { CommandSet } from 'pip-services3-commons-node';
import { ICorrectionsController } from './ICorrectionsController';
export declare class CorrectionsCommandSet extends CommandSet {
    private _logic;
    constructor(logic: ICorrectionsController);
    private makeGetCorrectionsCommand;
    private makeGetCorrectionByIdCommand;
    private makeCreateCorrectionCommand;
    private makeUpdateCorrectionCommand;
    private makeDeleteCorrectionByIdCommand;
}
