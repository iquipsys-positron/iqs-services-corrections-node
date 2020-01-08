let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-node';
import { ConfigParams } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';
import { ConsoleLogger } from 'pip-services3-components-node';

import { IOrganizationsClientV1 } from 'pip-clients-organizations-node';

import { CorrectionV1 } from '../../src/data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../../src/data/version1/CorrectionStatusV1';
import { CorrectionsMemoryPersistence } from '../../src/persistence/CorrectionsMemoryPersistence';
import { CorrectionsController } from '../../src/logic/CorrectionsController';
import { CorrectionsLambdaFunction } from '../../src/container/CorrectionsLambdaFunction';

let CORRECTION1: CorrectionV1 = {
    id: '1',
    org_id: '1',
    status: CorrectionStatusV1.Requested,
    object_id: '1',
    time: new Date()
};
let CORRECTION2: CorrectionV1 = {
    id: '2',
    org_id: '1',
    status: CorrectionStatusV1.Approved,
    object_id: '1',
    time: new Date()
};

suite('CorrectionsLambdaFunction', ()=> {
    let organizationsClient: IOrganizationsClientV1;
    let lambda: CorrectionsLambdaFunction;

    suiteSetup((done) => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'iqs-services-corrections:persistence:memory:default:1.0',
            'controller.descriptor', 'iqs-services-corrections:controller:default:default:1.0',
            'organizations.descriptor', 'pip-services-organizations:client:memory:default:1.0',
            'controlobjects.descriptor', 'iqs-services-controlobjects:client:null:default:1.0',
        );

        lambda = new CorrectionsLambdaFunction();
        lambda.configure(config);
        lambda.open(null, (err) => {
            if (err) {
                done(err);
                return;
            }

            organizationsClient = lambda.getReferences().getOneRequired<IOrganizationsClientV1>(new Descriptor('pip-services-organizations', 'client', '*', '*', '1.0'));
            organizationsClient.createOrganization(null, { id: '1', name: 'Test organization', create_time: new Date(), creator_id: null, active: true }, () => {});

            done(err);
        });
    });
    
    suiteTeardown((done) => {
        lambda.close(null, done);
    });
    
    test('CRUD Operations', (done) => {
        var correction1, correction2;

        async.series([
        // Create one correction
            (callback) => {
                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'create_correction',
                        correction: CORRECTION1
                    },
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.org_id, CORRECTION1.org_id);
                        assert.equal(correction.status, CORRECTION1.status);
                        assert.equal(correction.object_id, CORRECTION1.object_id);

                        correction1 = correction;

                        callback();
                    }
                );
            },
        // Create another correction
            (callback) => {
                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'create_correction',
                        correction: CORRECTION2
                    },
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.org_id, CORRECTION2.org_id);
                        assert.equal(correction.status, CORRECTION2.status);
                        assert.equal(correction.object_id, CORRECTION2.object_id);

                        correction2 = correction;

                        callback();
                    }
                );
            },
        // Get all corrections
            (callback) => {
                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'get_corrections' 
                    },
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the correction
            (callback) => {
                correction1.reason = 'Updated correction 1';

                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'update_correction',
                        correction: correction1
                    },
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.reason, 'Updated correction 1');
                        assert.equal(correction.id, CORRECTION1.id);

                        correction1 = correction;

                        callback();
                    }
                );
            },
        // Delete correction
            (callback) => {
                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'delete_correction_by_id',
                        correction_id: correction1.id
                    },
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete correction
            (callback) => {
                lambda.act(
                    {
                        role: 'corrections',
                        cmd: 'get_correction_by_id',
                        correction_id: correction1.id
                    },
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isNull(correction || null);

                        callback();
                    }
                );
            }
        ], done);
    });
});