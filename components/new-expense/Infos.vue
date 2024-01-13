<script setup lang="ts">
defineProps<{ count: CountData }>();

const title = defineModel<string>("title");
const amount = defineModel<number>("amount");
const date = defineModel<string>("date");
const author = defineModel<number>("author");
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <input
      type="text"
      placeholder="Title"
      class="input input-bordered w-full"
      v-model.trim="title"
    />

    <div class="flex items-center gap-x-2">
      <input
        type="number"
        placeholder="Amount"
        class="input input-bordered w-full text-right"
        v-model="amount"
      />
      <span class="text-xl">€</span>
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
