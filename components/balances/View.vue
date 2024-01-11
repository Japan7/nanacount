<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const balances = computed(() =>
  props.count ? computeBalances(props.count.expenses, props.count.members) : []
);
</script>

<template>
  <main class="space-y-2">
    <BalancesChart
      :members="count.members"
      :balances="balances"
      :current-member="currentMember"
    />
    <BalancesTable
      :count="count"
      :members="count.members"
      :balances="balances"
      :current-member="currentMember"
    />
  </main>
</template>
