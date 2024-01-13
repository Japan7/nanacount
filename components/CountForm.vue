<script setup lang="ts">
const title = defineModel("title");
const description = defineModel("description");
const currency = defineModel("currency", { default: "EUR" });
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

    <input
      type="text"
      placeholder="Description"
      class="input input-bordered w-full"
      v-model.trim="description"
    />

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Currency</span>
      </div>
      <select class="select select-bordered" disabled v-model="currency">
        <option disabled value="EUR">EUR</option>
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
