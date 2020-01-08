import { ConfigParams } from 'pip-services3-commons-node';

import { CorrectionsFilePersistence } from '../../src/persistence/CorrectionsFilePersistence';
import { CorrectionsPersistenceFixture } from './CorrectionsPersistenceFixture';

suite('CorrectionsFilePersistence', ()=> {
    let persistence: CorrectionsFilePersistence;
    let fixture: CorrectionsPersistenceFixture;
    
    setup((done) => {
        persistence = new CorrectionsFilePersistence('./data/corrections.test.json');

        fixture = new CorrectionsPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });
    
    teardown((done) => {
        persistence.close(null, done);
    });
        
    test('CRUD Operations', (done) => {
        fixture.testCrudOperations(done);
    });

    test('Get with Filters', (done) => {
        fixture.testGetWithFilter(done);
    });

});