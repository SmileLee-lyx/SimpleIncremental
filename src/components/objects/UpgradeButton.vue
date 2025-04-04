<script lang="ts" setup>

import { ref, type Ref } from "vue";

const props = withDefaults(defineProps<{
  visible?: boolean | (() => boolean);
  unlocked?: boolean | (() => boolean);
  buyable?: boolean | (() => boolean);
  fully_bought?: boolean | (() => boolean);
  buy: () => void;
  has_tooltip?: boolean | (() => boolean);
  width?: string;
  height?: string;
  extra_classes?: string | string[];
}>(), {
  visible: true,
  unlocked: true,
  buyable: true,
  fully_bought: false,
  has_tooltip: false,
});

let mouseHover: Ref<boolean> = ref(false);

function _visible(): boolean {
  return typeof props.visible === 'boolean' ? props.visible : props.visible();
}

function _unlocked(): boolean {
  return typeof props.unlocked === 'boolean' ? props.unlocked : props.unlocked();
}

function _buyable(): boolean {
  return typeof props.buyable === 'boolean' ? props.buyable : props.buyable();
}

function _fully_bought(): boolean {
  return typeof props.fully_bought === 'boolean' ? props.fully_bought : props.fully_bought();
}

function _has_tooltip(): boolean {
  return typeof props.has_tooltip === "boolean" ? props.has_tooltip : props.has_tooltip();
}

function state(): string {
  if (!_unlocked()) return 'not-unlocked';
  if (_fully_bought()) return 'fully-bought';
  if (_buyable()) return 'buyable';
  return 'not-buyable';
}

function style(): any {
  return {
    width: props.width,
    height: props.height,
  };
}
</script>

<template>
  <span class="tooltip-container">
    <button
        v-show="_visible()"
        :class="['upgrade-button', state(), extra_classes]"
        :disabled="state() !== 'buyable'"
        :style="style()"
        v-bind="$attrs"
        @click="buy()"
        @mouseenter="mouseHover = true"
        @mouseleave="mouseHover = false"
    >
      <slot name="text"/>
      <span v-if="_has_tooltip() && mouseHover" class="tooltip-top">
        <slot name="tooltip"/>
      </span>
    </button>
  </span>

</template>

<style scoped>

</style>