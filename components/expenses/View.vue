<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{ count: CountData; currentMember?: number }>();

const sortedExpenses = computed(() =>
  props.count.expenses.sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() || b.id - a.id
  )
);

const total = computed(() =>
  props.count.expenses.reduce((acc, e) => acc + e.amount, 0)
);

const selfTotal = computed(() => {
  return props.count.expenses.reduce((acc, e) => {
    const resolved = splitExpense(
      e.amount,
      e.shares.map((s) => ({
        fraction: s.fraction !== null ? s.fraction : undefined,
        amount: s.amount !== null ? s.amount : undefined,
      }))
    );

    const idx = e.shares.findIndex((s) => s.memberId === props.currentMember);
    const selfShare = idx !== -1 ? resolved[idx] : 0;
    return acc + selfShare;
  }, 0);
});

const modalRef = ref<HTMLDialogElement | null>(null);
const supprModalRef = ref<HTMLDialogElement | null>(null);

const selectedExpense = ref<ExpenseData>();
const expenseStore = useExpenseStore();

const submit = async () => {
  const res = await $fetch(`/api/expenses/${selectedExpense.value!.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count.id,
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
        v-for="e in sortedExpenses"
        :key="e.id"
        :count="count"
        :expense="e"
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
          <p class="font-bold">€{{ selfTotal.toFixed(2) }}</p>
        </template>
      </div>
      <div class="cursor-default">
        <NewExpenseModal :count="count" />
      </div>
      <div class="card card-compact bg-base-200 text-xs cursor-default">
        <h3 class="uppercase">Total Expenses</h3>
        <p class="font-bold">€{{ total.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>
