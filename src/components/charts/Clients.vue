<template>
	<div
		class="rounded-md p-4 ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
	>
		<Line id="clients-chart" :options="chartOptions" :data="chartData" />
	</div>
</template>

<script lang="ts">
	import { Line } from "vue-chartjs";

	import {
		Chart as ChartJS,
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend,
	} from "chart.js";

	ChartJS.register(
		CategoryScale,
		LinearScale,
		PointElement,
		LineElement,
		Title,
		Tooltip,
		Legend,
	);

	export default {
		name: "ClientBarChart",
		components: { Line },
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
							data: [2, 3, 5, 6, 8, 4],
							label: "Clients",
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
