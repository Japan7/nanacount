<script setup lang="ts">
import { toString } from "#shared/utils/dinero";
import { CheckIcon } from "@heroicons/vue/24/solid";
import type { Dinero } from "dinero.js";

const props = defineProps<{
  count: CountData;
  members: MemberData[];
  balances: Dinero<number>[];
  currentMember?: number;
}>();

const reimbursements = computed(() =>
  computeReimbursments(props.members, props.balances)
);

const modalRef = ref<HTMLDialogElement | null>(null);
const selectedReimb = ref<{
  from: MemberData;
  to: MemberData;
  amount: Dinero<number>;
}>();

const submit = async () => {
  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count.id,
      title: "Reimbursement",
      amount: selectedReimb.value!.amount,
      date: new Date().toISOString(),
      authorId: selectedReimb.value!.from.id,
      shares: [{ memberId: selectedReimb.value!.to.id, fraction: 1 }],
    }),
  });

  console.log(res);
  modalRef.value!.close();
  refreshNuxtData();
};
</script>

<template>
  <div class="card card-compact card-bordered">
    <div class="card-body">
      <h2 class="card-title">Suggested Reimbursements</h2>
      <table class="table table-xs">
        <tbody>
          <tr
            v-for="r in reimbursements"
            :key="`${r.from.id}-${r.to.id}`"
            :class="{ active: r.from.id === currentMember }"
          >
            <td class="font-bold text-right">{{ r.from.name }}</td>
            <td class="w-0 text-center">owes</td>
            <td class="font-bold text-left">{{ r.to.name }}</td>
            <td class="text-primary text-center">
              {{ toString(r.amount) }}
            </td>
            <td class="w-0 text-right">
              <button
                class="btn btn-sm btn-success"
                @click="
                  () => {
                    selectedReimb = r;
                    modalRef?.showModal();
                  }
                "
              >
                <CheckIcon class="h-4 w-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box prose">
        <h2>Mark as paid</h2>

        <p>
          From <b>{{ selectedReimb?.from.name }}</b> to
          <b>{{ selectedReimb?.to.name }}</b
          >,
          <span class="text-primary">
            {{ selectedReimb ? toString(selectedReimb.amount) : "" }}
          </span>
        </p>

        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Cancel</button>
          </form>
          <button class="btn btn-success" @click="submit">Confirm</button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
