<script lang="ts">
    
    import { defineComponent } from "vue";

    interface ICategory {
        id: string
        title: string
    }
    interface IPage {
        title: string
        href: string
        category: string
    }

    function wait(ms: number) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    export default defineComponent({
        name: 'Navbar',
        data() {
            return {
                listener: null as any,
                showMenu: false,
                search: "",
                SearchBarResults: [] as any[],
                categories: [
                    { id: "pages", title: "Pages" },
                    { id: "me", title: "Me" },
                    { id: "ql", title: "Quick Links" },
                ] as ICategory[],
                pages: [
                    {
                        title: "Home",
                        href: "/",
                        category: "pages",
                    },
                    {
                        title: "Projects",
                        href: "/me/projects",
                        category: "me"
                    },
                    {
                        title: "Donate",
                        href: "/me/donate",
                        category: "ql"
                    },
                    {
                        title: "Music Activity",
                        href: "/me/songs",
                        category: "me"
                    },
                    {
                        title: "About",
                        href: "/me/about",
                        category: "me"
                    }
                ] as IPage[],
            }
        },
        methods: {
            toggleMenu() {
                if (this.showMenu) {
                    this.showMenu = false;
                    this.listener = null;
                    return;
                }

                this.showMenu = true;
                this.listener = document.onclick = (e) => {
                    let target = e.target as HTMLElement;

                    let stw;
                    try {
                        stw = target.className.startsWith("relative");
                    } catch (e) {
                        stw = false;
                    }

                    if (target.id === "menu" || stw) {
                        this.showMenu = false;
                        this.listener = null;
                    }
                }

            },
            async UpdateSearchBarInput() {
                await wait(100);

                this.search = (document.getElementById("menu-search") as HTMLInputElement).value;

                this.UpdateSearchBarResults();
            },
            UpdateSearchBarResults() {
                this.SearchBarResults = this.categories.map((category) => {
                    return {
                        category,
                        pages: this.pages.filter((page) => page.category === category.id && (this.search.length > 0 ? page.title.toLowerCase().includes(this.search.toLowerCase()) : true))
                    }
                }).filter((category) => category.pages.length > 0);
            },
            UpdateSearchBarResultsDefault() {
                this.SearchBarResults = this.categories.map((category) => {
                    return {
                        category,
                        pages: this.pages.filter((page) => page.category === category.id)
                    }
                }).filter((category) => category.pages.length > 0);
            }
        },
        mounted() {
            this.UpdateSearchBarResultsDefault();

            document.onkeydown = (e) => {
                if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    this.toggleMenu();
                };
                if (e.key === "Escape") {
                    e.preventDefault();
                    this.showMenu = false;
                };
            };
        }
    });
</script>

<template>

    <div class="bg-[#5865F2] w-full py-1 dark:bg-neutral-800"></div>

    <nav class="px-2 sm:px-4 py-2.5 select-none">
  
    <div class="container flex flex-wrap justify-between items-center mx-auto md:px-44">
        <span class="flex items-center">
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white flex items-center space-x-2 rounded-md text-neutral-500"> 
                <DiscordStatus :ShowPresence="true"></DiscordStatus>

                <span class="font-extra text-neutral-900 dark:text-neutral-500 cursor-pointer" onclick="location.href='/'">
                    Jürgen
                </span>
            </span>
        </span>

        <div class="flex space-x-2 items-center">
            <a @click="toggleMenu" data-tooltip-target="menu-tooltip" data-tooltip-placement="bottom" class="cursor-pointer flex space-x-2 transition-colors btn items-center justify-center focus:outline-none text-gray-700 dark:text-neutral-400 rounded-full p-2 sm:w-max bg-gray-200 hover:bg-gray-200/40 dark:bg-neutral-800 dark:hover:bg-neutral-800/40">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>

            </a>

            <WebsiteThemeToggler></WebsiteThemeToggler>
        </div>
    </div>
    </nav>

    <div v-if="showMenu" id="menu" class="
    menu overflow-y-auto overflow-x-hidden fixed top-0 right-0 
    left-0 z-50 w-full md:inset-0 h-modal md:h-full bg-neutral-900/50">

    <div class="relative p-4 w-full max-w-4xl h-full md:h-auto mx-auto">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow dark:bg-neutral-800">
            <!-- Modal header -->
            <div class="flex justify-between items-start rounded-t border-b border-neutral-500">

                <form class="w-full" autocomplete="off">

                    <div class="relative">

                        <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>

                        <input 
                        
                        id="menu-search" 
                        class="
                        block p-3 pl-10 w-full text-sm text-gray-900 
                        rounded-t-lg dark:placeholder-gray-400 dark:text-white bg-neutral-200 dark:bg-neutral-700 
                        outline-none focus:outline-none border-none focus:border-none ring-0 focus:ring-0" 
                        placeholder="Search - Ctrl  + K"  @keydown="UpdateSearchBarInput()" required>
                    </div>
                </form>
                
            </div>
            <!-- Modal body -->
            <div class="p-6 space-y-6">
                <div v-for="(item, index) in SearchBarResults" :key="`command-palette-category-${index}`">
                    <span class="text-xs px-2 font-semibold text-neutral-500">
                        {{ item.category.title }}
                    </span>

                    <div class="my-2">
                        <a v-for="(page, idx) in item.pages" :href="page.href">
                            <div class="w-full hover:bg-neutral-200  dark:hover:bg-neutral-700 py-2 px-4 ml-2 rounded-lg">
                                {{ page.title }}
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>