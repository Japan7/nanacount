<script setup lang="ts">
const route = useRoute();
const countId = route.params.id as string;

const { data, pending, error, refresh } = await useFetch(
  `/api/counts/${countId}`
);
export type CountData = typeof data extends Ref<infer T> ? T : never;

const sortedMembers = computed(
  () => data.value?.members.sort((a, b) => a.name.localeCompare(b.name)) ?? []
);

const tabId = ref(0);

const currentMemberStr = useLocalStorage(`${countId}_currentMember`, "");
const currentMember = computed(() => {
  const id = currentMemberStr.value;
  return id ? parseInt(id) : undefined;
});
</script>

<template>
  <div class="container mx-auto p-2 flex flex-col gap-y-2">
    <Header :count="data" />

    <select class="select select-bordered select-sm" v-model="currentMemberStr">
      <option disabled selected value="">Identify as…</option>
      <option v-for="m in sortedMembers" :value="m.id">{{ m.name }}</option>
    </select>

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

    <ExpensesView
      v-if="tabId === 0"
      :count="data"
      :current-member="currentMember"
    />
    <BalancesView v-else-if="tabId === 1" :count="data" />
  </div>
</template>
