import { createApp } from 'vue';
import App from './components/App.vue';
import { init } from "./init.ts";

init();

createApp(App).mount('#app');
