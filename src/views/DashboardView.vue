<script lang="ts">
	import Earnings from "@/components/charts/Earnings.vue";
	import Clients from "@/components/charts/Clients.vue";
	import Weather from "@/components/Weather.vue";

	export default {
		data() {
			return {
				welcomeMessage: `Good ${
					new Date().getHours() < 12
						? "morning"
						: new Date().getHours() < 18
						? "afternoon"
						: "evening"
				}`,
			};
		},
		components: {
			Earnings,
			Clients,
			Weather
		},
	};
</script>

<template>
	<main>
		<div class="mt-20 mx-4 lg:mx-44">
			<div class="grid lg:grid-cols-2">
				<div class="py-2">
					<h1 class="font-extra font-bold text-5xl">
						{{ welcomeMessage }}
					</h1>
					<h1 class="font-mono font-semibold">
						Welcome to your beautiful dashboard!
					</h1>
				</div>
				<div class="hidden lg:block py-2 text-right">
					<Weather/>
				</div>
			</div>
			<div class="grid xl:grid-cols-2 gap-4">
				<Earnings />
				<Clients />
			</div>
		</div>
	</main>
</template>
