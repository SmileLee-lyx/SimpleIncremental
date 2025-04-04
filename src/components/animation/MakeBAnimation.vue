<script lang="ts" setup>
import { onMounted, type Ref } from "vue";
import { ref } from "vue";

const props = defineProps<{
  set_start_animation: (func: () => void) => void;
}>()

let show: Ref<boolean> = ref(false);
let color: Ref<string> = ref('');
let phase: Ref<number> = ref(0);

function start_animation() {
  show.value = true;
  phase.value = 0;
  color.value = 'red';
}

function before_enter(_el: Element) {
  const el = _el as HTMLElement;
  el.style.setProperty('--scale', '0');
}

function enter(_el: Element, done: () => void) {
  const el = _el as HTMLElement;
  el.style.transition = 'transform 1s ease-in';
  requestAnimationFrame(() => {
    el.style.setProperty('--scale', '20');
  });
  setTimeout(done, 1000);
}

function after_enter(_el: Element) {
  const el = _el as HTMLElement;
  phase.value = 1;
  el.style.transition = 'background 1s ease';
  color.value = 'blue';
  setTimeout(() => {
    show.value = false;
  }, 1000);
}

function before_leave(el: Element) {
  phase.value = 2;
}

function leave(_el: Element, done: () => void) {
  const el = _el as HTMLElement;
  el.style.transition = 'transform 1s ease-out';
  requestAnimationFrame(() => {
    el.style.setProperty('--scale', '0');
  });
  setTimeout(done, 1000);
}

function after_leave(el: Element) {}

onMounted(() => {
  props.set_start_animation(start_animation);
})

</script>

<template>
  <div class="container">
    <transition
        @enter="enter"
        @before-enter="before_enter"
        @after-enter="after_enter"
        @leave="leave"
        @before-leave="before_leave"
        @after-leave="after_leave"
    >
      <div v-if="show" :style="{ 'background': color, }" class="circle"/>
    </transition>
  </div>
</template>

<style scoped>
.circle {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  --scale: 0;
  transform: translate(-50%, -50%) scale(var(--scale));
  z-index: 1000;
}
</style>