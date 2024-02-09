import type {PrismaClient} from '@prisma/client';
import {Prisma} from '@prisma/client';

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
}