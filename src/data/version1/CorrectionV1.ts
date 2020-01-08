import { IStringIdentifiable } from 'pip-services3-commons-node';

import { CorrectionChangeV1 } from './CorrectionChangeV1';

export class CorrectionV1 implements IStringIdentifiable {
    public id: string;
    public org_id: string;

    public object_id?: string;
    public group_id?: string;
    public affected_ids?: string[];
    public time: Date;
    public reason?: string;
    public status: string;

    public create_time?: Date;
    public creator_id?: string;
    public creator_name?: string;

    public close_time?: Date;
    public closer_id?: string;
    public closer_name?: string;

    public changes?: CorrectionChangeV1[];
}