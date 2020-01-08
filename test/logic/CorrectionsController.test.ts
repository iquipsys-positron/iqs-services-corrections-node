let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { OrganizationV1 } from 'pip-clients-organizations-node';
import { OrganizationsMemoryClientV1 } from 'pip-clients-organizations-node';
import { ControlObjectsNullClientV1 } from 'iqs-clients-controlobjects-node';
import { StatisticsNullClientV1 } from 'pip-clients-statistics-node';

import { CorrectionV1 } from '../../src/data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../../src/data/version1/CorrectionStatusV1';
import { ParameterNameV1 } from '../../src/data/version1/ParameterNameV1';
import { CorrectionsMemoryPersistence } from '../../src/persistence/CorrectionsMemoryPersistence';
import { CorrectionsController } from '../../src/logic/CorrectionsController';

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
    time: new Date(),
    changes: [
        {
            param_name: ParameterNameV1.Distance,
            value: 35
        },
        {
            zone_id: '1',
            value: 75
        }
    ]
};

suite('CorrectionsController', ()=> {    
    let persistence: CorrectionsMemoryPersistence;
    let controller: CorrectionsController;

    suiteSetup(() => {
        persistence = new CorrectionsMemoryPersistence();
        controller = new CorrectionsController();

        let organizationsClient = new OrganizationsMemoryClientV1();
        organizationsClient.createOrganization(null, { id: '1', name: 'Test organization', active: true }, (err, organization) => {});

        let references: References = References.fromTuples(
            new Descriptor('iqs-services-corrections', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-corrections', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-organizations', 'client', 'memory', 'default', '1.0'), organizationsClient,
            new Descriptor('iqs-services-controlobjects', 'client', 'null', 'default', '1.0'), new ControlObjectsNullClientV1(),
            new Descriptor('pip-services-statistics', 'client', 'null', 'default', '1.0'), new StatisticsNullClientV1()
        );
        controller.setReferences(references);
    });
    
    setup((done) => {
        persistence.clear(null, done);
    });
    
    
    test('CRUD Operations', (done) => {
        let correction1, correction2;

        async.series([
        // Create one correction
            (callback) => {
                controller.createCorrection(
                    null, CORRECTION1,
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
                controller.createCorrection(
                    null, CORRECTION2,
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
                controller.getCorrections(
                    null, null, null,
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

                controller.updateCorrection(
                    null, correction1,
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
                controller.deleteCorrectionById(
                    null, correction1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete correction
            (callback) => {
                controller.getCorrectionById(
                    null, correction1.id,
                    (err, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});