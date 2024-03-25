<script setup lang="ts">
import { isPositive, toDecimal, toSnapshot, type Dinero } from "dinero.js";

const props = defineProps<{
  count: CountData;
  expenseAmount: Dinero<number>;
}>();
const model = defineModel<ExpenseShares>({ default: {} });

const expenseCurrency = computed(
  () => toSnapshot(props.expenseAmount).currency
);

const floatSharesAmount = ref<Map<number, number | undefined>>(new Map());

const updateSharesAmount = () => {
  const formattedShares: ExpenseShares[number][] = [];
  const mIds = props.count.members.map((m) => m.id);
  for (const id of mIds) {
    const share = model.value[id];
    if (share.fraction !== undefined) {
      formattedShares.push({ fraction: share.fraction });
    } else {
      formattedShares.push({ fraction: undefined, amount: share.amount });
    }
  }
  const shares = computeSharesAmount(props.expenseAmount, formattedShares);
  floatSharesAmount.value.clear();
  for (let i = 0; i < mIds.length; i++) {
    const amount = shares[i];
    model.value[mIds[i]].amount = amount;
    floatSharesAmount.value.set(mIds[i], toFloat(amount));
  }
};
updateSharesAmount();

const memberIsConcerned = (m: MemberData) => {
  const { fraction, amount } = model.value[m.id];
  return fraction || (amount && isPositive(amount));
};

const isEveryoneConcerned = computed(() =>
  props.count.members.every(memberIsConcerned)
);
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
                :checked="isEveryoneConcerned"
                @click="
                  () => {
                    if (isEveryoneConcerned) {
                      for (const m of count.members) {
                        model[m.id] = { fraction: 0 };
                      }
                    } else {
                      for (const m of count.members) {
                        if (!memberIsConcerned(m))
                          model[m.id] = { fraction: 1 };
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
        <tr v-for="m in count.members" :key="m.id">
          <th>
            <label>
              <input
                type="checkbox"
                class="checkbox"
                :checked="model[m.id].fraction !== 0"
                @click="
                  () => {
                    model[m.id] = memberIsConcerned(m)
                      ? { fraction: 0 }
                      : { fraction: 1 };
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
              min="0"
              step="1"
              class="input input-bordered input-sm w-full"
              v-model="model[m.id].fraction"
              @input="updateSharesAmount()"
            />
          </td>
          <td>
            <input
              type="number"
              class="input input-bordered input-sm w-full text-right"
              :value="floatSharesAmount.get(m.id)"
              @input="
                (ev) => {
                  const amount = (ev.target as HTMLInputElement).valueAsNumber;
                  floatSharesAmount.set(m.id, amount);
                }
              "
              @focusout="
                () => {
                  const input = floatSharesAmount.get(m.id);
                  model[m.id] = input
                    ? {
                        fraction: undefined,
                        amount: fromFloat(input, expenseCurrency),
                      }
                    : { fraction: 1 };
                  updateSharesAmount();
                }
              "
            />
          </td>
          <td class="w-0 pl-0">{{ expenseCurrency.code }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
