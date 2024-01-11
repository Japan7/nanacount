import { defineStore } from "pinia";

export const useExpenseStore = defineStore("expense", () => {
  const tabId = ref(0);
  const title = ref<string>();
  const amount = ref<number>();
  const date = ref<string>();
  const author = ref<number>();
  const shares = reactive<ExpenseShares>({});

  function $reset() {
    tabId.value = 0;
    title.value = undefined;
    amount.value = undefined;
    date.value = new Date().toISOString().split("T")[0];
    author.value = undefined;
  }

  return {
    tabId,
    title,
    amount,
    date,
    author,
    shares,
    $reset,
  };
});
