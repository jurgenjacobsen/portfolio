<script lang="ts">
    
    import { defineComponent } from "vue";

    interface ICategory {
        id: string
        title: string
    }
    interface IPage {
        title: string
        href: string
        icon: string
        iconProps?: {
            [key: string]: string
        }
        category: string
    }

    export default defineComponent({
        name: 'Navbar',
        data() {
            return {
                showMenu: false,
                search: "",
                categories: [
                    { id: "pages", title: "Pages" },
                    { id: "me", title: "Me" },
                    { id: "ql", title: "Quick Links" },
                ] as ICategory[],
                pages: [
                    {
                        title: "Home",
                        href: "/",
                        icon: "IconHome",
                        category: "pages",
                    },
                    {
                        title: "Songs",
                        href: "/me/songs",
                        category: "me"
                    }
                ] as IPage[],
            }
        },
        methods: {
            openMenu() {
                return this.showMenu = !this.showMenu;
            }
        },
        mounted() {
            document.onkeydown = (e) => {
                if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault(); // present "Save Page" from getting triggered.
                    this.openMenu();
                };
                if (e.key === "Escape") {
                    e.preventDefault(); // present "Save Page" from getting triggered.
                    this.showMenu = false;
                };
            };
        },
        computed: {
            getCategoriesFiltered(): { category: ICategory; pages: IPage[] }[] {
                const categories = this.categories
                const items: { category: ICategory; pages: IPage[] }[] = []
                for (const category of categories) {
                    const categoryItems = this.pages.filter(
                    (page) =>
                        page.category === category.id &&
                        (this.search
                        ? page.title?.toLowerCase().includes(this.search?.toLowerCase())
                        : true)
                    )
                    if (categoryItems.length > 0) {
                        items.push({ category, pages: categoryItems })
                    }
                }
                return items
            },
        }
    });
</script>

<template>
    <nav class="px-2 sm:px-4 py-2.5 select-none">
  
    <div class="container flex flex-wrap justify-between items-center mx-auto px-44">
        <span href="/" class="flex items-center">
            <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white flex items-center space-x-2 rounded-md text-neutral-500 mt-4"> 
            <DiscordStatus :ShowPresence="true"></DiscordStatus> <span class="font-extra text-neutral-900 dark:text-neutral-500">Jürgen</span>
            </span>
        </span>

        <div class="flex space-x-2 items-center">
            <a @click="openMenu" data-tooltip-target="menu-tooltip" data-tooltip-placement="bottom" class="cursor-pointer flex space-x-2 transition-colors btn items-center justify-center focus:outline-none text-gray-700 dark:text-neutral-400 rounded-full p-2 sm:w-max bg-gray-200 hover:bg-gray-200/40 dark:bg-neutral-800 dark:hover:bg-neutral-800/40">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>

            </a>

            <div 
            id="menu-tooltip" 
            role="tooltip" 
            class="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium 
                   text-gray-800 dark:text-white bg-gray-200 rounded-lg shadow-sm 
                   tooltip dark:bg-neutral-800 opacity-0 transition-opacity 
                   duration-400">
                ⌘/CTRL + K
                <div class="tooltip-arrow" data-popper-arrow></div>
            </div>

            <WebsiteThemeToggler></WebsiteThemeToggler>
        </div>
    </div>
    </nav>

    <div v-if="showMenu" class="
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
                        type="search" 
                        id="menu-search" 
                        class="
                        block p-3 pl-10 w-full text-sm text-gray-900 
                        rounded-t-lg dark:placeholder-gray-400 dark:text-white bg-neutral-700 
                        outline-none focus:outline-none border-none focus:border-none ring-0 focus:ring-0" 
                        placeholder="Search" required>
                    </div>
                </form>
                
            </div>
            <!-- Modal body -->
            <div class="p-6 space-y-6">
                <div v-for="(item, index) in getCategoriesFiltered" :key="`command-palette-category-${index}`">
                    <span class="text-xs px-2 font-semibold text-neutral-500">
                        {{ item.category.title }}
                    </span>

                    <div class="my-2">
                        <a v-for="(page, idx) in item.pages" :href="page.href">
                            <div class="w-full hover:bg-neutral-700 p-2 ml-2 rounded-lg">
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