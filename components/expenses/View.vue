<script setup lang="ts">
const props = defineProps<{ count: CountData; currentMember?: number }>();

const sortedExpenses = computed(() =>
  props.count?.expenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
);
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
    <div class="card bg-base-200 cursor-default"></div>

    <div class="cursor-default">
      <NewExpenseModal :count="count" />
    </div>

    <div class="card bg-base-200 cursor-default"></div>
  </div>
</template>
