<script lang="ts">
import { defineComponent } from "vue";
import Lanyard from "../utils/Lanyard";
import type { LanyardData, Activity } from "../utils/Lanyard/types";

export default defineComponent({
    props: {
        ShowPresence: {
            type: Boolean,
            default: true,
        }
    },
    data() {
        return {
            finished: false,
            newData: false,
            lanyard: {} as LanyardData,
            socket: null as WebSocket | null,
            spotify: {
                playerStyles: { width: '1' },
                timeElapsed: '0',
                timeLeft: '0',
            }
        }
    },
    computed: {
        presence(): Activity | undefined {
            const lanyard = this.lanyard;
            if (!lanyard) return undefined;

            const filtered: Activity | undefined = lanyard.activities?.filter((activity) => activity.type !== 4)?.pop();
            return filtered;
        },
        getStatusDetails(): string {
            const lanyard = this.lanyard;
            if (!lanyard) return "Couldn't fetch data from Lanyard";

            const filtered: Activity | null = lanyard.activities?.filter((activity) => activity.type !== 4)?.pop() || null;

            // Offline
            if (this.lanyard?.discord_status === "offline") return "Offline"
            else if (!filtered) return "Online"
            // Spotify
            else if (filtered.name === "Spotify" && !!lanyard.spotify) {
                const { song, artist } = lanyard.spotify || {}
                const firstArtist = artist?.split("; ")?.[0];
                return `Listening to **${song}** by **${firstArtist || "someone"}**`
            }
            // Visual Studio Code
            else if (filtered.name === "Visual Studio Code") {
                //const replaced = filtered.state?.replace("📁 ", "")?.split(" | ")?.[0] || "a file";
                return `Working on **Visual Studio Code**`;
            }
            // Netflix
            else if (filtered.name === "Netflix" && filtered.details) {
                return `Watching **${filtered.details}** on **Netflix**`
            }
            // YouTube Music
            else if (filtered.name === "YouTube Music" && filtered.details) {
                return `Listening to **${filtered.details}** on **YouTube Music**`
            }
            // YouTube
            else if (filtered.name === "YouTube" && filtered.details) {
                return `Watching ${filtered.details} on YouTube`
            }

            // Default values
            else
                switch (filtered.name) {
                case "Google Meet":
                    return "In a Google Meet meeting"
                case "Twitch":
                    return "Watching a stream on Twitch"
                case "Prime Video":
                    return "Watching something on Prime Video"
                default:
                    return "Online"
                }
        },
        getSafeHthml(): string {
            return this.getStatusDetails
            .replace(/\*\*(.*?)\*\*/gm,
                "<strong>$1</strong>")
        },
        getDiscordStatus(): string {
            switch (this.lanyard.discord_status) {
                case "online":
                return "online"
                case "idle":
                return "idle"
                case "dnd":
                return "DND"
                default:
                return this.lanyard.discord_status;
            }
        },
        getDiscordStatusColor(): string {
            switch (this.lanyard.discord_status) {
                case "online":
                return "bg-green-500"
                case "idle":
                return "bg-yellow-500"
                case "dnd":
                return "bg-red-500"
                default:
                return "bg-gray-500 dark:bg-gray-200"
            }
        },
        getDiscordStatusIcon(): string {
            switch (this.lanyard.discord_status) {
                case "online":
                return "green"
                case "idle":
                return "yellow"
                case "dnd":
                return "red"
                default:
                return "gray"
            }
        },
    },
    beforeDestroy() {
        this.socket?.close()
    },
    async mounted() {
    // Connect to Lanyard Socket API, send heartbeat every 30 seconds and replace the Vue data value with the message using @eggsydev/vue-lanyard module
        this.socket = (await Lanyard({
            userID: "292065674338107393",
            socket: true,
        })) as WebSocket;

        this.socket?.addEventListener("message", ({ data }) => {
            const { t: type, d: status } = JSON.parse(data) as {
                t: "INIT_STATE" | "PRESENCE_UPDATE"
                d: LanyardData
            }
            if (type === "INIT_STATE" || type === "PRESENCE_UPDATE")
                this.lanyard = status || {}

            this.newData = !this.newData
            this.finished = true
        });

        
        setInterval(() => {
            this.updatePlayer();
        }, 1000);
  },
  methods: {
    truncateString(str: string, num: number) {
        if (str.length > num) {
            return str.slice(0, num) + "...";
        } else {
            return str;
        }
    },  
    getPlayerStyles() {
        if(typeof this.presence?.timestamps?.end !== "number" || typeof this.presence?.timestamps?.start !== "number") return undefined;
        const total = this.presence.timestamps.end - this.presence.timestamps.start;
        let timestamp = Date.now();

        const progress = 100 - (100 * (this.presence.timestamps.end - timestamp)) / total;
        if (progress > 100)
            return {
            width: "100%",
            }
        else return {
            width: `${progress.toFixed(2)}%`,
        }
    },
    getPlayerTimeLeft() {
        const currentTime = Date.now()
        if(typeof this.presence?.timestamps?.end !== "number" || typeof this.presence?.timestamps?.start !== "number") return undefined;

        const timeLeft = this.presence.timestamps.end - (this.presence.timestamps.start || currentTime);
        const timeLeftArray = [
            Math.round((timeLeft / (1000 * 60)) % 60),
            Math.round((timeLeft / 1000) % 60),
        ]
        const mapFunction = (time: number) => `0${time}`.slice(-2)
        return timeLeftArray.map(mapFunction).join(":")
    },
    getPlayerTimeElapsed() {
        const currentTime = Date.now();
        if(!this.presence?.timestamps?.start) return undefined;

        const timeElapsed = currentTime - this.presence.timestamps.start;
        const timeElapsedArray = [
            Math.round((timeElapsed / (1000 * 60)) % 60),
            Math.round((timeElapsed / 1000) % 60),
        ]
        const mapFunction = (time: number) => `0${time}`.slice(-2)
        return timeElapsedArray.map(mapFunction).join(":")
    },
    updatePlayer() {
        this.spotify.playerStyles = this.getPlayerStyles() as any;
        this.spotify.timeElapsed = this.getPlayerTimeElapsed() as any;
        this.spotify.timeLeft = this.getPlayerTimeLeft() as any;
    }
  }
})
</script>

<template>
    <div 
    class="h-3 w-3 rounded-full flex-shrink-0" 
    :class="getDiscordStatusColor" 
    data-tippy-directive=""
    data-tooltip-target="discord-status-tooltip" 
    data-tooltip-placement="bottom"
    ></div>

    <div
    v-if="ShowPresence" 
    id="discord-status-tooltip" 
    role="tooltip" 
    class="
    absolute overflow-hidden hidden lg:block invisible z-10 py-2 px-3
    text-sm font-medium text-gray-800 dark:text-white bg-gray-200 
    rounded-lg shadow-sm tooltip dark:bg-neutral-800
    opacity-0 transition-opacity duration-400
    ">
        <div class="spotify flex" v-if="presence?.name === 'Spotify'">
            <img 
            :src="`https://i.scdn.co/image/${presence?.assets?.large_image?.replace(/spotify:/, '')}`" 
            :alt="presence.state"
            class="object-cover w-28 h-28 rounded-lg"
            >
            <div class="text-box w-full pl-3 pr-1.5 mt-1 grid grid-cols-1 align-center">
                <span class="text-[#1DB954]">Listening on Spotify</span>
                <span> {{ truncateString(presence.details as string, 48) }}</span>
                <span><span class="text-gray-500">by</span> {{ presence.state }}</span>
                <span v-if="presence.assets?.large_text"><span class="text-gray-500">on</span> {{ truncateString(presence.assets?.large_text, 46) }}</span>

                <div class="py-2" v-if="presence.name === 'Spotify' && typeof presence?.timestamps?.end === 'number' && typeof presence?.timestamps?.start === 'number'">
                    <div class="rounded-lg bg-gray-400 dark:bg-gray-200/20 h-1">
                        <div
                        class="rounded-lg bg-gray-500 dark:bg-white/75 h-1"
                        :style="spotify.playerStyles"
                        ></div>
                    </div>

                    <div class="flex items-center justify-between">
                        <span>{{ spotify.timeElapsed }}</span>
                        <span>{{ spotify.timeLeft }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="other" v-else>
            <span v-html="getSafeHthml"></span>
        </div>
        
        <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
</template>

<style scoped>

</style>