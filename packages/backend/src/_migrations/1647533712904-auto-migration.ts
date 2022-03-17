import { MigrationInterface, QueryRunner } from "typeorm";

export class autoMigration1647533712904 implements MigrationInterface {
  name = "autoMigration1647533712904";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usager" ALTER COLUMN "options" SET DEFAULT '{ "transfert":{ "actif":false, "nom":null, "adresse":null, "dateDebut":null, "dateFin":null }, "procurations":[], "npai":{ "actif":false, "dateDebut":null }, "portailUsagerEnabled":false }'`
    );
    await queryRunner.query(
      `ALTER TABLE "interactions" ALTER "dateInteraction" TYPE timestamptz;`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
