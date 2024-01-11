<script setup lang="ts">
const props = defineProps<{ count: CountData; expenseAmount: number }>();
const model = defineModel<ExpenseShares>({ default: {} });

const sortedMembers = computed(
  () => props.count?.members.sort((a, b) => a.name.localeCompare(b.name)) ?? []
);

const updateSharesAmount = () => {
  const formattedShares: { fraction?: number; amount?: number }[] = [];
  const mIds = sortedMembers.value.map((m) => m.id);
  for (const id of mIds) {
    const share = model.value[id];
    if (share.amount !== "" && share.fraction === "") {
      formattedShares.push({ amount: share.amount });
    } else if (share.fraction !== "") {
      formattedShares.push({ fraction: share.fraction });
    } else {
      return;
    }
  }
  const shares = splitExpense(props.expenseAmount, formattedShares);
  for (let i = 0; i < mIds.length; i++) {
    model.value[mIds[i]] = {
      fraction: model.value[mIds[i]].fraction,
      amount: shares[i],
    };
  }
};
updateSharesAmount();
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="w-0">
            <label>
              <input
                type="checkbox"
                class="checkbox"
                :checked="
                  sortedMembers.every(
                    (m) => model[m.id].fraction || model[m.id].amount
                  )
                "
                @click="
                  () => {
                    if (
                      sortedMembers.every(
                        (m) => model[m.id].fraction || model[m.id].amount
                      )
                    ) {
                      for (const m of sortedMembers) {
                        model[m.id] = { fraction: 0, amount: '' };
                      }
                    } else {
                      for (const m of sortedMembers) {
                        if (!(model[m.id].fraction || model[m.id].amount))
                          model[m.id] = { fraction: 1, amount: '' };
                      }
                    }
                    updateSharesAmount();
                  }
                "
              />
            </label>
          </th>
          <th>Name</th>
          <th class="w-1/5">Fraction</th>
          <th class="w-1/4 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in sortedMembers" :key="m.id">
          <th>
            <label>
              <input
                type="checkbox"
                class="checkbox"
                :checked="model[m.id].fraction !== 0"
                @click="
                  () => {
                    if (model[m.id].fraction || model[m.id].amount)
                      model[m.id] = { fraction: 0, amount: '' };
                    else {
                      model[m.id] = { fraction: 1, amount: '' };
                    }
                    updateSharesAmount();
                  }
                "
              />
            </label>
          </th>
          <td>{{ m.name }}</td>
          <td>
            <input
              type="number"
              class="input input-bordered input-sm w-full"
              v-model="model[m.id].fraction"
              @input="
                () => {
                  if (model[m.id].fraction !== '') {
                    model[m.id].amount = '';
                  } else {
                    model[m.id].fraction = 0;
                    model[m.id].amount = '';
                  }
                  updateSharesAmount();
                }
              "
            />
          </td>
          <td>
            <input
              type="number"
              class="input input-bordered input-sm w-full text-right"
              v-model="model[m.id].amount"
              @input="
                () => {
                  if (model[m.id].amount !== '') {
                    model[m.id].fraction = '';
                  } else {
                    model[m.id].fraction = 0;
                  }
                  updateSharesAmount();
                }
              "
            />
          </td>
          <td class="w-0 pl-0">€</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
