// @ts-ignore
import {TestModelAsync} from "./TestModel";
import {
    AsyncRepository,
    Callback,
    Err,
    getLogger,
    InjectableRegistryImp,
    LOGGER_LEVELS,
    setInjectablesRegistry
} from "../src";
// @ts-ignore
import {TransactionalRepository} from "./TestRepository";

jest.setTimeout(1000000)

describe(`Transactional Context Test`, function(){

    const testModel = new TestModelAsync();

    beforeEach(() => {
        setInjectablesRegistry(new InjectableRegistryImp());
    });

    it(`Instantiates`, function(){
        const testRepository: AsyncRepository<TestModelAsync> = new TransactionalRepository(1000, false);
        expect(testRepository).not.toBeNull();
    });

    it(`Fills Properties Nicely`, function(testFinished){
        const testRepository: TransactionalRepository = new TransactionalRepository(1000, false);

        testRepository.create("testModel.id", testModel, (err: Err, result?: TestModelAsync) => {
            expect(err).toBeUndefined();
            expect(result).toBeDefined();
            if (result){
                expect(result.id).toBeDefined();
                expect(result.updatedOn).toBeDefined();
                expect(result.createdOn).toBeDefined();
            }
            testFinished();
        });
    });

    it(`Schedules transactions properly`, (testFinished) => {
        const testRepository: AsyncRepository<TestModelAsync> = new TransactionalRepository(200, false);

        getLogger().setLevel(LOGGER_LEVELS.ALL);
        const {ConsumerRunner, defaultComparer} = require('../bin/Consumer');

        const consumerRunner = new ConsumerRunner("create", true, (identifier: string, callback: Callback) => {

            const tm = new TestModelAsync();
            testRepository.create(Date.now(), tm, (err: Err, model?: TestModelAsync) => {
                try {
                    expect(err).toBeUndefined();
                    expect(model).toBeDefined();
                } catch (e){
                    return callback(e)
                }
                callback(err, model);
            });
        }, defaultComparer);

        consumerRunner.run(5, 100, 5, true, (err: Err) => {
            testFinished(err)
        })
    });
});
