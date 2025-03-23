import App from '@/components/App.vue';
import { createApp } from 'vue';
import { init } from "./init.ts";

init();

createApp(App).mount('#app');
