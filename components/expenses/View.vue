<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const sortedExpenses = computed(() =>
  props.count?.expenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
);

const total = computed(() =>
  props.count?.expenses.reduce((acc, e) => acc + e.amount, 0)
);

const selfTotal = computed(() => {
  return props.count?.expenses.reduce((acc, e) => {
    const resolved = splitExpense(
      e.amount,
      e.shares.map((s) => ({
        fraction: s.fraction !== null ? s.fraction : undefined,
        amount: s.amount !== null ? s.amount : undefined,
      }))
    );

    const idx = e.shares.findIndex((s) => s.memberId === props.currentMember);
    const selfShare = idx !== -1 ? resolved[idx] : 0;
    return acc + selfShare;
  }, 0);
});
</script>

<template>
  <main class="pb-14 flex flex-col gap-y-2">
    <ExpensesCard
      v-for="e in sortedExpenses"
      :count="count"
      :expense="e"
      :current-member="currentMember"
    />
  </main>

  <div class="btm-nav container mx-auto p-1 gap-x-1">
    <div class="card card-compact bg-base-200 text-xs cursor-default">
      <template v-if="currentMember">
        <h3 class="uppercase">My Total</h3>
        <p class="font-bold">€{{ selfTotal }}</p>
      </template>
    </div>

    <div class="cursor-default">
      <NewExpenseModal :count="count" />
    </div>

    <div class="card card-compact bg-base-200 text-xs cursor-default">
      <h3 class="uppercase">Total Expenses</h3>
      <p class="font-bold">€{{ total }}</p>
    </div>
  </div>
</template>
