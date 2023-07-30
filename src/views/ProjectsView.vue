<script lang="ts">

import { LastFM } from '@/main';

export default {
  data() {
    return {
        projects: [] as any[],
    }
  },
  methods: {
    goTo(href: string) {
        window.open(href, '_blank');
    }
  },
  async beforeMount() {

    try {
        this.projects = await (await fetch("https://api.github.com/users/jurgenjacobsen/repos")).json();
        if(!this.projects) throw new Error("No projects found")
        if(this.projects) {
            this.projects = this.projects.filter((project: any) => project.name !== "jurgenjacobsen");
        }
    } catch {
        console.log("Error on mount");
    }

  }
}
</script>

<template>
  <main>
    <div class="mt-20 mx-4 lg:mx-44 mb-8">
      <div class="head">
        <h1 class="text-4xl">Projects</h1>
        <p class="text-neutral-500">Here are some of my open source projects on Github.</p>
      </div>
      <div class="details text-neutral-500 mt-20">
        <h1 class="font-xl font-semibold">DETAILS</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">

          <div class="flex space-x-4 items-center justify-between pr-2 py-2">
            <span>Github</span> 
            <div class="flex space-x-2 items-center">
              <a class="flex-shrink-0 font-semibold" href="https://github.com/jurgenjacobsen" target="_blank">
                @jurgenjacobsen 
              </a>
              <div 
              v-if="projects[0]?.owner?.avatar_url"
              smart-image="true" 
              class="rounded-full h-6 w-6" 
              :style="`
              background-image: url(&quot;${projects[0]?.owner?.avatar_url}&quot;); 
              background-position: center center; 
              background-size: cover;
              `">
              </div>
            </div>
          </div>
          <div class="flex space-x-4 items-center justify-between sm:pl-2 pr-2 sm:pr-0 py-2">
            <span class="flex-shrink-0">Account Age</span>

              <div class="flex space-x-2 items-center font-semibold">
                <div class="truncate">
                  {{ new Date().getFullYear() - 2017 }} year(s)
                </div> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
          </div>
          <div class="flex space-x-4 items-center justify-between pr-2 py-2">
              <span class="flex-shrink-0">Total Projects</span>

              <div class="flex space-x-2 items-center font-semibold"><div class="truncate">{{ projects.length }}</div> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" filled="" class="h-6 w-6 "><path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd"></path></svg></div>
          </div>
        </div>
      </div>

      <div class="text-neutral-500 mt-20">
        <h1 class="font-xl font-semibold">MY PROJECTS</h1>
        <div class="songs grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-5 mt-5">

          <div v-for="project in projects" class="p-4 rounded-xl flex hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300">

            <div class="item-body cursor-pointer" @click="goTo(project.html_url)">
              <h1 class="font-bold flex">
                <a :href="project.html_url" target="_blank" rel="noopener noreferrer">
                  {{ project.name }}
                </a>
              </h1>

              <p>
                {{ project.description }}
              </p>
              
              <!-- Shows all topics if its on big screen -->
              <div class="hidden lg:block">
                <span v-for="topic in project.topics" class=" bg-neutral-200 dark:bg-neutral-800 mr-2 px-2 rounded">
                    {{ topic }}
                </span>
              </div>
              <!-- Shows Max. 3 topics if its on small screen -->
              <div class="block lg:hidden">
                <span v-for="topic in project.topics.slice(0,3)" class=" bg-neutral-200 dark:bg-neutral-800 mr-2 px-2 rounded">
                    {{ topic }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>