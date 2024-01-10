<script setup lang="ts">
const props = defineProps<{ countId: string; expenseAmount: number }>();
const model = defineModel<ExpenseShares>({ default: {} });

const { data, pending, error, refresh } = await useFetch(
  `/api/counts/${props.countId}`
);

const sortedMembers = computed(
  () => data.value?.members.sort((a, b) => a.name.localeCompare(b.name)) ?? []
);

const updateSharesAmount = () => {
  let left = props.expenseAmount;

  const done: number[] = [];
  let nparts = 0;

  // Apply custom amounts
  for (const m of sortedMembers.value) {
    const share = model.value[m.id];
    if (share.fraction === "") {
      left -= share.amount;
      done.push(m.id);
    } else {
      nparts += share.fraction;
    }
  }

  // Apply fractions
  for (const m of sortedMembers.value) {
    const share = model.value[m.id];
    if (!done.includes(m.id) && share.fraction) {
      let amount = share.fraction * (left / nparts);
      if (amount < 0) {
        amount = 0;
      } else if (amount > left) {
        amount = left;
      } else {
        amount = Math.ceil(amount * 100) / 100;
      }
      share.amount = amount;
      left -= amount;
      nparts -= share.fraction;
    }
    model.value[m.id] = share;
  }
};

watchEffect(() => {
  updateSharesAmount();
});
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table table-sm">
      <thead>
        <tr>
          <th class="w-0">
            <!-- <label>
              <input type="checkbox" class="checkbox" />
            </label> -->
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
