"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
const CorrectionV1Schema_1 = require("../data/version1/CorrectionV1Schema");
class CorrectionsCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetCorrectionsCommand());
        this.addCommand(this.makeGetCorrectionByIdCommand());
        this.addCommand(this.makeCreateCorrectionCommand());
        this.addCommand(this.makeUpdateCorrectionCommand());
        this.addCommand(this.makeDeleteCorrectionByIdCommand());
    }
    makeGetCorrectionsCommand() {
        return new pip_services3_commons_node_2.Command("get_corrections", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getCorrections(correlationId, filter, paging, callback);
        });
    }
    makeGetCorrectionByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_correction_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('correction_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let correction_id = args.getAsString("correction_id");
            this._logic.getCorrectionById(correlationId, correction_id, callback);
        });
    }
    makeCreateCorrectionCommand() {
        return new pip_services3_commons_node_2.Command("create_correction", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('correction', new CorrectionV1Schema_1.CorrectionV1Schema()), (correlationId, args, callback) => {
            let correction = args.get("correction");
            this._logic.createCorrection(correlationId, correction, callback);
        });
    }
    makeUpdateCorrectionCommand() {
        return new pip_services3_commons_node_2.Command("update_correction", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('correction', new CorrectionV1Schema_1.CorrectionV1Schema()), (correlationId, args, callback) => {
            let correction = args.get("correction");
            this._logic.updateCorrection(correlationId, correction, callback);
        });
    }
    makeDeleteCorrectionByIdCommand() {
        return new pip_services3_commons_node_2.Command("delete_correction_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty('correction_id', pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            let correctionId = args.getAsNullableString("correction_id");
            this._logic.deleteCorrectionById(correlationId, correctionId, callback);
        });
    }
}
exports.CorrectionsCommandSet = CorrectionsCommandSet;
//# sourceMappingURL=CorrectionsCommandSet.js.map