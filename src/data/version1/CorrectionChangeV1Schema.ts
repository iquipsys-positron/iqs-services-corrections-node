import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class CorrectionChangeV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('param_name', TypeCode.String);
        this.withOptionalProperty('event_rule_id', TypeCode.String);
        this.withOptionalProperty('zone_id', TypeCode.String);
        this.withRequiredProperty('value', TypeCode.Float);
    }
}
