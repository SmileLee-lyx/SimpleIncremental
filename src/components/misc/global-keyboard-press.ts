import { onMounted, onUnmounted, ref } from "vue";

export let is_shift_pressed = ref(false);
export let is_ctrl_pressed = ref(false);

export function init_keyboard_press() {
    function handleKeyEvent(e: KeyboardEvent) {
        is_shift_pressed.value = e.shiftKey;
        is_ctrl_pressed.value = e.ctrlKey;
    }

    function handleBlurEvent(e: Event) {
        is_shift_pressed.value = false;
        is_ctrl_pressed.value = false;
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeyEvent);
        window.addEventListener('keyup', handleKeyEvent);
        window.addEventListener('blur', handleBlurEvent);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeyEvent);
        window.removeEventListener('keyup', handleKeyEvent);
        window.removeEventListener('blur', handleBlurEvent);
    });
}