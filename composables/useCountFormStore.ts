import { defineStore } from "pinia";

export const useCountFormStore = defineStore("count-form", () => {
  const title = ref("");
  const description = ref("");
  const currency = ref("EUR");
  const members = ref([""]);

  function $reset() {
    title.value = "";
    description.value = "";
    currency.value = "EUR";
    members.value = [""];
  }

  function load(count: CountData) {
    title.value = count.title ?? "";
    description.value = count.description ?? "";
    currency.value = count.currency ?? "EUR";
    members.value = count.members.map((m: MemberData) => m.name) ?? [""];
  }

  return {
    title,
    description,
    currency,
    members,
    $reset,
    load,
  };
});
