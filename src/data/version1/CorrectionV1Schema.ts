import { ObjectSchema } from 'pip-services3-commons-node';
import { ArraySchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

import { CorrectionChangeV1Schema } from './CorrectionChangeV1Schema';

export class CorrectionV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withRequiredProperty('org_id', TypeCode.String);

        this.withOptionalProperty('object_id', TypeCode.String);
        this.withOptionalProperty('group_id', TypeCode.String);
        this.withOptionalProperty('affected_ids', new ArraySchema(TypeCode.String));
        this.withRequiredProperty('time', TypeCode.DateTime);
        this.withRequiredProperty('status', TypeCode.String);
        this.withOptionalProperty('reason', TypeCode.String);

        this.withOptionalProperty('create_time', TypeCode.DateTime);
        this.withOptionalProperty('creator_id', TypeCode.String);
        this.withOptionalProperty('creator_name', TypeCode.String);

        this.withOptionalProperty('close_time', TypeCode.DateTime);
        this.withOptionalProperty('closer_id', TypeCode.String);
        this.withOptionalProperty('closer_name', TypeCode.String);

        this.withOptionalProperty('changes', new ArraySchema(new CorrectionChangeV1Schema()));
    }
}
