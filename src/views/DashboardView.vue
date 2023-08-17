<script lang="ts">
	import Earnings from "@/components/charts/Earnings.vue";
	import Clients from "@/components/charts/Clients.vue";
	import Weather from "@/components/Weather.vue";

	const icons = {
		sheets:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Google_Sheets_logo_%282014-2020%29.svg/800px-Google_Sheets_logo_%282014-2020%29.svg.png",
		instagram:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/600px-Instagram-Icon.png",
	};

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
				developmentWindow: localStorage.getItem("developmentWindow") == "true",
				photographyWindow: localStorage.getItem("photographyWindow") == "true",
				quickLinks: [
					{
						name: "Photo Prices",
						link: "https://docs.google.com/spreadsheets/d/1SZPuVY0jCVRzYYfHObS3udHHYn2-65MUiaHoZFBSgiU/edit#gid=0",
						icon: icons.sheets,
					},
					{
						name: "@jurgen.jpg",
						link: "https://instagram.com/jurgen.jpg",
						icon: icons.instagram,
					},
				],
			};
		},
		components: {
			Earnings,
			Clients,
			Weather,
		},
		methods: {
			toggleDevelopmentWindow() {
				this.developmentWindow = !this.developmentWindow;
				localStorage.setItem(
					"developmentWindow",
					String(this.developmentWindow),
				);
			},
			togglePhotographyWindow() {
				this.photographyWindow = !this.photographyWindow;
				localStorage.setItem(
					"photographyWindow",
					String(this.photographyWindow),
				);
			},
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
					<Weather />
				</div>
			</div>

			<div
				class="rounded-md font-mono font-semibold ring-1 ring-neutral-300/50 dark:ring-neutral-700/50 py-2 px-4 mt-4"
			>
				<div class="inline">Quick Links</div>

				<div class="grid grid-cols-6 py-4 gap-x-4">
					<a :href="link.link" target="_blank" v-for="link in quickLinks">
						<div
							class="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/50 hover:dark:bg-neutral-800 transition-colors h-36 rounded-md flex flex-col justify-center items-center overflow-hidden"
						>
							<img :src="link.icon" class="h-12 w-12 object-contain" />
							<h1 class="mt-2 text-center">
								{{ link.name }}
							</h1>
						</div>
					</a>
				</div>
			</div>

			<div
				class="rounded-md font-mono font-semibold ring-1 ring-neutral-300/50 dark:ring-neutral-700/50 py-2 px-4 mt-4"
			>
				<div class="inline" :class="{ 'opacity-50': !developmentWindow }">
					Development
				</div>

				<div class="inline float-right">
					<button @click="toggleDevelopmentWindow()">
						<span v-if="!developmentWindow" class="text-green-500">Show</span
						><span v-if="developmentWindow" class="text-red-500">Hide</span>
					</button>
				</div>
			</div>

			<div class="grid xl:grid-cols-2 gap-4 mt-4" v-if="developmentWindow">
				<Earnings />
				<Clients />
			</div>

			<div
				class="rounded-md font-mono font-semibold ring-1 ring-neutral-300/50 dark:ring-neutral-700/50 py-2 px-4 mt-4"
			>
				<div class="inline" :class="{ 'opacity-50': !photographyWindow }">
					Photography
				</div>
				<div class="inline float-right">
					<button @click="togglePhotographyWindow()">
						<span v-if="!photographyWindow" class="text-green-500">Show</span
						><span v-if="photographyWindow" class="text-red-500">Hide</span>
					</button>
				</div>
			</div>

			<div class="grid xl:grid-cols-2 gap-4 mt-4" v-if="photographyWindow">
				<Earnings/>
				<Clients />
			</div>
		</div>
	</main>
</template>
