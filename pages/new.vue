<script setup lang="ts">
import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/solid";

const title = ref("");
const description = ref("");
const currency = ref("EUR");
const members = ref([""]);

const validMembers = computed(() => members.value.filter((p) => p));

const formValid = computed(() => title.value && validMembers.value.length > 0);

const submit = async () => {
  const res = await $fetch("/api/counts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title.value,
      description: description.value,
      currency: currency.value,
      members: validMembers.value,
    }),
  });

  navigateTo(`/count/${res.id}`);
};
</script>

<template>
  <div class="prose mx-auto p-4">
    <h1>New count</h1>

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
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(_, i) in members">
          <td class="flex gap-x-2">
            <input
              type="text"
              placeholder="Name"
              class="input input-bordered w-full"
              v-model.trim="members[i]"
            />
            <button
              class="btn"
              @click="members = members.filter((_, j) => i !== j)"
            >
              <XMarkIcon class="h-6 w-6" />
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <button class="btn btn-block btn-neutral" @click="members.push('')">
              <PlusIcon class="h-6 w-6" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <button
      class="btn btn-block btn-primary"
      :disabled="!formValid"
      @click="submit"
    >
      Submit
    </button>
  </div>
</template>
