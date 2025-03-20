<script lang="ts" setup>
import { computed, type ComputedRef, ref, type Ref } from "vue";

const props = defineProps<{
  visible?: () => boolean;
  buyable?: () => boolean;
  fully_bought?: () => boolean;
  buy: () => void;
  has_tooltip?: boolean | (() => boolean);
}>();

let mouseHover: Ref<boolean> = ref(false);

function _visible(): boolean {
  return props.visible === undefined || props.visible();
}

function _buyable(): boolean {
  return props.buyable === undefined || props.buyable();
}

function _fully_bought(): boolean {
  return props.fully_bought !== undefined && props.fully_bought();
}

function _has_tooltip(): boolean {
  return props.has_tooltip !== undefined && (
      typeof props.has_tooltip === "boolean" ? props.has_tooltip :
          props.has_tooltip());
}
</script>

<template>
  <span class="tooltip-container">
    <button
        v-show="_visible()"
        :class="[{
          'buyable': _buyable(),
          'fully-bought': _fully_bought(),
        }, 'upgrade-button']"
        :disabled="!_buyable() || _fully_bought()"
        @click="buy()"
        @mouseenter="mouseHover = true"
        @mouseleave="mouseHover = false">
      <slot name="text"/>
      <span v-if="_has_tooltip() && mouseHover" class="tooltip-top">
        <slot name="tooltip"/>
      </span>
    </button>
  </span>

</template>

<style scoped>

</style>