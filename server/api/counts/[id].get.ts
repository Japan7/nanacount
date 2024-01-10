export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await prisma.count.findUnique({
    where: { id },
    include: {
      members: true,
      expenses: {
        include: { shares: true },
      },
    },
  });
});
