// @ts-check
/** @type {import("prisma/config").PrismaConfig} */
export default {
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
};
