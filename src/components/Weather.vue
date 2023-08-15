<script lang="ts">
	import axios from "axios";

	export default {
		data() {
			return {
                // https://home.openweathermap.org/api_keys
                // api_key: String,
				
				url_base: "https://api.openweathermap.org/data/2.5/",
				weather_icon: "http://openweathermap.org/img/wn/",
				location: "Póvoa De Varzim",
				weather: {} as any,
			};
		},
        beforeMount() {
            this.fetchWeather();
        },
		methods: {
			async fetchWeather() {
				let response = await axios.get(
					`${this.url_base}weather?q=${this.location}&units=metric&APPID=${this.api_key}`,
				);
				this.setResults(response.data);
			},
			setResults(returnedResponse: any) {
				this.weather = returnedResponse;
			},
			todaysDate() {
				const months = [
					"Jan",
					"Feb",
					"Mar",
					"Apr",
					"May",
					"Jun",
					"Jul",
					"Aug",
					"Sep",
					"Oct",
					"Nov",
					"Dec",
				];
				const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				let d = new Date();
				let month = months[d.getMonth()];
				let day = days[d.getDay()];
				let date = d.getDate();
				let year = d.getFullYear();
				return `${month} ${date} ${day} ${year}`;
			},
		},
	};
</script>

<template>
    <div class="weather-box">
        <div class="h-12">
            <img class="h-18 w-18 -mt-6 inline" v-if="weather.weather?.[0]?.icon" :src="`${weather_icon}${weather.weather?.[0]?.icon}${'@2x.png'}`"/>
            <div class="font-bold font-extra text-5xl inline">{{ Math.round(weather?.main?.temp??0) }}°C</div>
        </div>

        <div>
            <div class="inline font-semibold font-mono px-4 opacity-50">Weather in {{ location }} is now</div>
            <div class="inline font-semibold font-mono">{{ weather.weather?.[0]?.main }}</div>
        </div>
    </div>
</template>