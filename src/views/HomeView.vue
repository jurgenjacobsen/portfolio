<script setup lang="ts">

</script>

<template>
  <main>
    <div class="mt-20 md:flex mx-40">

      <div class="md:w-1/2 p-10 text-left">
        <h1 class="font-mono p-2">
          Hello, my name is
        </h1>
        <h1 class="font-extra text-5xl p-2">
          Jürgen Jacobsen
        </h1>
        <h1 class="font-mono p-2 text-neutral-500">
          Self taught <span class="text-blurple dark:text-neutral-500 underline font-bold cursor-default">full-stack</span> web developer. 
          Used to frameworks such as <a class="underline" href="https://vuejs.org/">Vue.js</a> and <a class="underline" href="https://tailwindcss.com/">Tailwind.css</a>
        </h1>
      </div>

      <div class="md:w-1/2 p-10 text-left">
        <img src="../assets/img/undraw_developer_activity_re_39tg.svg" alt="Developer" class="w-1/2">
      </div>

    </div>

    <!-- PAGES -->
    <div class="mt-20 mx-44">
      <h1 class="text-neutral-700 font-bold px-8">PAGES</h1>

      <div class="grid grid-cols-1 md:grid-cols-2 px-2 mt-4">

        <a href="#">
          <div class="rounded-md p-4 mx-2 h-28 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300">
            <h1>Donate</h1>
            <p class="py-2 text-neutral-500">Want to support me and my projects so that I can keep on developing stuff?</p>
          </div>
        </a>
        <a href="#">
          <div class="rounded-md p-4 mx-2 h-28 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300">
            <h1>Daily Songs</h1>
            <p class="py-2 text-neutral-500">Fresh, cool and great song recomendations from me every day!</p>
          </div>
        </a>

      </div>
    </div>
  </main>
</template>
