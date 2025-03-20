import { ref, type Ref } from "vue";

export const global_now: Ref<number> = ref(performance.now());

export function update_on_mounted() {
    function run() {
        global_now.value = performance.now();

        requestAnimationFrame(run);
    }

    run();
}