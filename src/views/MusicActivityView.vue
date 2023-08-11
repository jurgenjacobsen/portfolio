<script lang="ts">
	import { LastFM } from "@/main";

	function wait(ms: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms);
		});
	}

	export default {
		data() {
			return {
				user: null as any | null,
				topSongs: null as any | null,
				topArtists: null as any | null,
				topAlbumns: null as any | null,
				fails: 0,
			};
		},
		async beforeMount() {
			const setup = async (): Promise<any> => {
				this.user = await LastFM.getUserInfo().catch(() =>
					console.log("Error fetching user info"),
				);
				this.topSongs = await LastFM.getUserTopSongs().catch(() =>
					console.log("Error fetching user top songs"),
				);

				if ((!this.topSongs || !this.user) && this.fails < 3) {
					this.fails++;
					await wait(10 * 1000);
					console.log("Retrying...");
					return setup();
				} else if (this.fails >= 2) {
					console.log("Failed to fetch data");

					return;
				}

				this.topSongs.array.forEach((song: any) => {
					this.getSongArt(song);
				});
			};
			try {
				setup().catch((err) => {
					console.log(err);
				});
			} catch {
				console.log("Error on mount");
			}
		},
		methods: {
			async getSongArt(track: any) {
				let data = await LastFM.call(
					"track.getInfo",
					`artist=${track.artist.name}_track=${track.name}_autocorrect=1`,
				);
				if (!data.track) return;

				this.topSongs.map.set(track.mbid, {
					...track,
					cover: data.track?.album?.image[3]["#text"],
				});

				this.topSongs.array = Array.from(this.topSongs.map.values());
			},
		},
	};
</script>

<template>
	<main>
		<div class="mt-28 mx-4 lg:mx-44 mb-8">
			<div>
				<h1 class="font-extra font-bold text-5xl py-2">Music Activity</h1>
				<p class="font-mono font-semibold text-neutral-500">
					My latest activity on Spotify.
				</p>

				<div
					class="mt-4 rounded-md p-2 bg-neutral-100 dark:bg-neutral-800/50 ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
				>
					<SpotifyCard :showAnywayProp="true" :bigSizeProp="true" />
				</div>
			</div>

			<div class="text-neutral-500 mt-12">
				<h1 class="font-xl font-semibold">DETAILS</h1>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">
					<div class="flex space-x-4 items-center justify-between pr-2 py-2">
						<span>Profile</span>
						<div class="flex space-x-2 items-center">
							<a
								class="font-semibold flex-shrink-0"
								href="https://open.spotify.com/user/j%C3%BCrgenjacobsen?si=71933d2d99604f6c"
								target="_blank"
							>
								@jurgenjacobsen
							</a>
							<div
								v-if="user?.image[3]?.['#text']"
								smart-image="true"
								class="rounded-full h-6 w-6"
								:style="`
              background-image: url(&quot;${user?.image[3]?.['#text']}&quot;); 
              background-position: center center; 
              background-size: cover;
              `"
							></div>
						</div>
					</div>

					<div
						class="flex space-x-4 items-center justify-between sm:pl-2 pr-2 sm:pr-0 py-2"
					>
						<span class="flex-shrink-0">Account Age</span>

						<div class="flex space-x-2 items-center">
							<div class="truncate font-semibold">
								{{ new Date().getFullYear() - 2017 }} year(s)
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								class="h-6 w-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								></path>
							</svg>
						</div>
					</div>

					<div class="flex space-x-4 items-center justify-between pr-2 py-2">
						<span class="flex-shrink-0">Total Plays</span>

						<div class="flex space-x-2 items-center">
							<div class="truncate font-semibold">
								{{ user?.playcount ?? 0 }}
							</div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								filled=""
								class="h-6 w-6"
							>
								<path
									fill-rule="evenodd"
									d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
									clip-rule="evenodd"
								></path>
							</svg>
						</div>
					</div>

					<div
						class="flex space-x-4 items-center justify-between sm:pl-2 pr-2 sm:pr-0 py-2"
					>
						<span class="flex-shrink-0">Artists Count</span>

						<div class="flex space-x-2 items-center">
							<div class="truncate font-semibold">
								{{ user?.artist_count ?? 0 }}
							</div>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 5 25 15  "
								fill="none  "
								filled=""
								class="h-6 w-6"
							>
								<path
									d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<div class="my-16">
				<h1 class="text-neutral-700 font-bold">TOP SONGS (LAST 7 DAYS)</h1>
				<div
					v-if="topSongs?.array.length > 0"
					class="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-2"
				>
					<div
						v-for="song in topSongs?.array
							.sort((a: any, b: any) => b.playcount - a.playcount)
							.slice(0, 6)"
						class="p-4 rounded-md flex bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/50 hover:dark:bg-neutral-800 transition-colors ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
					>
						<img
							:src="
								song.cover ??
								'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
							"
							:alt="song.name"
							class="w-20 h-20 rounded-md"
						/>
						<div class="px-4">
							<h1 class="flex">
								<a :href="song.url" target="_blank" rel="noopener noreferrer">
									{{ song.name }}
								</a>
								<svg
									v-if="song?.['@attr']?.rank === '1'"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									filled=""
									class="ml-2 mt-1 h-4 w-4 text-neutral-500"
								>
									<path
										d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
									/>
								</svg>
							</h1>
							<a
								class="text-neutral-500"
								:href="song.artist?.url"
								target="_blank"
								rel="noopener noreferrer"
							>
								{{ song.artist?.name }}
							</a>

							<p
								class="rounded-md text-blurple bg-blue-600/10 ring-[0.5px] px-4 py-1 mt-2 justify-bottom text-xs w-[5rem]"
							>
								{{ song.playcount }} plays
							</p>
						</div>
					</div>
				</div>

				<div
					class="text-blurple dark:text-inherit grid place-items-center mt-10"
					v-else
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="currentColor"
						viewBox="0 0 512 512"
						class="h-12 w-12 animate-spin-slow"
						v-if="fails < 3"
					>
						<path
							d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm464-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM142.9 437A48 48 0 1 0 75 369.1 48 48 0 1 0 142.9 437zm0-294.2A48 48 0 1 0 75 75a48 48 0 1 0 67.9 67.9zM369.1 437A48 48 0 1 0 437 369.1 48 48 0 1 0 369.1 437z"
						/>
					</svg>
					<span class="opacity-75" v-else>
						LastFM API failed to respond. Please try again later.
					</span>
				</div>
			</div>
		</div>
	</main>
</template>
