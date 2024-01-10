<script setup lang="ts">
const route = useRoute();
const countId = route.params.id as string;

const tabId = ref(0);
</script>

<template>
  <div class="container mx-auto p-2 flex flex-col gap-y-2">
    <Header :count-id="countId" />

    <div role="tablist" class="tabs tabs-boxed sticky top-2 z-50">
      <a
        v-for="(name, i) in ['Expenses', 'Balances']"
        role="tab"
        class="tab"
        :class="{ 'tab-active': tabId === i }"
        @click="tabId = i"
      >
        {{ name }}
      </a>
    </div>

    <ExpensesView v-if="tabId === 0" :count-id="countId" />
    <BalancesView v-else-if="tabId === 1" :count-id="countId" />
  </div>
</template>
