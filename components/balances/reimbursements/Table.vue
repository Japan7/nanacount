<script setup lang="ts">
const props = defineProps<{
  count: CountData;
  members: MemberData[];
  balances: number[];
  currentMember?: number;
}>();

const reimbursements = computed(() => {
  const balances = [...props.balances];
  const reimb: { from: MemberData; to: MemberData; amount: number }[] = [];

  for (let i = 0; i < balances.length; i++) {
    while (balances[i] <= -0.01) {
      const j = balances.findIndex((v) => v >= 0.01);
      if (j === -1) {
        if (i === balances.length - 1) {
          break;
        } else {
          throw new Error("No positive balance found");
        }
      }
      let amount = Math.min(-balances[i], balances[j]);
      amount = Math.ceil(amount * 100) / 100;
      balances[i] += amount;
      balances[j] -= amount;
      reimb.push({
        from: props.members[i],
        to: props.members[j],
        amount,
      });
    }
  }

  console.log(balances);
  return reimb;
});
</script>

<template>
  <div class="card card-compact card-bordered">
    <div class="card-body">
      <h2 class="card-title">Suggested Reimbursements</h2>
      <table class="table table-xs">
        <tbody>
          <tr
            v-for="r in reimbursements"
            :class="{ active: r.from.id === currentMember }"
          >
            <td class="font-bold text-right">{{ r.from.name }}</td>
            <td class="w-0">owes</td>
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
