import { EUR } from "@dinero.js/currencies";
import type { Currency } from "dinero.js";
import _ from "lodash";

export const useCountFormStore = defineStore("count-form", () => {
  const title = ref<string>();
  const description = ref<string>();
  const currency = ref<Currency<number>>(EUR);
  const members = ref<string>();

  const membersArray = computed(() =>
    _.uniq(members.value?.split("\n").filter((m) => m))
  );

  const formValid = computed(() => title.value && membersArray.value.length);

  function $reset() {
    title.value = undefined;
    description.value = undefined;
    currency.value = EUR;
    members.value = undefined;
  }

  function load(count: CountData) {
    title.value = count.title;
    description.value = count.description ?? undefined;
    currency.value = JSON.parse(count.currency);
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
