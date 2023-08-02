import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/index.css";

import DiscordStatus from "./components/DiscordStatus.vue";
import WebsiteThemeToggler from "./components/WebsiteThemeToggler.vue";
import WebsiteNavbar from "./components/WebsiteNavbar.vue";
import SpotifyCard from "./components/SpotifyCard.vue";
import Time from "./components/Time.vue";

import LastFMapi from "./utils/LastFM";

export const LastFM = new LastFMapi();

const app = createApp(App);

app.use(router);

app.component("WebsiteNavbar", WebsiteNavbar);
app.component("DiscordStatus", DiscordStatus);
app.component("SpotifyCard", SpotifyCard);
app.component("WebsiteThemeToggler", WebsiteThemeToggler);
app.component("Time", Time);

app.mount("#app");
