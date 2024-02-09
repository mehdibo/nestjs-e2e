import {Test, TestingModule} from "@nestjs/testing";
import type {DynamicModule, INestApplication, ModuleMetadata, Type} from "@nestjs/common";
import {ModuleOverrider} from "./interfaces/module-overrider";

function isModuleMetadata(conf: ModuleMetadata | Type<any>): conf is ModuleMetadata {
    return (conf as ModuleMetadata).exports !== undefined;
}

/**
 * Create the testing module passing the whole module data
 * @param moduleMetadata The module metadata object
 * @param overriders An array of module overriders
 */
export async function createTestingModule(moduleMetadata: ModuleMetadata, overriders?: Array<ModuleOverrider>): Promise<TestingModule>;

/**
 * Create the testing module importing
 * @param module The module to import
 * @param overriders An array of module overriders
 */
export async function createTestingModule(module: Type<any>, overriders?: Array<ModuleOverrider>): Promise<TestingModule>;

/**
 * Create the testing module using a module or with a costume module metadata
 * @param conf
 * @param overriders
 */
export function createTestingModule(conf: ModuleMetadata | Type<any>, overriders?: Array<ModuleOverrider>): Promise<TestingModule> {
    let moduleMetadata: ModuleMetadata = {
        imports: [conf as DynamicModule],
    };
    if (isModuleMetadata(conf)) {
        moduleMetadata = conf;
    }
    const moduleRef = Test.createTestingModule(moduleMetadata);

    if (overriders) {
        for (const overrider of overriders) {
            overrider.override(moduleRef);
        }
    }

    return moduleRef.compile();
}

/**
 * Create the Nest application and initialize it
 * @param testingModule
 */
export async function createApplication(testingModule: TestingModule): Promise<INestApplication> {
    const app = testingModule.createNestApplication();
    await app.init();
    return app;
}
