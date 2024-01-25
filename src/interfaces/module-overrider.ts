import {TestingModuleBuilder} from "@nestjs/testing";

export interface ModuleOverrider {
     override(moduleBuilder: TestingModuleBuilder): void;
}