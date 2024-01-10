import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { countId, title, description, amount, date, authorId, shares } =
    await readBody(event);
  const data: Prisma.ExpenseCreateInput = {
    count: { connect: { id: countId } },
    title,
    description,
    amount,
    date,
    author: { connect: { id: authorId } },
    shares: {
      create: shares.map(({ memberId, fraction, amount }: any) => ({
        member: { connect: { id: memberId } },
        fraction,
        amount,
      })),
    },
  };
  return await prisma.expense.create({ data });
});
