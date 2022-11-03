import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/index.css";

import DiscordStatus from './components/DiscordStatus.vue';
import WebsiteThemeToggler from './components/WebsiteThemeToggler.vue';
import WebsiteNavbar from './components/WebsiteNavbar.vue';

const app = createApp(App);

app.use(router);

app.component('WebsiteNavbar', WebsiteNavbar);
app.component('DiscordStatus', DiscordStatus);
app.component('WebsiteThemeToggler', WebsiteThemeToggler);

app.mount('#app');
