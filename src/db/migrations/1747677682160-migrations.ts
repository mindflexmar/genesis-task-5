import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateSubscriptionTable1747677682160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "subscription",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true
                },
                {
                    name: "frequency",
                    type: "varchar"
                },
                {
                    name: "city",
                    type: "varchar"
                },
                {
                    name: "confirmed",
                    type: "boolean",
                    default: false
                },
                {
                    name: "confirmationToken",
                    type: "varchar"
                }
            ]
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("subscription");
    }
}
