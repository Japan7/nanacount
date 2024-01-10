<script setup lang="ts">
import {
  DocumentTextIcon,
  PlusIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps<{ count: CountData }>();

const modalRef = ref<HTMLDialogElement | null>(null);

const tabId = ref(0);
const title = ref<string>();
const amount = ref<number>();
const date = ref<string>();
const author = ref<number>();
const shares = reactive<ExpenseShares>({});

const resetShares = () => {
  for (const m of props.count?.members ?? []) {
    shares[m.id] = { fraction: 1, amount: "" };
  }
};

const formValid = computed(
  () => title.value && amount.value && date.value && author.value
);

const submit = async () => {
  const res = await $fetch("/api/expenses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      countId: props.count!.id,
      title: title.value,
      // description: description.value,
      amount: amount.value,
      date: new Date(date.value!).toISOString(),
      authorId: author.value,
      // FIXME: this is really ugly
      shares: Object.entries(shares)
        .map(([memberId, share]) => ({
          memberId: parseInt(memberId),
          fraction: share.fraction !== "" ? share.fraction : undefined,
          amount: share.fraction === "" ? share.amount : undefined,
        }))
        .filter((s) => s.fraction || s.amount),
    }),
  });

  console.log(res);
  modalRef.value?.close();
  refreshNuxtData();
};
</script>

<template>
  <button
    class="btn btn-secondary btn-block h-full"
    @click="
      () => {
        tabId = 0;
        title = undefined;
        amount = undefined;
        date = new Date().toISOString().split('T')[0];
        author = undefined;
        resetShares();
        modalRef?.showModal();
      }
    "
  >
    <PlusIcon class="h-6 w-6" />
  </button>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box prose">
      <h2>New Expense</h2>

      <div role="tablist" class="tabs tabs-boxed not-prose">
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': tabId === 0 }"
          @click="tabId = 0"
        >
          <DocumentTextIcon class="h-4 w-4" />
          <span>Infos</span>
        </a>
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': tabId === 1 }"
          @click="tabId = 1"
        >
          <UserGroupIcon class="h-4 w-4" />
          <span>Participants</span>
        </a>
      </div>

      <NewExpenseInfos
        v-if="tabId === 0"
        v-model:title="title"
        v-model:amount="amount"
        v-model:date="date"
        v-model:author="author"
        :count="count"
        class="mt-4"
      />
      <NewExpenseParticipants
        v-else-if="tabId === 1"
        v-model="shares"
        :count="count"
        :expense-amount="amount ?? 0"
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
