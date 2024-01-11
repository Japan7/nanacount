<script setup lang="ts">
const countFormStore = useCountFormStore();
countFormStore.$reset();

const validMembers = computed(() => countFormStore.members.filter((p) => p));

const formValid = computed(
  () => countFormStore.title && validMembers.value.length > 0
);

const submit = async () => {
  const res = await $fetch("/api/counts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: countFormStore.title,
      description: countFormStore.description,
      currency: countFormStore.currency,
      members: validMembers.value,
    }),
  });

  navigateTo(`/${res.id}`);
};
</script>

<template>
  <div class="prose mx-auto p-4">
    <h1>New Count</h1>

    <CountForm
      v-model:title="countFormStore.title"
      v-model:description="countFormStore.description"
      v-model:currency="countFormStore.currency"
      v-model:members="countFormStore.members"
    />

    <button
      class="btn btn-block btn-primary"
      :disabled="!formValid"
      @click="submit"
    >
      Submit
    </button>
  </div>
</template>
