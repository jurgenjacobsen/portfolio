<script lang="ts">
	const bday = new Date(2005, 3, 9);

	const startedTakingPhotos = new Date(2021, 7, 1);
	const yearsSinceStartedTakingPhotos = new Date(
		Date.now() - startedTakingPhotos.getTime()
	).getUTCFullYear() - 1970;

	export default {
		data() {
			return {
				bday,
				age: undefined as any,
				pages: [
					{
						name: "Projects",
						description: "My open source projects published on Github.",
						href: "/me/projects",
					},
					{
						name: "Photos",
						description: `My photos taken in the last ${yearsSinceStartedTakingPhotos} years.`,
						href: "/me/photos",
					},
					{
						name: "Music",
						description: "A summary of my Spotify activity.",
						href: "/me/songs",
					},
					{
						name: "Resume",
						description:
							"Here's my resume with a bit more information about me.",
						href: "/me/resume",
					},
					{
						name: "Donate",
						description: "Feel free to support me and my projects.",
						href: "https://github.com/sponsors/jurgenjacobsen",
						extra: true,
					},
				],
				socials: [
					{
						name: "Github",
						href: "https://github.com/jurgenjacobsen",
						icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="currentColor"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/></svg>',
					},
					{
						name: "Instagram",
						href: "https://instagram.com/jurgen.jacobsen",
						icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>',
					},
					{
						name: "Email",
						href: "mailto:jurgenjacobsen@outlook.com",
						icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="currentColor"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>',
					},
				],
			};
		},
		async beforeMount() {
			const diff = Date.now() - bday.getTime();
			const age = new Date(diff);
			this.age = Math.abs(age.getUTCFullYear() - 1970);
		},
	};
</script>

<template>
	<main>
		<div class="mt-20 mx-4 lg:mx-44 mb-8">
			<div class="md:w-1/2 text-left">
				<h1 class="font-mono font-semibold py-2">Welcome, my name is</h1>
				<h1 class="font-extra font-bold text-5xl py-2">Jürgen Jacobsen</h1>
				<h1 class="font-mono font-semibold text-neutral-500 py-2">
					{{ age }}-year-old
					<span
						class="text-blurple dark:text-neutral-500 underline font-bold cursor-default"
						>full-stack</span
					>
					web developer from Brazil now living in Portugal.
				</h1>
				<div class="py-2">
					<a
						v-for="social in socials"
						:href="social.href"
						target="_blank"
						class="inline-block mr-4 hover:opacity-100 opacity-80 duration-300 transition-opacity"
					>
						<div v-html="social.icon"></div>
					</a>
				</div>
				<div class="py-2 mt-4">
					<div class="space-y-2">
						<Time class="font-mono font-semibold text-neutral-400 py-2"></Time>
						<img
							src="https://wakatime.com/badge/user/010adc07-6382-419f-87bc-0b3f507ee495.svg?style=flat-square"
							alt="Total time coded since Aug 27 2021"
							class="grayscale"
						/>
					</div>
				</div>
			</div>

			<div class="my-16">
				<h1 class="text-neutral-700 font-bold">PAGES</h1>
				<div class="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-2">
					<a v-for="page in pages.filter(p => !p.extra)" :href="page.href">
						<div
							class="rounded-md p-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/50 hover:dark:bg-neutral-800 transition-colors ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
						>
							<h1>
								{{ page.name }}
							</h1>
							<p class="py-2 text-neutral-500">
								{{ page.description }}
							</p>
						</div>
					</a>
				</div>

				<h1 class="text-neutral-700 font-bold mt-6">EXTRAS</h1>
				<div class="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-2">
					<a v-for="page in pages.filter(p => p.extra)" :href="page.href">
						<div
							class="rounded-md p-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/50 hover:dark:bg-neutral-800 transition-colors ring-1 ring-neutral-300/50 dark:ring-neutral-700/50"
						>
							<h1>
								{{ page.name }}
							</h1>
							<p class="py-2 text-neutral-500">
								{{ page.description }}
							</p>
						</div>
					</a>
				</div>
			</div>
		</div>
	</main>
</template>
