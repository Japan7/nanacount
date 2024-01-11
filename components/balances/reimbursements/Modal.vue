<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{
  count: CountData;
  from: MemberData;
  to: MemberData;
  amount: number;
}>();

const modalRef = ref<HTMLDialogElement | null>(null);

const submit = async () => {
  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count!.id,
      title: "Reimbursement",
      amount: props.amount,
      date: new Date().toISOString(),
      authorId: props.from.id,
      shares: [{ memberId: props.to.id, fraction: 1 }],
    }),
  });

  console.log(res);
  modalRef.value?.close();
  refreshNuxtData();
};
</script>

<template>
  <button class="btn btn-sm btn-success" @click="modalRef?.showModal()">
    <CheckIcon class="h-4 w-4" />
  </button>

  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box prose">
      <h2>Mark as paid</h2>

      <p>
        From <b>{{ from.name }}</b> to <b>{{ to.name }}</b
        >, <span class="text-primary">€{{ amount.toFixed(2) }}</span>
      </p>

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancel</button>
        </form>
        <button class="btn btn-success btn-wide" @click="submit">
          Confirm
        </button>
      </div>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
