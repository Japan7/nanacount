import { defineStore } from "pinia";

export const useExpenseStore = defineStore("expense", () => {
  const tabId = ref(0);
  const title = ref<string>();
  const amount = ref<number>();
  const date = ref<string>();
  const author = ref<number>();
  const shares = reactive<ExpenseShares>({});

  const formValid = computed(
    () =>
      title.value &&
      amount.value &&
      amount.value > 0 &&
      date.value &&
      author.value
  );

  function $reset() {
    tabId.value = 0;
    title.value = undefined;
    amount.value = undefined;
    date.value = new Date().toISOString().split("T")[0];
    author.value = undefined;
  }

  function load(expense: ExpenseData) {
    title.value = expense.title;
    amount.value = expense.amount;
    date.value = new Date(expense.date).toISOString().split("T")[0];
    author.value = expense.authorId;
    expense.shares.forEach((share) => {
      shares[share.memberId] = {
        fraction: share.fraction ?? "",
        amount: share.amount ?? "",
      } as ExpenseShares[number];
    });
  }

  return {
    tabId,
    title,
    amount,
    date,
    author,
    shares,
    formValid,
    $reset,
    load,
  };
});
