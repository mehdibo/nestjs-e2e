import type { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

export type DatabaseType = 'postgresql' | 'mysql';

export async function emptyDatabase(prismaClient: PrismaClient, database: DatabaseType): Promise<void> {
  let sql = '';
  switch (database) {
    case 'postgresql':
      sql = 'TRUNCATE "$TABLE_NAME" RESTART IDENTITY CASCADE';
      break;
    case 'mysql':
      sql = 'TRUNCATE TABLE "$TABLE_NAME"';
  }

  for (const key in Prisma.ModelName) {
    const tableName = Prisma.ModelName[key as keyof typeof Prisma.ModelName];

    await prismaClient.$queryRawUnsafe(
      sql.replace('$TABLE_NAME', tableName),
    );
  }
}