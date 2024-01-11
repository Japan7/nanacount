<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{ count: CountData }>();

const expenseStore = useExpenseStore();

const dialogId = "new-expense-modal";

const showModal = () => {
  (document.getElementById(dialogId) as HTMLDialogElement).showModal();
};

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
  (document.getElementById(dialogId) as HTMLDialogElement).close();
  refreshNuxtData();
};
</script>

<template>
  <button
    class="btn btn-primary btn-block h-full"
    @click="
      () => {
        expenseStore.$reset();
        console.log(expenseStore.shares);

        for (const m of count?.members ?? []) {
          expenseStore.shares[m.id] = { fraction: 1, amount: '' };
        }
        showModal();
      }
    "
  >
    <PlusIcon class="h-6 w-6" />
  </button>

  <ExpenseModalDialog
    title="New Expense"
    :count="count"
    :dialog-id="dialogId"
    :submit="submit"
  />
</template>
