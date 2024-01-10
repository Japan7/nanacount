<script setup lang="ts">
const props = defineProps<{ countId: string }>();

const { data, pending, error, refresh } = await useFetch(
  `/api/counts/${props.countId}`
);
</script>

<template>
  <div class="card card-compact bg-base-200 cursor-pointer">
    <div class="card-body">
      <h2 class="card-title">{{ data?.title }}</h2>
      <p>
        <i>{{ data?.description || "No description" }}</i>
      </p>
    </div>
  </div>
</template>
