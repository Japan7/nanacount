<script setup lang="ts">
const props = defineProps<{
  count: CountData;
  members: MemberData[];
  balances: number[];
  currentMember?: number;
}>();

const reimbursements = computed(() =>
  computeReimbursments(props.members, props.balances)
);
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
            <td class="text-primary text-center">€{{ r.amount.toFixed(2) }}</td>
            <td class="w-0">
              <BalancesReimbursementsModal
                :count="count"
                :from="r.from"
                :to="r.to"
                :amount="r.amount"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
