<script lang="ts">

export default {
  data() {
    return {
        projects: [] as any[],
    }
  },
  methods: {
    truncate(str: string, n: number) {
      if (str.length > n) {
        return str.slice(0, n) + "...";
      } else {
        return str;
      }
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
    <div class="mt-28 mx-4 lg:mx-44 mb-8">
      <div>
        <h1 class="font-extra font-bold text-5xl py-2">Projects</h1>
        <p class="font-mono font-semibold text-neutral-500">Here are some of my open source projects on Github.</p>
      </div>
      <div class="text-neutral-500 mt-12">
        <h1 class="font-xl font-semibold">DETAILS</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-2">

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

      <div class="my-16">
        <h1 class="text-neutral-700 font-bold">MY PROJECTS</h1>
        <div class="grid grid-cols-1 lg:grid-cols-2 mt-4 gap-2">
          <a v-for="project in projects" :href="project.html_url" target="_blank" rel="noopener noreferrer">
            <div class="rounded-md p-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800/50 hover:dark:bg-neutral-800 transition-colors outline-1 outline outline-stone-300/50 dark:outline-stone-700/50">
              <div>
                <h1>
                  {{ project.name }}
                </h1>
                <p class="py-2 text-neutral-500">
                  {{ truncate(project.description, 63) }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>
</template>