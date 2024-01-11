import { defineStore } from "pinia";

export const useCountFormStore = defineStore("count-form", () => {
  const title = ref("");
  const description = ref("");
  const currency = ref("EUR");
  const members = ref("");

  const membersArray = computed(() => members.value.split("\n"));

  const formValid = computed(() => title.value && membersArray.value);

  function $reset() {
    title.value = "";
    description.value = "";
    currency.value = "EUR";
    members.value = "";
  }

  function load(count: CountData) {
    title.value = count.title ?? "";
    description.value = count.description ?? "";
    currency.value = count.currency ?? "EUR";
    members.value = count.members.map((m) => m.name).join("\n");
  }

  return {
    title,
    description,
    currency,
    members,
    membersArray,
    formValid,
    $reset,
    load,
  };
});
