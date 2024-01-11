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
</script>

<template>
  <div
    class="card card-compact card-bordered cursor-pointer hover:brightness-90 transition ease-in-out"
    :class="{ 'opacity-50': expense.title === 'Reimbursement' }"
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
      <p v-if="currentMember" class="text-right text-xs">
        Impact on my balance:
        <span
          :class="{ 'text-red-500': impact < 0, 'text-green-500': impact > 0 }"
        >
          {{ impact < 0 ? "-" : impact > 0 ? "+" : "" }}€{{
            Math.abs(impact).toFixed(2)
          }}
        </span>
      </p>
    </div>
  </div>
</template>
