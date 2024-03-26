<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/solid";
import {
  add,
  dinero,
  haveSameCurrency,
  type Currency,
  type Dinero,
} from "dinero.js";

const props = defineProps<{ count: CountData; currentMember?: number }>();

const countCurrency = computed(() => JSON.parse(props.count.currency));

const sortedExpenses = computed(() =>
  props.count.expenses.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id
  )
);

const total = computed(() =>
  props.count.expenses.reduce(
    (acc, e) => add(acc, dinero(JSON.parse(e.amount))),
    zero(countCurrency.value)
  )
);

const allResolvedShares = computed(() =>
  sortedExpenses.value.map((e) =>
    computeSharesAmount(
      dinero(JSON.parse(e.amount)),
      e.shares.map(
        (s) =>
          ({
            fraction: s.fraction !== null ? s.fraction : undefined,
            amount: s.amount ? dinero(JSON.parse(s.amount)) : undefined,
          } as ExpenseShares[number])
      )
    )
  )
);

const selfTotal = computed(() =>
  sortedExpenses.value.reduce((acc, e, i) => {
    const idx = e.shares.findIndex((s) => s.memberId === props.currentMember);
    const selfShare =
      idx !== -1 ? allResolvedShares.value[i][idx] : zero(countCurrency.value);
    return add(acc, selfShare);
  }, zero(countCurrency.value))
);

const modalRef = ref<HTMLDialogElement | null>(null);
const supprModalRef = ref<HTMLDialogElement | null>(null);

const expenseFormStore = useExpenseFormStore();
const selectedExpense = ref<ExpenseData>();

const submit = async () => {
  const countCurrency = JSON.parse(props.count.currency) as Currency<number>;
  const date = new Date(expenseFormStore.date!);

  let amount: Dinero<number> = expenseFormStore.amount!;
  let originalAmount: Dinero<number> | undefined = undefined;

  if (!haveSameCurrency([amount, zero(countCurrency)])) {
    originalAmount = amount;
    amount = await convertTo(amount, countCurrency, date);
  }

  const res = await $fetch(`/api/expenses/${selectedExpense.value!.id}`, {
    method: "PUT",
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

const submitDelete = async () => {
  const res = await $fetch(`/api/expenses/${selectedExpense.value!.id}`, {
    method: "DELETE",
  });
  console.log(res);
  supprModalRef.value!.close();
  modalRef.value!.close();
  refreshNuxtData();
};
</script>

<template>
  <div>
    <main class="pb-14 flex flex-col gap-y-2">
      <ExpensesCard
        v-for="(e, i) in sortedExpenses"
        :key="e.id"
        :count="count"
        :expense="e"
        :resolved-shares="allResolvedShares[i]"
        :show-modal="() => modalRef?.showModal()"
        :current-member="currentMember"
        @click="selectedExpense = e"
      />

      <ExpenseModalDialog
        title="Edit Expense"
        :set-modal="(m) => (modalRef = m)"
        :count="count"
        :submit="submit"
      >
        <button
          class="btn btn-error w-full mb-4 mt-0"
          @click="supprModalRef?.showModal()"
        >
          <TrashIcon class="h-6 w-6" />
          <span>Delete Expense</span>
        </button>

        <dialog ref="supprModalRef" class="modal modal-bottom sm:modal-middle">
          <div class="modal-box prose">
            <h2>Confirm</h2>
            <div class="modal-action">
              <form method="dialog">
                <button class="btn">Cancel</button>
              </form>
              <button class="btn btn-error" @click="submitDelete">
                Delete
              </button>
            </div>
          </div>

          <form method="dialog" class="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </ExpenseModalDialog>
    </main>

    <div class="btm-nav container mx-auto p-1 gap-x-1 z-50">
      <div class="card card-compact bg-base-200 text-xs cursor-default">
        <template v-if="currentMember">
          <h3 class="uppercase">My Total</h3>
          <p class="font-bold">
            {{ toString(selfTotal) }}
          </p>
        </template>
      </div>

      <div class="cursor-default">
        <NewExpenseModal :count="count" :current-member="currentMember" />
      </div>

      <div class="card card-compact bg-base-200 text-xs cursor-default">
        <h3 class="uppercase">Total Expenses</h3>
        <p class="font-bold">
          {{ toString(total) }}
        </p>
      </div>
    </div>
  </div>
</template>
