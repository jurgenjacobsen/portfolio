<script lang="ts">

export default {
    data() {
        return {
            events: [
                {day: 25, month: 12, text: "Merry Christmas! 🎅"},
                {day: 1, month: 1, text: "Happy New Year! 🎇"},
                {day: 9, month: 3, text: "It's my birthday! 🎂"},
            ],
            text: '',
        }
    },
    methods: {
        upDate() {
            const today = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Lisbon"}));
        
            let day:  number | string = today.getDate();
            let month: number | string = today.getMonth() + 1;
            let year = today.getFullYear();
            let event = this.events.find(e => e.day === day && e.month === month)

                month = today.toLocaleString('en-UK', { month: 'long' });
            
            // day text
            switch(day) {
                case 1:
                    day = '1st';
                    break;
                case 2:
                day = '2nd';
                    break;
                case 3:
                    day = '3rd';
                    break;
                default:
                    day = `${day}th`;
                    break;
            }

            let time = today.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

            this.text = `${day} ${month} ${year} • ${time} ${event?.text ? `<br> <b>${event.text}</b>` : ''}`;
        }
    },
    beforeMount() {
        this.upDate();
        setInterval(() => this.upDate(), 1000);
    }
}
</script>

<template>
    <span v-html="text" class="dark:opacity-50"></span>
</template>