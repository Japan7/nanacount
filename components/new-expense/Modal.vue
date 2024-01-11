<script setup lang="ts">
import {
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps<{ count: CountData }>();

const modalRef = ref<HTMLDialogElement | null>(null);

const expenseStore = useExpenseStore();

const formValid = computed(
  () =>
    expenseStore.title &&
    expenseStore.amount &&
    expenseStore.date &&
    expenseStore.author
);

const submit = async () => {
  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count!.id,
      title: expenseStore.title,
      // description: description.value,
      amount: expenseStore.amount,
      date: new Date(expenseStore.date!).toISOString(),
      authorId: expenseStore.author,
      // FIXME: this is really ugly
      shares: Object.entries(expenseStore.shares)
        .map(([memberId, share]) => ({
          memberId: parseInt(memberId),
          fraction: share.fraction !== "" ? share.fraction : undefined,
          amount: share.fraction === "" ? share.amount : undefined,
        }))
        .filter((s) => s.fraction || s.amount),
    }),
  });

  console.log(res);
  modalRef.value?.close();
  refreshNuxtData();
};
</script>

<template>
  <button
    class="btn btn-primary btn-block h-full"
    @click="
      () => {
        expenseStore.$reset();
        for (const m of count?.members ?? []) {
          expenseStore.shares[m.id] = { fraction: 1, amount: '' };
        }
        modalRef?.showModal();
      }
    "
  >
    <PlusIcon class="h-6 w-6" />
  </button>

  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box prose">
      <h2>New Expense</h2>

      <div role="tablist" class="tabs tabs-boxed not-prose">
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': expenseStore.tabId === 0 }"
          @click="expenseStore.tabId = 0"
        >
          <DocumentTextIcon class="h-4 w-4" />
          <span>Infos</span>
        </a>
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': expenseStore.tabId === 1 }"
          @click="expenseStore.tabId = 1"
        >
          <UserGroupIcon class="h-4 w-4" />
          <span>Participants</span>
        </a>
      </div>

      <NewExpenseInfos
        v-if="expenseStore.tabId === 0"
        v-model:title="expenseStore.title"
        v-model:amount="expenseStore.amount"
        v-model:date="expenseStore.date"
        v-model:author="expenseStore.author"
        :count="count"
        class="mt-4"
      />
      <NewExpenseParticipants
        v-else-if="expenseStore.tabId === 1"
        v-model="expenseStore.shares"
        :count="count"
        :expense-amount="expenseStore.amount ?? 0"
      />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancel</button>
        </form>
        <button
          class="btn btn-primary btn-wide"
          :disabled="!formValid"
          @click="submit"
        >
          Save
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
