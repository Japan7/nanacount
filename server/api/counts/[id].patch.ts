import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")!;
  const { title, description, currency, members } = await readBody(event);
  const data: Prisma.CountUpdateInput = {
    title,
    description,
    currency,
    members: {
      connectOrCreate: members.map((name: string) => ({
        create: { name },
        where: { name_countId: { name, countId: id } },
      })),
    },
  };

  const [update, _] = await prisma.$transaction([
    prisma.count.update({ data, where: { id } }),
    prisma.member.deleteMany({
      where: {
        AND: [{ countId: { equals: id } }, { name: { notIn: members } }],
      },
    }),
  ]);

  return update;
});
