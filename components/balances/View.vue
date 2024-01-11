<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const sortedMembers = computed(
  () => props.count?.members.sort((a, b) => a.name.localeCompare(b.name)) ?? []
);

const balances = computed(() => {
  if (!props.count) {
    return [];
  }
  const count = props.count;

  const resolved = count.expenses.map((e) =>
    splitExpense(
      e.amount,
      e.shares.map((s) => ({
        fraction: s.fraction !== null ? s.fraction : undefined,
        amount: s.amount !== null ? s.amount : undefined,
      }))
    )
  );

  return sortedMembers.value.map((m) => {
    return count.expenses.reduce((acc, e, i) => {
      const idx = e.shares.findIndex((s) => s.memberId === m.id);
      const share = idx !== -1 ? resolved[i][idx] : 0;
      if (e.authorId === m.id) {
        return acc + (e.amount - share);
      } else {
        return acc - share;
      }
    }, 0);
  });
});
</script>

<template>
  <main class="space-y-2">
    <BalancesChart
      :members="sortedMembers"
      :balances="balances"
      :current-member="currentMember"
    />
    <BalancesReimbTable
      :count="count"
      :members="sortedMembers"
      :balances="balances"
      :current-member="currentMember"
    />
  </main>
</template>
