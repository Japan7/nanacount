<script setup lang="ts">
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  CreditCardIcon,
} from "@heroicons/vue/24/solid";

const route = useRoute();
const countId = route.params.id as string;

const { data, pending, error, refresh } = await useFetch(
  `/api/counts/${countId}`
);

const loadingIndicator = useLoadingIndicator();
watchEffect(() => {
  pending.value ? loadingIndicator.start() : loadingIndicator.finish();
});

useHead({
  titleTemplate: `${data.value?.title} | %s`,
});

watchEffect(() => {
  if (data.value) {
    data.value.members.sort((a, b) => a.name.localeCompare(b.name));
  }
});

const tabId = ref(0);

const currentMemberStr = useLocalStorage(`${countId}_currentMember`, "");
const currentMember = computed(() =>
  currentMemberStr.value ? parseInt(currentMemberStr.value) : undefined
);
</script>

<template>
  <div
    v-if="!pending && data"
    class="container mx-auto p-2 flex flex-col gap-y-2"
  >
    <Header :count="data" />

    <div class="flex gap-x-2">
      <select
        class="flex-1 select select-bordered select-sm"
        v-model="currentMemberStr"
      >
        <option disabled selected value="">Identify as…</option>
        <option v-for="m in data.members" :value="m.id">{{ m.name }}</option>
      </select>
      <button class="btn btn-sm btn-success" @click="refresh()">
        <ArrowPathIcon class="h-4 w-4" />
      </button>
    </div>

    <div role="tablist" class="lg:hidden tabs tabs-boxed sticky top-2 z-50">
      <a
        role="tab"
        class="tab space-x-2"
        :class="{ 'tab-active': tabId === 0 }"
        @click="tabId = 0"
      >
        <CreditCardIcon class="h-4 w-4" />
        <span>Expenses</span>
      </a>
      <a
        role="tab"
        class="tab space-x-2"
        :class="{ 'tab-active': tabId === 1 }"
        @click="tabId = 1"
      >
        <ArrowsRightLeftIcon class="h-4 w-4" />
        <span>Balances</span>
      </a>
    </div>

    <div class="lg:grid grid-cols-2 gap-4">
      <ExpenseListView
        class="lg:block"
        :class="{ hidden: tabId !== 0 }"
        :count="data"
        :current-member="currentMember"
      />
      <BalancesView
        class="lg:block lg:pb-14"
        :class="{ hidden: tabId !== 1 }"
        :count="data"
        :current-member="currentMember"
      />
    </div>
  </div>
</template>
