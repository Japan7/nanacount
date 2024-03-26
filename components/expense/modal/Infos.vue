<script setup lang="ts">
import { toSnapshot, type Dinero, type Currency, equal } from "dinero.js";

const props = defineProps<{ count: CountData }>();

const title = defineModel<string>("title");
const description = defineModel<string>("description");
const amount = defineModel<Dinero<number>>("amount");
const date = defineModel<string>("date");
const author = defineModel<number>("author");

const amountValue = ref<number>();
const amountCurrency = ref<Currency<number>>(JSON.parse(props.count.currency));

watchEffect(() => {
  amountValue.value = amount.value ? toFloat(amount.value) : undefined;
  amountCurrency.value = amount.value
    ? toSnapshot(amount.value).currency
    : JSON.parse(props.count.currency);
});

watch([amountValue, amountCurrency], ([val, curr]) => {
  if (val !== undefined) {
    const newAmount = fromFloat(val, curr);
    if (!amount.value || !equal(newAmount, amount.value)) {
      amount.value = newAmount;
    }
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
        v-model="amountValue"
        placeholder="Amount"
        class="input input-bordered w-full"
      />
      <select v-model="amountCurrency" class="select select-bordered">
        <option
          v-for="[code, curr] in Object.entries(currencyRecord)"
          :key="code"
          :value="curr"
        >
          {{ code }}
        </option>
      </select>
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
