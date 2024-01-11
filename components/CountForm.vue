<script setup lang="ts">
import { PlusIcon, XMarkIcon } from "@heroicons/vue/24/solid";

const title = defineModel("title");
const description = defineModel("description");
const currency = defineModel("currency", { default: "EUR" });
const members = defineModel("members", { default: [""] });
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
  </div>

  <table class="table table-sm">
    <thead>
      <tr>
        <th>Members</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(_, i) in members" :key="i">
        <td class="flex gap-x-2">
          <input
            type="text"
            placeholder="Name"
            class="input input-sm input-bordered w-full"
            v-model.trim="members[i]"
          />
          <button
            class="btn btn-sm"
            @click="members = members.filter((_, j) => i !== j)"
          >
            <XMarkIcon class="h-6 w-6" />
          </button>
        </td>
      </tr>
      <tr>
        <td>
          <button
            class="btn btn-sm btn-block btn-neutral"
            @click="members.push('')"
          >
            <PlusIcon class="h-6 w-6" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>
