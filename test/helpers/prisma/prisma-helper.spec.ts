import {PrismaClient} from "@prisma/client";
import {PrismaHelper} from "../../../src";

describe('PrismaHelper', () => {
    let prismaClient: PrismaClient;

    beforeEach(() => {
        prismaClient = {
            $queryRawUnsafe: undefined,
        } as unknown as PrismaClient;
    });

    describe("emptyDatabase", () => {
        let prismaHelper: PrismaHelper;

        beforeEach(() => {
            prismaHelper = new PrismaHelper(prismaClient, 'postgresql');
        });

        describe('postgresql', () => {

            it('should delete all available tables if none are passed', async () => {
                prismaClient.$queryRawUnsafe = jest.fn();

                await prismaHelper.emptyDatabase();

                expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledTimes(2);
                expect(prismaClient.$queryRawUnsafe).toHaveBeenNthCalledWith(1, 'TRUNCATE "Dummy" RESTART IDENTITY CASCADE');
                expect(prismaClient.$queryRawUnsafe).toHaveBeenNthCalledWith(2, 'TRUNCATE "Test" RESTART IDENTITY CASCADE');
            })

            it('should only delete passed tables', async () => {
                prismaClient.$queryRawUnsafe = jest.fn();

                await prismaHelper.emptyDatabase(['Test']);

                expect(prismaClient.$queryRawUnsafe).toHaveBeenCalledTimes(1);
                expect(prismaClient.$queryRawUnsafe).toHaveBeenNthCalledWith(1, 'TRUNCATE "Test" RESTART IDENTITY CASCADE');
            })
        });
    })
});