<script lang="ts" setup>
import { format, type FormattedText } from "@/util/format.ts";
import Decimal from "break_eternity.js";
import { h, type VNode } from "vue";

let props = defineProps<{
  text: FormattedText,
}>();

function parseText_impl(text: FormattedText): (VNode | string)[] {
  if (text === null) return [];
  if (typeof text === "string") return [text];
  if (typeof text === "number") return [text.toString()];
  if (Array.isArray(text)) return text.flatMap(parseText_impl);
  if (text instanceof Decimal) return [h('span', { class: 'decimal' }, format(text))];
  if (text.type === 'br') return [h('br')];
  return [h(text.type, { class: text.class }, parseText_impl(text.text))];
}

function parseText(text: FormattedText): VNode {
  return h('span', {}, parseText_impl(text));
}
</script>

<template>
  <Component :is="parseText(text)" v-bind="$attrs"></Component>
</template>

<style scoped>

</style>