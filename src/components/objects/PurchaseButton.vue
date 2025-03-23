<script lang="ts" setup>
import { computed, type ComputedRef, ref, type Ref } from "vue";

const props = defineProps<{
  visible?: () => boolean;
  total_amount: number | (() => number);
  already_bought: () => number;
  buyable_amount: () => number;
  fully_bought?: () => boolean;
  buy: () => void;
  has_tooltip?: boolean | (() => boolean);
}>();

let mouseHover: Ref<boolean> = ref(false);

function _visible(): boolean {
  return props.visible === undefined || props.visible();
}

function _buyable(): boolean {
  return props.buyable_amount() !== 0;
}

function _fully_bought(): boolean {
  return props.fully_bought !== undefined && props.fully_bought();
}

function _has_tooltip(): boolean {
  return props.has_tooltip !== undefined && (
      typeof props.has_tooltip === "boolean" ? props.has_tooltip :
          props.has_tooltip());
}

function _total_amount(): number {
  return typeof props.total_amount === "number" ? props.total_amount : props.total_amount();
}

let background: ComputedRef<any> = computed(() => {
  let green_percentage = Math.floor(props.already_bought() / _total_amount() * 100);
  let lightgreen_percentage = Math.floor((props.already_bought() + props.buyable_amount()) / _total_amount() * 100);
  return {
    background: `linear-gradient(to right, #4c4 ${ green_percentage }%, lightgreen ${ green_percentage }%, lightgreen ${ lightgreen_percentage }%, white ${ lightgreen_percentage }%)`,
  };
});
</script>

<template>
  <span class="tooltip-container">
    <button
        v-show="_visible()"
        :class="[{
          'buyable': _buyable(),
          'fully-bought': _fully_bought(),
        }, 'purchase-button']"
        :disabled="!_buyable() || _fully_bought()"
        :style="background"
        v-bind="$attrs"
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

<style lang="scss" scoped>
@use '@/assets/tooltip.scss';
</style>