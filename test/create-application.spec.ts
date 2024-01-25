import {TestingModule} from "@nestjs/testing";
import {createApplication} from "../src/create-testing-module";

describe('createApplication', () => {
    it('should create app and initialize it', async () => {
        const init = jest.fn();
        const testingModule = {
            createNestApplication: jest.fn().mockReturnValue({
                init,
            }),
        } as unknown as TestingModule;
        await createApplication(testingModule);
        expect(testingModule.createNestApplication).toHaveBeenCalledTimes(1);
        expect(init).toHaveBeenCalledTimes(1);
    });
});