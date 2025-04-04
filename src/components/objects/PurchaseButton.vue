<script lang="ts" setup>
import { computed, type ComputedRef, ref, type Ref } from "vue";

const props = withDefaults(defineProps<{
  visible?: boolean | (() => boolean);
  unlocked?: boolean | (() => boolean);
  total_amount: number | (() => number);
  already_bought: () => number;
  buyable_amount: () => number;
  fully_bought?: boolean | (() => boolean);
  buy: () => void;
  has_tooltip?: boolean | (() => boolean);
  extra_classes?: string | string[]
}>(), {
  visible: true,
  unlocked: true,
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
  return props.buyable_amount() !== 0;
}

function _fully_bought(): boolean {
  return typeof props.fully_bought === 'boolean' ? props.fully_bought : props.fully_bought();
}

function state(): string {
  if (!_unlocked()) return 'not-unlocked';
  if (_fully_bought()) return 'fully-bought';
  if (_buyable()) return 'buyable';
  return 'not-buyable';
}

function _has_tooltip(): boolean {
  return typeof props.has_tooltip === "boolean" ? props.has_tooltip : props.has_tooltip();
}

function _total_amount(): number {
  return typeof props.total_amount === "number" ? props.total_amount : props.total_amount();
}

let background: ComputedRef<any> = computed(() => {
  let green_percentage = Math.floor(props.already_bought() / _total_amount() * 100);
  let lightgreen_percentage = Math.floor((props.already_bought() + props.buyable_amount()) / _total_amount() * 100);
  return {
    ["--p1"]: `${ green_percentage }%`,
    ["--p2"]: `${ lightgreen_percentage }%`,
  };
});
</script>

<template>
  <span class="tooltip-container">
    <button
        v-show="_visible()"
        :class="['purchase-button', state(), extra_classes]"
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