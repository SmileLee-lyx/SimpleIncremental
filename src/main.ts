import {createApp, onMounted} from 'vue'
import Decimal from "@/break-eternity/break-eternity.ts";
import { init } from "./init.ts";
import App from './components/App.vue'

init();

createApp(App).mount('#app');
