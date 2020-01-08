import { IStringIdentifiable } from 'pip-services3-commons-node';
import { CorrectionChangeV1 } from './CorrectionChangeV1';
export declare class CorrectionV1 implements IStringIdentifiable {
    id: string;
    org_id: string;
    object_id?: string;
    group_id?: string;
    affected_ids?: string[];
    time: Date;
    reason?: string;
    status: string;
    create_time?: Date;
    creator_id?: string;
    creator_name?: string;
    close_time?: Date;
    closer_id?: string;
    closer_name?: string;
    changes?: CorrectionChangeV1[];
}
