<script setup lang="ts">
const props = defineProps<{ count: CountData }>();

const modalRef = ref<HTMLDialogElement | null>(null);

const countFormStore = useCountFormStore();

const validMembers = computed(() => countFormStore.members.filter((p) => p));

const formValid = computed(
  () => countFormStore.title && validMembers.value.length > 0
);

const submit = async () => {
  const res = await $fetch(`/api/counts/${props.count!.id}`, {
    method: "PATCH",
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

  console.log(res);
  modalRef.value!.close();
  refreshNuxtData();
};
</script>

<template>
  <div
    class="card card-compact bg-base-200 cursor-pointer hover:brightness-90 transition ease-in-out"
    @click="
      () => {
        countFormStore.load(count);
        modalRef?.showModal();
      }
    "
  >
    <div class="card-body">
      <div>
        <h2 class="card-title">{{ count?.title }}</h2>
        <p
          class="font-semibold text-ellipsis whitespace-nowrap overflow-hidden"
        >
          {{ count.members.map((m) => m.name).join(", ") }}
        </p>
      </div>
      <p v-if="count?.description">{{ count.description }}</p>
    </div>
  </div>

  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box prose">
      <h2>Edit Count</h2>

      <CountForm
        v-model:title="countFormStore.title"
        v-model:description="countFormStore.description"
        v-model:currency="countFormStore.currency"
        v-model:members="countFormStore.members"
      />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancel</button>
        </form>
        <button
          class="btn btn-primary btn-wide"
          :disabled="!formValid"
          @click="submit"
        >
          Save
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
