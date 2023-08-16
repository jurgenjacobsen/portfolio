import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/dashboard",
			name: "dashboard",
			component: () => import("../views/DashboardView.vue"),
		},
		{
			path: "/me/resume",
			name: "resume",
			component: () => import("../views/ResumeView.vue"),
		},
		{
			path: "/me/songs",
			name: "songs",
			component: () => import("../views/MusicActivityView.vue"),
		},
		{
			path: "/me/projects",
			name: "projects",
			component: () => import("../views/ProjectsView.vue"),
		},
		{
			path: "/me/photos",
			name: "photos",
			component: () => import("../views/PhotosProjectsView.vue"),
		},
	],
});

export default router;
