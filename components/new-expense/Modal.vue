<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{ count: CountData }>();

const expenseFormStore = useExpenseFormStore();

const modalRef = ref<HTMLDialogElement | null>(null);

const submit = async () => {
  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count.id,
      title: expenseFormStore.title,
      description: expenseFormStore.description,
      amount: expenseFormStore.amount,
      date: new Date(expenseFormStore.date!).toISOString(),
      authorId: expenseFormStore.author,
      // FIXME: this is really ugly
      shares: Object.entries(expenseFormStore.shares)
        .map(([memberId, share]: [string, ExpenseShares[number]]) => ({
          memberId: parseInt(memberId),
          fraction: share.fraction,
          amount: share.fraction === undefined ? share.amount : undefined,
        }))
        .filter((s) => s.fraction || s.amount),
    }),
  });

  console.log(res);
  modalRef.value!.close();
  refreshNuxtData();
};
</script>

<template>
  <button
    class="btn btn-primary btn-block h-full"
    @click="
      () => {
        expenseFormStore.$reset();
        for (const m of count.members ?? []) {
          expenseFormStore.shares[m.id] = { fraction: 1 };
        }
        modalRef?.showModal();
      }
    "
  >
    <PlusIcon class="h-6 w-6" />
  </button>

  <ExpenseModalDialog
    title="New Expense"
    :setModal="(m) => (modalRef = m)"
    :count="count"
    :submit="submit"
  />
</template>
