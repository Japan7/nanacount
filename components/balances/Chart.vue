<script setup lang="ts">
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { isNegative, toSnapshot, type Dinero } from "dinero.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  Colors
);

const props = defineProps<{
  members: MemberData[];
  balances: Dinero<number>[];
  currentMember?: number;
}>();

const chartData = computed(() => ({
  labels: props.members.map((m) => m.name),
  datasets: [
    {
      data: props.balances.map((v) => toSnapshot(v).amount),
      backgroundColor: props.balances.map((v) =>
        isNegative(v) ? "rgba(255, 99, 132, 0.2)" : "rgba(75, 192, 192, 0.2)"
      ),
      borderColor: props.balances.map((v) =>
        isNegative(v) ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)"
      ),
      borderWidth: 1,
    },
  ],
}));
</script>

<template>
  <Bar
    id="my-chart-id"
    :options="{
      indexAxis: 'y',
      aspectRatio: 1,
      scales: {
        y: {
          ticks: {
            autoSkip: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    }"
    :data="chartData"
  />
</template>
