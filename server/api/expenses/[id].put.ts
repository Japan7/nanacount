import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, "id");
  const id = parseInt(paramId!);

  const { countId, title, description, amount, date, authorId, shares } =
    await readBody(event);

  const data: Prisma.ExpenseUpdateInput = {
    count: { connect: { id: countId } },
    title,
    description,
    amount: JSON.stringify(amount),
    date,
    author: { connect: { id: authorId } },
    shares: {
      create: shares.map(({ memberId, fraction, amount }: any) => ({
        member: { connect: { id: memberId } },
        fraction,
        amount: JSON.stringify(amount),
      })),
    },
  };

  const [_, update] = await prisma.$transaction([
    prisma.share.deleteMany({ where: { expenseId: { equals: id } } }),
    prisma.expense.update({ where: { id }, data }),
  ]);

  return update;
});
