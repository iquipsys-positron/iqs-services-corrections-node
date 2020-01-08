import { CommandSet } from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Schema } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { CorrectionV1 } from '../data/version1/CorrectionV1';
import { CorrectionV1Schema } from '../data/version1/CorrectionV1Schema';
import { ICorrectionsController } from './ICorrectionsController';

export class CorrectionsCommandSet extends CommandSet {
    private _logic: ICorrectionsController;

    constructor(logic: ICorrectionsController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetCorrectionsCommand());
		this.addCommand(this.makeGetCorrectionByIdCommand());
		this.addCommand(this.makeCreateCorrectionCommand());
		this.addCommand(this.makeUpdateCorrectionCommand());
		this.addCommand(this.makeDeleteCorrectionByIdCommand());
    }

	private makeGetCorrectionsCommand(): ICommand {
		return new Command(
			"get_corrections",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
                let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getCorrections(correlationId, filter, paging, callback);
            }
		);
	}

	private makeGetCorrectionByIdCommand(): ICommand {
		return new Command(
			"get_correction_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('correction_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let correction_id = args.getAsString("correction_id");
                this._logic.getCorrectionById(correlationId, correction_id, callback);
            }
		);
	}

	private makeCreateCorrectionCommand(): ICommand {
		return new Command(
			"create_correction",
			new ObjectSchema(true)
				.withRequiredProperty('correction', new CorrectionV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let correction = args.get("correction");
                this._logic.createCorrection(correlationId, correction, callback);
            }
		);
	}

	private makeUpdateCorrectionCommand(): ICommand {
		return new Command(
			"update_correction",
			new ObjectSchema(true)
				.withRequiredProperty('correction', new CorrectionV1Schema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let correction = args.get("correction");
                this._logic.updateCorrection(correlationId, correction, callback);
            }
		);
	}
	
	private makeDeleteCorrectionByIdCommand(): ICommand {
		return new Command(
			"delete_correction_by_id",
			new ObjectSchema(true)
				.withRequiredProperty('correction_id', TypeCode.String),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let correctionId = args.getAsNullableString("correction_id");
                this._logic.deleteCorrectionById(correlationId, correctionId, callback);
			}
		);
	}

}