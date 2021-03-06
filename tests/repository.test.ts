// @ts-ignore
import {TestModelAsync} from "./TestModel";
// @ts-ignore
import {AsyncRamRepository, KeylessTestRamRepository, TestRamRepository} from "./TestRepository";
import {AsyncRepository, Err, InjectableRegistryImp, setInjectablesRegistry} from "../src";

describe(`Async Repository`, function(){

    const testModel = new TestModelAsync();

    beforeEach(() => {
        setInjectablesRegistry(new InjectableRegistryImp());
    });

    it(`Instantiates`, function(){
        const testRepository: AsyncRepository<TestModelAsync> = new TestRamRepository();
        expect(testRepository).not.toBeNull();
    });

    it(`Fills Properties Nicely`, function(testFinished){
        const testRepository: AsyncRepository<TestModelAsync> = new TestRamRepository();

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
});

describe(`Keyless Async Repository`, function(){

    const testModel = new TestModelAsync();

    beforeEach(() => {
        setInjectablesRegistry(new InjectableRegistryImp());
    });

    it(`Instantiates`, function(){
        const testRepository: AsyncRepository<TestModelAsync> = new KeylessTestRamRepository();
        expect(testRepository).not.toBeNull();
    });

    it(`Fills Properties Nicely`, function(testfinished){
        const testRepository: KeylessTestRamRepository = new KeylessTestRamRepository();

        testRepository.create(testModel, (err: Err, result?: TestModelAsync) => {
            expect(err).toBeUndefined();
            expect(result).toBeDefined();
            if (result){
                expect(result.id).toBeDefined();
                expect(result.updatedOn).toBeDefined();
                expect(result.createdOn).toBeDefined();
            }
            testfinished();
        });
    });
});