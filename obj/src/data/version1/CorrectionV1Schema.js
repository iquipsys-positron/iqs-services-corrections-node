"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const CorrectionChangeV1Schema_1 = require("./CorrectionChangeV1Schema");
class CorrectionV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('id', pip_services3_commons_node_3.TypeCode.String);
        this.withRequiredProperty('org_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('object_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('group_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('affected_ids', new pip_services3_commons_node_2.ArraySchema(pip_services3_commons_node_3.TypeCode.String));
        this.withRequiredProperty('time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withRequiredProperty('status', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('reason', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('create_time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('creator_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('creator_name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('close_time', pip_services3_commons_node_3.TypeCode.DateTime);
        this.withOptionalProperty('closer_id', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('closer_name', pip_services3_commons_node_3.TypeCode.String);
        this.withOptionalProperty('changes', new pip_services3_commons_node_2.ArraySchema(new CorrectionChangeV1Schema_1.CorrectionChangeV1Schema()));
    }
}
exports.CorrectionV1Schema = CorrectionV1Schema;
//# sourceMappingURL=CorrectionV1Schema.js.map