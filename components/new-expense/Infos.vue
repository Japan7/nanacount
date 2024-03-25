<script setup lang="ts">
import { toDecimal, toSnapshot, type Dinero } from "dinero.js";

const props = defineProps<{ count: CountData }>();

const title = defineModel<string>("title");
const description = defineModel<string>("description");
const amount = defineModel<Dinero<number>>("amount");
const date = defineModel<string>("date");
const author = defineModel<number>("author");

const amountValue = ref(0);
const amountCurrency = ref(
  amount.value
    ? toSnapshot(amount.value).currency
    : JSON.parse(props.count.currency)
);

watchEffect(() => {
  if (amount.value) {
    amountValue.value = toFloat(amount.value);
    amountCurrency.value = toSnapshot(amount.value).currency;
  }
});
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <input
      type="text"
      placeholder="Title"
      class="input input-bordered w-full"
      v-model.trim="title"
    />

    <textarea
      placeholder="Description"
      class="textarea textarea-bordered w-full"
      v-model.trim="description"
    />

    <div class="flex items-center gap-x-2">
      <input
        type="number"
        placeholder="Amount"
        class="input input-bordered w-full"
        :value="amountValue"
        @input="
          (ev) => {
            const amount = (ev.target as HTMLInputElement).valueAsNumber;
            amountValue = amount;
          }
        "
        @focusout="amount = fromFloat(amountValue, amountCurrency)"
      />
      <span class="text-xl">{{ amountCurrency.code }}</span>
    </div>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Date</span>
      </div>
      <input type="date" class="input input-bordered w-full" v-model="date" />
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Author</span>
      </div>
      <select class="select select-bordered" v-model.number="author">
        <option disabled selected value="undefined">Who paid?</option>
        <option v-for="m in count.members" :key="m.id" :value="m.id">
          {{ m.name }}
        </option>
      </select>
    </label>
  </div>
</template>
