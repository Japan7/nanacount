<script setup lang="ts">
const props = defineProps<{ countId: string }>();

const { data, pending, error, refresh } = await useFetch(
  `/api/counts/${props.countId}`
);
</script>

<template>
  <main class="pb-14"></main>

  <div class="btm-nav container mx-auto p-1 gap-x-1">
    <div class="card bg-base-200 cursor-default"></div>

    <div class="cursor-default">
      <NewExpenseModal :count-id="countId" />
    </div>

    <div class="card bg-base-200 cursor-default"></div>
  </div>
</template>
