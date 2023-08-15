<template>
	<div
		class="rounded-md p-4 ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
	>
		<Bar id="earnings-chart" :options="chartOptions" :data="chartData" />
	</div>
</template>

<script lang="ts">
	import { Bar } from "vue-chartjs";
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
	} from "chart.js";

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		BarElement,
		CategoryScale,
		LinearScale,
	);

	export default {
		name: "EarningsBarChart",
		components: { Bar },
		props: {},
		data() {
			return {
				chartData: {
					labels: [
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					],
					datasets: [
						{
							data: [20, 60, 100, 25, 20, 10],
							label: "Earnings",
							backgroundColor: "rgba(88, 101, 242, 0.75)",
							hoverBackgroundColor: "rgba(88, 101, 242, 0.5)",
							borderRadius: 5,
							borderSkipped: false,
						},
					],
				},
				chartOptions: {
					responsive: true,
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			};
		},
	};
</script>
