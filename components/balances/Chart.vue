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
  balances: number[];
  currentMember?: number;
}>();

const chartData = computed(() => ({
  labels: props.members.map((m) => m.name),
  datasets: [
    {
      data: props.balances,
      backgroundColor: props.balances.map((v) =>
        v > 0 ? "rgba(75, 192, 192, 0.2)" : "rgba(255, 99, 132, 0.2)"
      ),
      borderColor: props.balances.map((v) =>
        v > 0 ? "rgb(75, 192, 192)" : "rgb(255, 99, 132)"
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
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false,
        },
      },
    }"
    :data="chartData"
  />
</template>
