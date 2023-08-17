<script lang="ts">
	export default {
		data() {
			return {
				photos: [
					{
						id: 1,
						name: "IMG_4137.jpg",
						path: "IMG_4137.jpg",
						wide: true,
					},
					{
						id: 2,
						name: "Surf",
						path: "IMG_5262.jpg",
						wide: false,
					},
					{
						id: 3,
						name: "IMG_5262.jpg",
						path: "IMG_5262.jpg",
						wide: false,
					},
					{
						id: 4,
						name: "Igor Borer",
						path: "IMG_4282.jpg",
						wide: true,
					},
					{
						id: 5,
						name: "IMG_5262.jpg",
						path: "IMG_5262.jpg",
						wide: false,
					},
				],
			};
		},
	};
</script>

<template>
	<main>
		<div class="mt-20 mx-4 lg:mx-44 mb-8">
			<div class="">
				<div class="py-2">
					<h1 class="font-extra font-bold text-5xl">Photo Gallery</h1>
					<h1 class="font-mono font-semibold">
						Welcome to my photo gallery. Here you can find some of my best
						photos and works.
					</h1>
					<h1 class="font-mono font-semibold">
						<span class="text-neutral-500">Follow me on </span> 
						<a href="https://instagram.com/jurgen.jpg" target="_blank">
							<span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Instagram</span>
						</a>
					</h1>
				</div>
			</div>
			<div class="mt-4 grid xl:grid-cols-4 gap-4 photo-grid">
				<div
					v-for="photo in photos"
					class="overflow-hidden rounded-md xl:hover:skew-y-2 hover:shadow-xl transition-all duration-300 h-[28rem] relative photo"
					:class="{ 'lg:col-span-3': photo.wide }"
				>
					<h1
						class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-extra bg-neutral-500/50 px-2 py-1 rounded-md z-10 transition-opacity duration-300"
						v-html="
							photo.name.replace(/\.\w+/g, (match) => {
								return `<span class='opacity-50'>${match}</span>`;
							})
						"
					></h1>
					<img
						:src="'/photos/' + photo.path"
						class="h-[28rem] w-full object-cover ring-1 ring-neutral-300/50 dark:ring-neutral-700/50 absolute duration-500"
					/>
				</div>
			</div>
		</div>
	</main>
</template>
