<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const balances = computed(() =>
  props.count ? computeBalances(props.count.expenses, props.count.members) : []
);

const checkbox = ref(false);
</script>

<template>
  <main class="space-y-2">
    <div class="collapse collapse-arrow card-bordered">
      <input v-model="checkbox" type="checkbox" />
      <div class="collapse-title card-title">Balance Chart</div>
      <div v-if="checkbox" class="collapse-content h-fit">
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
