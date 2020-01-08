let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { OrganizationV1 } from 'pip-clients-organizations-node';
import { OrganizationsMemoryClientV1 } from 'pip-clients-organizations-node';

import { CorrectionV1 } from '../../../src/data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../../../src/data/version1/CorrectionStatusV1';
import { CorrectionsMemoryPersistence } from '../../../src/persistence/CorrectionsMemoryPersistence';
import { CorrectionsController } from '../../../src/logic/CorrectionsController';
import { CorrectionsHttpServiceV1 } from '../../../src/services/version1/CorrectionsHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

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

suite('CorrectionsHttpServiceV1', ()=> {    
    let service: CorrectionsHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new CorrectionsMemoryPersistence();
        let controller = new CorrectionsController();

        service = new CorrectionsHttpServiceV1();
        service.configure(httpConfig);

        let organizationsClient = new OrganizationsMemoryClientV1();
        organizationsClient.createOrganization(null, { id: '1', name: 'Test organization', active: true }, (err, organization) => {});
        
        let references: References = References.fromTuples(
            new Descriptor('iqs-services-corrections', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('iqs-services-corrections', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('iqs-services-corrections', 'service', 'http', 'default', '1.0'), service,
            new Descriptor('pip-services-organizations', 'client', 'memory', 'default', '1.0'), organizationsClient
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });
    
    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });
    
    
    test('CRUD Operations', (done) => {
        let correction1, correction2;

        async.series([
        // Create one correction
            (callback) => {
                rest.post('/v1/corrections/create_correction',
                    {
                        correction: CORRECTION1
                    },
                    (err, req, res, correction) => {
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
                rest.post('/v1/corrections/create_correction', 
                    {
                        correction: CORRECTION2
                    },
                    (err, req, res, correction) => {
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
                rest.post('/v1/corrections/get_corrections',
                    {},
                    (err, req, res, page) => {
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

                rest.post('/v1/corrections/update_correction',
                    { 
                        correction: correction1
                    },
                    (err, req, res, correction) => {
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
                rest.post('/v1/corrections/delete_correction_by_id',
                    {
                        correction_id: correction1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            },
        // Try to get delete correction
            (callback) => {
                rest.post('/v1/corrections/get_correction_by_id',
                    {
                        correction_id: correction1.id
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        //assert.isNull(result);

                        callback();
                    }
                );
            }
        ], done);
    });
});