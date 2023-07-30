<script lang="ts">

export default {
  data() {
    return {
      pages: [
        {
          name: "Projects",
          description: "Here are some of my open source projects on Github.",
          href: "/me/projects"
        },
        {
          name: "Music",
          description: "A summary of my Spotify activity.",
          href: "/me/songs"
        },
        {
          name: "Donate",
          description: "Feel free to support me and my projects.",
          href: "/me/donate"
        },
        {
          name: "About",
          description: "A little bit about me.",
          href: "/me/about"
        }
      ]      
    }
  },
  async beforeMount() {
    
  }
}
</script>

<template>
  <main>
    <div class="mt-20 md:flex md:mx-40">
      <div class="md:w-1/2 p-10 text-left">
        <h1 class="font-mono p-2">
          Hello, my name is
        </h1>
        <h1 class="font-extra text-5xl p-2">
          Jürgen Jacobsen
        </h1>
        <h1 class="font-mono p-2 text-neutral-500">
          I'm a <span class="text-blurple dark:text-neutral-500 underline font-bold cursor-default">full-stack</span> web developer. 
          Used to frameworks such as <a class="underline" href="https://vuejs.org/">Vue.js</a> and <a class="underline" href="https://tailwindcss.com/">Tailwind.css</a>
        </h1>
      </div>
      <div class="md:w-1/2 p-10 text-left">
        <img src="../assets/img/undraw_developer_activity_re_39tg.svg" alt="Developer" class="w-1/2">
      </div>
    </div>
    <div class="mt-14 md:mt-20 md:mx-44">
      <h1 class="text-neutral-700 font-bold px-8">PAGES</h1>
      <div class="grid grid-cols-1 lg:grid-cols-2 px-2 mt-4 gap-2 mx-2">
        <a v-for="page in pages" :href="page.href">
          <div class="rounded-md p-4 h-28 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300">
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
  </main>
</template>
