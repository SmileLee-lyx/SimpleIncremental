import { onMounted } from "vue";

export function run_on_frame(action: () => void | boolean) {
    onMounted(() => {
        function run() {
            let result = action();

            if (!result) requestAnimationFrame(run);
        }

        run();
    });
}