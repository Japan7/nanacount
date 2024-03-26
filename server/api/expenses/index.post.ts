import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const {
    countId,
    title,
    description,
    amount,
    originalAmount,
    date,
    authorId,
    shares,
  } = await readBody(event);
  const data: Prisma.ExpenseCreateInput = {
    count: { connect: { id: countId } },
    title,
    description,
    amount: JSON.stringify(amount),
    originalAmount: JSON.stringify(originalAmount),
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
  return await prisma.expense.create({ data });
});
