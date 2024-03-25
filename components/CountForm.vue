<script setup lang="ts">
import { EUR } from "@dinero.js/currencies";

defineProps<{ disableCurrencySelect?: boolean }>();

const title = defineModel("title");
const description = defineModel("description", { default: "" });
const currency = defineModel("currency", { default: EUR });
const members = defineModel("members", { default: "" });
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

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Currency</span>
      </div>
      <select
        v-model="currency"
        class="select select-bordered"
        :disabled="disableCurrencySelect"
      >
        <option
          v-for="[code, curr] in Object.entries(currencyRecord)"
          :key="code"
          :value="curr"
        >
          {{ code }}
        </option>
      </select>
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Members</span>
        <span class="label-text-alt">(1 per line)</span>
      </div>
      <textarea v-model="members" class="textarea textarea-bordered h-[25vh]" />
    </label>
  </div>
</template>
