import type {PrismaClient} from '@prisma/client';
import {Prisma} from '@prisma/client';
import {Builder, fixturesIterator, Loader, Parser, Resolver} from "@getbigger-io/prisma-fixtures-cli";

type DatabaseType = 'postgresql' | 'mysql';
type TableName = Prisma.ModelName;

export class PrismaHelper {
    /**
     *
     * @param prismaClient An instance of the generated PrismaClient
     * @param dbType The type of the database Prisma is connected to
     */
    constructor(private readonly prismaClient: PrismaClient, private readonly dbType: DatabaseType) {
    }

    /**
     * Empty the database by deleting rows from all the tables and resetting the ID
     * @param tables An array of tables to empty or undefined to empty all tables
     */
    async emptyDatabase(tables?: TableName[]): Promise<void> {
        let sql = '';
        switch (this.dbType) {
            case 'postgresql':
                sql = 'TRUNCATE "$TABLE_NAME" RESTART IDENTITY CASCADE';
                break;
            case 'mysql':
                sql = 'TRUNCATE TABLE "$TABLE_NAME"';
        }

        for (const key in Prisma.ModelName) {
            if (tables && !tables.includes(key as TableName)) {
                continue;
            }
            const tableName = Prisma.ModelName[key as TableName];

            await this.prismaClient.$queryRawUnsafe(
                sql.replace('$TABLE_NAME', tableName),
            );
        }
    }

    /**
     * Load fixtures using {@link https://github.com/getbigger-io/prisma-fixtures @getbigger-io/prisma-fixtures-cli}
     * @param fixturesPath Path to the directory containing the fixture files
     */
    async loadFixtures(fixturesPath: string): Promise<void> {
        const loader = new Loader();
        const resolver = new Resolver();
        loader.load(fixturesPath);

        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(this.prismaClient, new Parser())
        for (const fixture of fixturesIterator(fixtures)) {
            await builder.build(fixture);
        }
    }
}