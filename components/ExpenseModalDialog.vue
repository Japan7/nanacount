<script setup lang="ts">
import { DocumentTextIcon, UserGroupIcon } from "@heroicons/vue/24/solid";

const props = defineProps<{
  title: string;
  count: CountData;
  setModal: (modal: HTMLDialogElement | null) => void;
  submit: () => void;
}>();

const expenseFormStore = useExpenseFormStore();

const modalRef = ref<HTMLDialogElement | null>(null);
watchEffect(() => props.setModal(modalRef.value));
</script>

<template>
  <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box prose">
      <h2>{{ title }}</h2>

      <slot />

      <div role="tablist" class="tabs tabs-boxed not-prose">
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': expenseFormStore.tabId === 0 }"
          @click="expenseFormStore.tabId = 0"
        >
          <DocumentTextIcon class="h-4 w-4" />
          <span>Infos</span>
        </a>
        <a
          role="tab"
          class="tab space-x-2"
          :class="{ 'tab-active': expenseFormStore.tabId === 1 }"
          @click="expenseFormStore.tabId = 1"
        >
          <UserGroupIcon class="h-4 w-4" />
          <span>Participants</span>
        </a>
      </div>

      <NewExpenseInfos
        v-if="expenseFormStore.tabId === 0"
        v-model:title="expenseFormStore.title"
        v-model:description="expenseFormStore.description"
        v-model:amount="expenseFormStore.amount"
        v-model:date="expenseFormStore.date"
        v-model:author="expenseFormStore.author"
        :count="count"
        class="mt-4"
      />
      <NewExpenseParticipants
        v-else-if="expenseFormStore.tabId === 1"
        v-model="expenseFormStore.shares"
        :count="count"
        :expense-amount="expenseFormStore.amount ?? 0"
      />

      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancel</button>
        </form>
        <button
          class="btn btn-primary"
          :disabled="!expenseFormStore.formValid"
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
