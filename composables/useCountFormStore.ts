import _ from "lodash";
import { defineStore } from "pinia";

export const useCountFormStore = defineStore("count-form", () => {
  const title = ref<string>();
  const description = ref<string>();
  const currency = ref("EUR");
  const members = ref<string>();

  const membersArray = computed(() =>
    _.uniq(members.value?.split("\n").filter((m) => m))
  );

  const formValid = computed(() => title.value && membersArray.value.length);

  function $reset() {
    title.value = undefined;
    description.value = undefined;
    currency.value = "EUR";
    members.value = undefined;
  }

  function load(count: CountData) {
    title.value = count.title;
    description.value = count.description ?? undefined;
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
