import * as Prisma from "@@/generated/prisma/models";

export default defineEventHandler(async (event) => {
  const { title, description, currency, members } = await readBody(event);
  const data: Prisma.CountCreateInput = {
    title,
    description,
    currency: JSON.stringify(currency),
    members: {
      create: members.map((name: string) => ({ name })),
    },
  };
  return await prisma.count.create({ data });
});
