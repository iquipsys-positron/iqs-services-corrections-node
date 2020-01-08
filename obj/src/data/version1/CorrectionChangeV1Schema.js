"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
class CorrectionChangeV1Schema extends pip_services3_commons_node_1.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty('param_name', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('event_rule_id', pip_services3_commons_node_2.TypeCode.String);
        this.withOptionalProperty('zone_id', pip_services3_commons_node_2.TypeCode.String);
        this.withRequiredProperty('value', pip_services3_commons_node_2.TypeCode.Float);
    }
}
exports.CorrectionChangeV1Schema = CorrectionChangeV1Schema;
//# sourceMappingURL=CorrectionChangeV1Schema.js.map