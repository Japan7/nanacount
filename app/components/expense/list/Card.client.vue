<script setup lang="ts">
import { toString } from "#shared/utils/dinero";
import {
  dinero,
  isNegative,
  isPositive,
  multiply,
  subtract,
  toSnapshot,
  type Dinero,
} from "dinero.js";

const props = defineProps<{
  count: CountData;
  expense: ExpenseData;
  resolvedShares: Dinero<number>[];
  showModal: () => void;
  currentMember?: number;
}>();

const author = computed(() => {
  return props.count.members.find((m) => m.id === props.expense.authorId);
});

const concerns = computed(() => {
  const concerned: MemberData[] = [];
  const notConcerned: MemberData[] = [];
  for (const m of props.count.members ?? []) {
    if (props.expense.shares.find((s) => s.memberId === m.id)) {
      concerned.push(m);
    } else {
      notConcerned.push(m);
    }
  }
  return [concerned, notConcerned] as const;
});

const expenseAmount = computed(() => dinero(JSON.parse(props.expense.amount)));
const expenseOgAmount = computed(() =>
  props.expense.originalAmount
    ? dinero(JSON.parse(props.expense.originalAmount))
    : undefined
);

const impact = computed(() => {
  const idx = props.expense.shares.findIndex(
    (s) => s.memberId === props.currentMember
  );
  const selfShare =
    idx !== -1
      ? props.resolvedShares[idx]!
      : zero(toSnapshot(expenseAmount.value).currency);
  if (props.expense.authorId === props.currentMember) {
    return subtract(expenseAmount.value, selfShare);
  } else {
    return multiply(selfShare, -1);
  }
});

const expenseFormStore = useExpenseFormStore();
</script>

<template>
  <div
    class="card card-compact card-bordered cursor-pointer hover:brightness-90 transition ease-in-out"
    :class="{ 'opacity-50': expense.title === 'Reimbursement' }"
    @click="
      () => {
        expenseFormStore.$reset();
        for (const m of count.members ?? []) {
          expenseFormStore.shares[m.id] = { fraction: 0 };
        }
        expenseFormStore.load(expense);
        showModal();
      }
    "
  >
    <div class="card-body gap-y-0">
      <h2 class="card-title text-primary">
        <span class="flex-1 self-baseline">{{ expense.title }}</span>
        <div class="flex flex-col text-right">
          <span>{{ toString(expenseAmount) }}</span>
          <span v-if="expenseOgAmount" class="text-xs">
            ({{ toString(expenseOgAmount) }})
          </span>
        </div>
      </h2>

      <p class="flex">
        <span class="flex-1"
          >Paid by <b>{{ author?.name }}</b></span
        >
        <span>
          {{
            new Date(expense.date).toLocaleDateString(undefined, {
              timeZone: "UTC",
              dateStyle: "long",
            })
          }}
        </span>
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
              'text-red-500': isNegative(impact),
              'text-green-500': isPositive(impact),
            }"
          >
            {{ toString(impact) }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
