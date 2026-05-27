import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL ?? `postgresql://${process.env.USER}@localhost:5432/sirboxalot_crm`;

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: DATABASE_URL,
  },
  migrations: {
    seed: "npx ts-node --compiler-options '{\"module\":\"CommonJS\"}' prisma/seed.ts",
  },
  migrate: {
    async adapter(env) {
      const url = env.DATABASE_URL ?? DATABASE_URL;
      return new PrismaPg({ connectionString: url });
    },
  },
});
