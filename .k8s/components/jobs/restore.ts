import { getDevDatabaseParameters } from "@socialgouv/kosko-charts/components/azure-pg/params";
import environments from "@socialgouv/kosko-charts/environments";
import { Job } from "kubernetes-models/batch/v1";

const ciEnv = environments(process.env);
const pgParams = getDevDatabaseParameters({ suffix: ciEnv.branchSlug });

const job = new Job({
  metadata: {
    name: "restore-db",
    namespace: ciEnv.metadata.namespace.name,
    labels: ciEnv.metadata.labels,
    annotations: ciEnv.metadata.annotations,
  },
  spec: {
    template: {
      metadata: {},
      spec: {
        volumes: [
          {
            name: "restore-db-volume",
            emptyDir: {},
          },
        ],
        initContainers: [
          {
            name: "restore-db-init",
            image: "alpine/git:v2.30.2",
            command: ["git"],
            args: [
              "clone",
              "-b",
              `${ciEnv.branch}`,
              "--single-branch",
              "--depth=1",
              "https://github.com/SocialGouv/domifa.git",
              "/mnt/domifa",
            ],
            volumeMounts: [
              {
                name: "restore-db-volume",
                mountPath: "/mnt/domifa",
              },
            ],
          },
        ],
        containers: [
          {
            name: "restore-db",
            image: "postgres:10.16",
            command: ["sh", "-c"],
            args: [
              "psql < /mnt/domifa/_scripts/db/dumps/domifa_test.postgres.truncate-restore-data-only.sql",
            ],
            envFrom: [
              {
                secretRef: {
                  name: "azure-pg-admin-user",
                },
              },
            ],
            env: [
              {
                name: "PGDATABASE",
                value: pgParams.database,
              },
            ],
            volumeMounts: [
              {
                name: "restore-db-volume",
                mountPath: "/mnt/domifa",
              },
            ],
          },
        ],
        restartPolicy: "OnFailure",
      },
    },
    ttlSecondsAfterFinished: 86400,
  },
});

export default [job];
