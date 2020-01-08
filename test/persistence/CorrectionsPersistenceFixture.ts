let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { CorrectionV1 } from '../../src/data/version1/CorrectionV1';
import { CorrectionStatusV1 } from '../../src/data/version1/CorrectionStatusV1';

import { ICorrectionsPersistence } from '../../src/persistence/ICorrectionsPersistence';

let fromTime = new Date();

let CORRECTION1: CorrectionV1 = {
    id: '1',
    org_id: '1',
    status: CorrectionStatusV1.Requested,
    object_id: '1',
    time: new Date(),
    create_time: new Date()
};
let CORRECTION2: CorrectionV1 = {
    id: '2',
    org_id: '1',
    status: CorrectionStatusV1.Approved,
    object_id: '1',
    time: new Date(),
    create_time: new Date()
};

let toTime = new Date(fromTime.getTime() + 1000);

let CORRECTION3: CorrectionV1 = {
    id: '3',
    org_id: '2',
    status: CorrectionStatusV1.Requested,
    object_id: '2',
    time: toTime,
    create_time: new Date()
};

export class CorrectionsPersistenceFixture {
    private _persistence: ICorrectionsPersistence;
    
    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    private testCreateCorrections(done) {
        async.series([
        // Create one correction
            (callback) => {
                this._persistence.create(
                    null,
                    CORRECTION1,
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.org_id, CORRECTION1.org_id);
                        assert.equal(correction.status, CORRECTION1.status);
                        assert.equal(correction.object_id, CORRECTION1.object_id);

                        callback();
                    }
                );
            },
        // Create another correction
            (callback) => {
                this._persistence.create(
                    null,
                    CORRECTION2,
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.org_id, CORRECTION2.org_id);
                        assert.equal(correction.status, CORRECTION2.status);
                        assert.equal(correction.object_id, CORRECTION2.object_id);

                        callback();
                    }
                );
            },
        // Create yet another correction
            (callback) => {
                this._persistence.create(
                    null,
                    CORRECTION3,
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.org_id, CORRECTION3.org_id);
                        assert.equal(correction.status, CORRECTION3.status);
                        assert.equal(correction.object_id, CORRECTION3.object_id);

                        callback();
                    }
                );
            }
        ], done);
    }
                
    public testCrudOperations(done) {
        let correction1: CorrectionV1;

        async.series([
        // Create items
            (callback) => {
                this.testCreateCorrections(callback);
            },
        // Get all corrections
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    new FilterParams(),
                    new PagingParams(),
                    (err, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        correction1 = page.data[0];

                        callback();
                    }
                );
            },
        // Update the correction
            (callback) => {
                correction1.reason = 'Updated correction 1';

                this._persistence.update(
                    null,
                    correction1,
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isObject(correction);
                        assert.equal(correction.reason, 'Updated correction 1');
                        assert.equal(correction.id, correction1.id);

                        callback();
                    }
                );
            },
        // Delete correction
            (callback) => {
                this._persistence.deleteById(
                    null,
                    correction1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete correction
            (callback) => {
                this._persistence.getOneById(
                    null,
                    correction1.id,
                    (err, correction) => {
                        assert.isNull(err);

                        assert.isNull(correction || null);

                        callback();
                    }
                );
            }
        ], done);
    }

    public testGetWithFilter(done) {
        async.series([
        // Create corrections
            (callback) => {
                this.testCreateCorrections(callback);
            },
        // Get corrections filtered by org_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        org_id: '1'
                    }),
                    new PagingParams(),
                    (err, corrections) => {
                        assert.isNull(err);

                        assert.isObject(corrections);
                        assert.lengthOf(corrections.data, 2);

                        callback();
                    }
                );
            },
        // Get corrections filtered by status
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                        status: CorrectionStatusV1.Requested
                    }),
                    new PagingParams(),
                    (err, corrections) => {
                        assert.isNull(err);

                        assert.isObject(corrections);
                        assert.lengthOf(corrections.data, 2);

                        callback();
                    }
                );
            },
        // Get corrections filtered by object_id
            (callback) => {
                this._persistence.getPageByFilter(
                    null,
                    FilterParams.fromValue({
                         object_id: '1'
                    }),
                    new PagingParams(),
                    (err, corrections) => {
                        assert.isNull(err);

                        assert.isObject(corrections);
                        assert.lengthOf(corrections.data, 2);

                        callback();
                    }
                );
            }
        ], done);
    }

}
