<script lang="ts">
	import { defineComponent } from "vue";
	import Lanyard from "../utils/Lanyard";
	import type { LanyardData, Activity } from "../utils/Lanyard/types";

	export default defineComponent({
		props: {
			ShowPresence: {
				type: Boolean,
				default: true,
			},
		},
		data() {
			return {
				finished: false,
				newData: false,
				lanyard: {} as LanyardData,
				socket: null as WebSocket | null,
			};
		},
		computed: {
			presence(): Activity | undefined {
				const lanyard = this.lanyard;
				if (!lanyard) return undefined;
				const filtered: Activity | undefined = lanyard.activities
					?.filter((activity) => activity.type !== 4)
					?.pop();
				return filtered;
			},
			getStatusDetails(): string {
				const lanyard = this.lanyard;
				if (!lanyard) return "Couldn't fetch data from Lanyard";
				const filtered: Activity | null =
					lanyard.activities
						?.filter((activity) => activity.type !== 4)
						?.pop() || null;
				// Offline
				if (this.lanyard?.discord_status === "offline") return "Offline";
				else if (!filtered) return "Online";
				// Spotify
				else if (filtered.name === "Spotify" && !!lanyard.spotify) {
					const { song, artist } = lanyard.spotify || {};
					const firstArtist = artist?.split("; ")?.[0];
					return `Listening to **${song}** by **${firstArtist || "someone"}**`;
				}
				// Visual Studio Code
				else if (filtered.name === "Visual Studio Code") {
					return `Working on **Visual Studio Code**`;
				}
				// Netflix
				else if (filtered.name === "Netflix" && filtered.details) {
					return `Watching **${filtered.details}** on **Netflix**`;
				}
				// YouTube Music
				else if (filtered.name === "YouTube Music" && filtered.details) {
					return `Listening to **${filtered.details}** on **YouTube Music**`;
				}
				// YouTube
				else if (filtered.name === "YouTube" && filtered.details) {
					return `Watching ${filtered.details} on YouTube`;
				}
				// Default values
				else
					switch (filtered.name) {
						case "Google Meet":
							return "In a Google Meet meeting";
						case "Twitch":
							return "Watching a stream on Twitch";
						case "Prime Video":
							return "Watching something on Prime Video";
						default:
							return "Online";
					}
			},
			getSafeHthml(): string {
				return this.getStatusDetails.replace(
					/\*\*(.*?)\*\*/gm,
					"<strong>$1</strong>",
				);
			},
			getDiscordStatus(): string {
				switch (this.lanyard.discord_status) {
					case "online":
						return "online";
					case "idle":
						return "idle";
					case "dnd":
						return "DND";
					default:
						return this.lanyard.discord_status;
				}
			},
			getDiscordStatusColor(): string {
				switch (this.lanyard.discord_status) {
					case "online":
						return "bg-green-500";
					case "idle":
						return "bg-yellow-500";
					case "dnd":
						return "bg-red-500";
					default:
						return "bg-gray-500 dark:bg-gray-200";
				}
			},
			getDiscordStatusIcon(): string {
				switch (this.lanyard.discord_status) {
					case "online":
						return "green";
					case "idle":
						return "yellow";
					case "dnd":
						return "red";
					default:
						return "gray";
				}
			},
		},
		beforeDestroy() {
			this.socket?.close();
		},
		async mounted() {
			// Connect to Lanyard Socket API, send heartbeat every 30 seconds and replace the Vue data value with the message using @eggsydev/vue-lanyard module
			this.socket = (await Lanyard({
				userID: "292065674338107393",
				socket: true,
			})) as WebSocket;
			this.socket?.addEventListener("message", ({ data }) => {
				const { t: type, d: status } = JSON.parse(data) as {
					t: "INIT_STATE" | "PRESENCE_UPDATE";
					d: LanyardData;
				};
				if (type === "INIT_STATE" || type === "PRESENCE_UPDATE")
					this.lanyard = status || {};
				this.newData = !this.newData;
				this.finished = true;
			});
		},
		methods: {},
	});
</script>

<style>
	#discord-status-tooltip {
		display: none;
		visibility: hidden;
		opacity: 0;
	}

	@media (min-width: 1024px) {
		#discord-status-tooltip-trigger:hover #discord-status-tooltip {
			display: block !important;
			visibility: visible !important;
			animation: fadeIn 0.3s ease-in-out forwards;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

<template>
	<div
		class="h-3 w-3 rounded-full flex-shrink-0"
		:class="getDiscordStatusColor"
		data-tippy-directive=""
		data-tooltip-target="discord-status-tooltip"
		data-tooltip-placement="bottom"
		id="discord-status-tooltip-trigger"
	>
		<div
			v-if="ShowPresence"
			id="discord-status-tooltip"
			class="absolute overflow-hidden z-10 py-2 px-3 text-sm font-medium text-gray-800 dark:text-white bg-neutral-200 rounded-lg shadow-sm dark:bg-neutral-800 ring-1 ring-neutral-300 dark:ring-neutral-700 mt-6"
			:class="{
				'min-w-[360px]': presence?.name === 'Spotify',
			}"
		>
			<SpotifyCard v-if="presence?.name === 'Spotify'" />
			<div class="other" v-else>
				<span v-html="getSafeHthml"></span>
			</div>

			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
	</div>
</template>

<style scoped></style>
