import {Test} from "@nestjs/testing";
import {DynamicModule, ModuleMetadata} from "@nestjs/common";
import {createTestingModule} from "../src/create-testing-module";

describe('createTestingModule', () => {
    it('should use ModuleMetadata when passed', async () => {
        jest.mock('@nestjs/testing');
        const createTestingModuleMock = jest.fn().mockReturnValue({
            compile: jest.fn(),
        });
        const moduleMetadata: ModuleMetadata = {
            imports: [{
                module: Test,
            }],
            exports: ['test'],
        };
        Test.createTestingModule = createTestingModuleMock;
        await createTestingModule(moduleMetadata);
        expect(createTestingModuleMock).toHaveBeenCalledWith({
            imports: [{
                module: Test,
            }],
            exports: ['test'],
        });
    });

    it('should use DynamicModule when passed', async () => {
        jest.mock('@nestjs/testing');
        const createTestingModuleMock = jest.fn().mockReturnValue({
            compile: jest.fn(),
        });
        const module: DynamicModule = {
            module: Test,
            global: false,
        };
        Test.createTestingModule = createTestingModuleMock;
        await createTestingModule(module);
        expect(createTestingModuleMock).toHaveBeenCalledWith({
            imports: [module],
        });
    });
});