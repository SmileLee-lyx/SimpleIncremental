<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  modelValue: string | number;
  values: (string | number)[];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: number | string): void;
}>();

const selectedValue = ref(props.modelValue);

const isDropdownOpen = ref(false);

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function selectOption(option: string | number) {
  selectedValue.value = option;
  emit('update:modelValue', option);
  isDropdownOpen.value = false;
}

</script>
<template>
  <div ref="selectContainer" class="custom-select" v-bind="$attrs">
    <!-- 按钮 -->
    <button class="select-button" @click="toggleDropdown">
      <slot name="selection"></slot>
    </button>

    <div v-if="isDropdownOpen" class="dropdown-menu">
      <div
          v-for="value in values"
          :key="value"
          class="dropdown-item"
          @click="selectOption(value)"
      >
        <slot :value="value" name="option"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>