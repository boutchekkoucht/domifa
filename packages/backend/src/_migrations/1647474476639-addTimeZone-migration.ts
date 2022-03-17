import { DEPARTEMENTS_MAP } from "../util/territoires/constants/REGIONS_DEPARTEMENTS_MAP.const";

import { MigrationInterface, QueryRunner } from "typeorm";
import { structureRepository } from "../database";
import { appLogger } from "../util";
import { domifaConfig } from "../config";

export class addTimeZoneMigration1647474476639 implements MigrationInterface {
  name = "addTimeZoneMigration1647474476639";

  public async up(_queryRunner: QueryRunner): Promise<void> {
    if (
      domifaConfig().envId === "prod" ||
      domifaConfig().envId === "preprod" ||
      domifaConfig().envId === "local"
    ) {
      appLogger.warn("[MIGRATION] Récupération des structures");

      // Récupérer l'URL Seo à partir de l'ID
      const REGIONS_TIMEZONES: string[] = Object.values(
        DEPARTEMENTS_MAP
      ).reduce((acc, value) => {
        acc[value.regionId] = value.timeZone;
        return acc;
      }, []);

      const structures = await structureRepository.count({
        where: {
          timeZone: null,
        },
      });

      appLogger.warn(
        "[MIGRATION] " + structures + " structures à mettre à jour"
      );

      for (const region of REGIONS_TIMEZONES) {
        console.log(region);

        await (
          await structureRepository.typeorm()
        )
          .createQueryBuilder("structure")
          .update()
          .set({ timeZone: REGIONS_TIMEZONES[region] })
          .where({
            timeZone: null,
            region,
          })
          .execute();
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "structure" DROP COLUMN "timeZone"`);
  }
}
