import { PrismaClient } from '@prisma/client'
import {Builder, fixturesIterator, Loader, Parser, Resolver} from "@getbigger-io/prisma-fixtures-cli";

export async function loadFixtures(fixturesPath: string, prismaClient: PrismaClient) {
    const loader = new Loader();
    const resolver = new Resolver();
    loader.load(fixturesPath);

    const fixtures = resolver.resolve(loader.fixtureConfigs);
    const builder = new Builder(prismaClient, new Parser())
    for (const fixture of fixturesIterator(fixtures)) {
        await builder.build(fixture);
    }
}