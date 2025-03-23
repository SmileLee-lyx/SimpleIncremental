import { run_on_frame } from "@/components/misc/run-on-frame.ts";
import { ref, type Ref } from "vue";

export const global_now: Ref<number> = ref(performance.now());

export function init_timer() {
    run_on_frame(() => { global_now.value = performance.now(); });
}