<script setup lang="ts">
import { PlusIcon } from "@heroicons/vue/24/solid";
import { haveSameCurrency, type Currency, type Dinero } from "dinero.js";

const props = defineProps<{ count: CountData; currentMember?: number }>();

const expenseFormStore = useExpenseFormStore();

const modalRef = ref<HTMLDialogElement | null>(null);

const submit = async () => {
  const countCurrency = JSON.parse(props.count.currency) as Currency<number>;
  const date = new Date(expenseFormStore.date!);

  let amount: Dinero<number> = expenseFormStore.amount!;
  let originalAmount: Dinero<number> | undefined = undefined;

  if (!haveSameCurrency([amount, zero(countCurrency)])) {
    originalAmount = amount;
    amount = await convertTo(amount, countCurrency, date);
  }

  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count.id,
      title: expenseFormStore.title,
      description: expenseFormStore.description,
      amount,
      originalAmount,
      date: date.toISOString(),
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
        expenseFormStore.author = currentMember;
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
