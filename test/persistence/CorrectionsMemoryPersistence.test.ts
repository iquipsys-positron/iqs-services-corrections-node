import { ConfigParams } from 'pip-services3-commons-node';

import { CorrectionsMemoryPersistence } from '../../src/persistence/CorrectionsMemoryPersistence';
import { CorrectionsPersistenceFixture } from './CorrectionsPersistenceFixture';

suite('CorrectionsMemoryPersistence', ()=> {
    let persistence: CorrectionsMemoryPersistence;
    let fixture: CorrectionsPersistenceFixture;
    
    setup((done) => {
        persistence = new CorrectionsMemoryPersistence();
        persistence.configure(new ConfigParams());
        
        fixture = new CorrectionsPersistenceFixture(persistence);
        
        persistence.open(null, done);
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