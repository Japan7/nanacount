import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { title, description, currency, members } = await readBody(event);
  const data: Prisma.NanacountCreateInput = {
    title,
    description,
    currency,
    members: {
      create: members.map((name: string) => ({ name })),
    },
  };
  return await prisma.nanacount.create({ data });
});
