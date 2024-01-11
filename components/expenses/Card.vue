<script setup lang="ts">
const props = defineProps<{
  count: CountData;
  expense: ExpenseData;
  currentMember?: number;
}>();

const author = computed(() => {
  return props.count?.members.find((m) => m.id === props.expense.authorId);
});

const resolvedShares = computed(() =>
  splitExpense(
    props.expense.amount,
    props.expense.shares.map((s) => ({
      fraction: s.fraction !== null ? s.fraction : undefined,
      amount: s.amount !== null ? s.amount : undefined,
    }))
  )
);

const concerns = computed(() => {
  const concerned: MemberData[] = [];
  const notConcerned: MemberData[] = [];
  for (const m of props.count?.members ?? []) {
    if (props.expense.shares.find((s) => s.memberId === m.id)) {
      concerned.push(m);
    } else {
      notConcerned.push(m);
    }
  }
  return [concerned, notConcerned] as const;
});

const impact = computed(() => {
  const idx = props.expense.shares.findIndex(
    (s) => s.memberId === props.currentMember
  );
  const selfShare = idx !== -1 ? resolvedShares.value[idx] : 0;
  if (props.expense.authorId === props.currentMember) {
    return props.expense.amount - selfShare;
  } else {
    return -selfShare;
  }
});

const expenseStore = useExpenseStore();

const dialogId = `expense-modal-${props.expense.id}`;

const showModal = () => {
  (document.getElementById(dialogId) as HTMLDialogElement).showModal();
};

const submit = async () => {
  const res = await $fetch(`/api/expenses/${props.expense.id}`, {
    method: "PUT",
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
  <div
    class="card card-compact card-bordered cursor-pointer hover:brightness-90 transition ease-in-out"
    :class="{ 'opacity-50': expense.title === 'Reimbursement' }"
    @click="
      () => {
        expenseStore.$reset();
        for (const m of count?.members ?? []) {
          expenseStore.shares[m.id] = { fraction: 0, amount: '' };
        }
        expenseStore.load(expense);
        showModal();
      }
    "
  >
    <div class="card-body gap-y-0">
      <h2 class="card-title text-primary">
        <span class="flex-1">{{ expense.title }}</span>
        <span>€{{ expense.amount.toFixed(2) }}</span>
      </h2>

      <p class="flex">
        <span class="flex-1"
          >Paid by <b>{{ author?.name }}</b></span
        >
        <span>{{ new Date(expense.date).toLocaleDateString() }}</span>
      </p>

      <div class="flex flex-col sm:flex-row text-xs">
        <p v-if="concerns[1].length === 0">For <b>everyone</b></p>
        <p v-else-if="concerns[0] > concerns[1]">
          For <b>everyone</b> except
          <b>{{ concerns[1].map((m) => m.name).join(", ") }}</b>
        </p>
        <p v-else="concerns[0] < concerns[1]">
          Only for <b>{{ concerns[0].map((m) => m.name).join(", ") }}</b>
        </p>

        <p v-if="currentMember" class="text-right">
          Impact on my balance:
          <span
            :class="{
              'text-red-500': impact < 0,
              'text-green-500': impact > 0,
            }"
          >
            {{ impact < 0 ? "-" : impact > 0 ? "+" : "" }}€{{
              Math.abs(impact).toFixed(2)
            }}
          </span>
        </p>
      </div>
    </div>
  </div>

  <ExpenseModalDialog
    title="Edit Expense"
    :count="count"
    :dialog-id="dialogId"
    :submit="submit"
  />
</template>
