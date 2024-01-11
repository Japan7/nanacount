<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const balances = computed(() =>
  props.count ? computeBalances(props.count.expenses, props.count.members) : []
);
</script>

<template>
  <main class="space-y-2">
    <div tabindex="0" class="collapse collapse-arrow card-bordered">
      <input type="checkbox" />
      <div class="collapse-title card-title">Balance Chart</div>
      <div class="collapse-content h-fit">
        <BalancesChart
          :members="count.members"
          :balances="balances"
          :current-member="currentMember"
        />
      </div>
    </div>

    <BalancesTable
      :count="count"
      :members="count.members"
      :balances="balances"
      :current-member="currentMember"
    />
  </main>
</template>
