<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const sortedMembers = computed(
  () => props.count?.members.sort((a, b) => a.name.localeCompare(b.name)) ?? []
);

const balances = computed(() =>
  props.count ? computeBalances(props.count.expenses, sortedMembers.value) : []
);
</script>

<template>
  <main class="space-y-2">
    <BalancesChart
      :members="sortedMembers"
      :balances="balances"
      :current-member="currentMember"
    />
    <BalancesReimbursementsTable
      :count="count"
      :members="sortedMembers"
      :balances="balances"
      :current-member="currentMember"
    />
  </main>
</template>
