<script lang="ts" setup>

const props = defineProps<{
  modelValue: string | number | boolean;
  values: (string | number | boolean)[];
  width?: string;
  height?: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | string | boolean): void;
}>();

function toggle_select() {
  let value = props.modelValue;
  let index = props.values.indexOf(value);
  if (props.values.length === 0) return;
  let new_value: string | number | boolean = props.values[(index + 1) % props.values.length];
  emit('update:modelValue', new_value);
}

function style(): any {
  return {
    width: props.width,
    height: props.height,
  };
}

</script>
<template>
  <div ref="selectContainer" class="custom-select">
    <button :style="style()" class="select-button" @click="toggle_select">
      <slot name="selection"></slot>
    </button>
  </div>
</template>

<style scoped>

</style>