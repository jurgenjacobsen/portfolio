<script lang="ts">
	import Lanyard from "../utils/Lanyard";
	import type { LanyardData, Activity } from "../utils/Lanyard/types";

	export default {
		data() {
			return {
				finished: false,
				newData: false,
				lanyard: {} as LanyardData,
				socket: null as WebSocket | null,
				spotify: {
					playerStyles: { width: "" } as { width: string | undefined },
					timeElapsed: "00:00" as string | undefined,
					timeTotal: "00:00" as string | undefined,
				},
				showAnyway: this.$props.showAnywayProp,
				bigSize: this.$props.bigSizeProp,
			};
		},
		props: {
			showAnywayProp: {
				type: Boolean,
				default: false,
			},
			bigSizeProp: {
				type: Boolean,
				default: false,
			},
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

			setInterval(() => {
				this.updatePlayer();
			}, 1000);
		},
		beforeDestroy() {
			this.socket?.close();
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
		},
		methods: {
			truncateString(str: string | undefined, num: number) {
				if (!str) return undefined;
				if (str.length > num) {
					return str.slice(0, num) + "...";
				} else {
					return str;
				}
			},
			getPlayerStyles(): { width: string | undefined } | undefined {
				if (!this.presence?.timestamps?.end) return undefined;
				if (!this.presence?.timestamps) return undefined;
				const date = new Date().getTime();
				const timeElapsed = date - this.presence.timestamps.start;
				const timeTotal =
					this.presence.timestamps.end - this.presence.timestamps.start;
				const percentage = (timeElapsed / timeTotal) * 100;
				return { width: `${percentage}%` };
			},
			getPlayerTimeElapsed() {
				if (!this.presence?.timestamps) return "00:00";
				const date = new Date().getTime();
				const timeElapsed = date - this.presence.timestamps.start;
				// transform to minutes and seconds
				const minutes = Math.floor(timeElapsed / 60000);
				const seconds = ((timeElapsed % 60000) / 1000).toFixed(0);
				// Returns formatted time
				return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
			},
			getPlayerTimeTotal() {
				if (!this.presence?.timestamps?.end) return "00:00";
				const timeTotal =
					this.presence.timestamps.end - this.presence.timestamps.start;
				// transform to minutes and seconds
				const minutes = Math.floor(timeTotal / 60000);
				const seconds = ((timeTotal % 60000) / 1000).toFixed(0);
				// Returns formatted time
				return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
			},
			updatePlayer() {
				try {
					this.spotify.playerStyles = this.getPlayerStyles() ?? {
						width: undefined,
					};
					this.spotify.timeElapsed = this.getPlayerTimeElapsed();
					this.spotify.timeTotal = this.getPlayerTimeTotal();
				} catch {
					return;
				}
			},
		},
	};
</script>

<template>
	<div class="flex" v-if="presence?.name === 'Spotify' || showAnyway">
		<img
			:src="
				presence?.assets?.large_image
					? `https://i.scdn.co/image/${presence?.assets?.large_image?.replace(
							/spotify:/,
							'',
					  )}`
					: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT_XCJ5B83GAP-mkaTYs1hNqVoeAH09htlBV3hEv4hyTN79O3Fx'
			"
			:alt="presence?.state"
			class="object-cover w-28 h-28 rounded-lg"
		/>
		<div class="text-box w-full pl-3 pr-1.5 mt-1 grid grid-cols-1 align-center">
			<span class="text-[#1DB954] font-semibold"
				>Listening on Spotify
				<svg
					fill="none"
					viewBox="0 0 496 512"
					stroke="currentColor"
					class="h-4 w-4 mb-0.5 text-green-500 inline-block"
				>
					<path
						fill="currentColor"
						d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"
					></path></svg
			></span>

			<span class="md:hidden">{{
				truncateString(presence?.details, 28) ?? "Nothing right now"
			}}</span>
			<span class="hidden md:block">{{
				truncateString(presence?.details, 50) ?? "Nothing right now"
			}}</span>

			<div>
				<span :class="{ invisible: !presence?.assets?.large_text }">
					<span class="text-gray-500">by</span>
					{{ presence?.state }}
				</span>

				<span
					:class="{ invisible: !presence?.assets?.large_text }"
					class="inline-block md:ml-1"
				>
					<span class="md:hidden"
						><span class="text-gray-500">on</span>
						{{ truncateString(presence?.assets?.large_text, 28) }}</span
					>
					<span class="hidden md:inline-block"
						><span class="text-gray-500">on</span>
						{{ truncateString(presence?.assets?.large_text, 50) }}</span
					>
				</span>
			</div>

			<div class="py-2">
				<div
					class="rounded-lg bg-gray-400 dark:bg-gray-200/20 h-1 overflow-hidden"
				>
					<div
						class="rounded-lg bg-gray-500 dark:bg-white/75 h-1"
						:style="spotify.playerStyles ?? { width: '33%' }"
					></div>
				</div>

				<div class="flex items-center justify-between">
					<span>{{ spotify.timeElapsed ?? "00:00" }}</span>
					<span>{{ spotify.timeTotal ?? "00:00" }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
