<script setup lang="ts">
defineProps<{ count: CountData }>();
</script>

<template>
  <div
    class="card card-compact bg-base-200 cursor-pointer hover:brightness-90 transition ease-in-out"
  >
    <div class="card-body">
      <h2 class="card-title">{{ count?.title }}</h2>
      <p>
        <i>{{ count?.description || "No description" }}</i>
      </p>
    </div>
  </div>
</template>
