export default defineEventHandler(async (event) => {
  const paramId = getRouterParam(event, "id");
  const id = parseInt(paramId!);
  return await prisma.expense.delete({ where: { id } });
});
