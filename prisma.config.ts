import { defineConfig } from "prisma/config";

const DATABASE_URL = process.env.DATABASE_URL ?? `postgresql://${process.env.USER}@localhost:5432/sirboxalot_crm`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: "npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
  },
});
