<!-- SaveLoadModal.vue -->
<script lang="ts" setup>

import { ref, type Ref } from "vue";


const props = defineProps<{
  slots: string[]
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'action', mode: 'save' | 'load' | 'delete', target: string | null): void;
  (e: 'create'): void;
}>();

let chosen_slot: Ref<string | null> = ref(null);

</script>

<template>
  <div class="pad-container" @click="$emit('close')">
    <div class="pad-body" @click.stop>
      <div class="main-text large2"> 选择存档</div>

      <div class="slots-grid">
        <!-- 已有存档的槽位 -->
        <div
            v-for="item in slots"
            :key="item"
            :class="{'chosen-slot-card': chosen_slot === item }"
            class="slot-card"
            @click="() => { chosen_slot = item; }"
        >
          <div class="saved-slot">
            <div class="slot-header">
              <span class="slot-id">槽位 {{ item }}</span>
              <time class="slot-time">
              </time>
            </div>
          </div>
        </div>
        <div class="slot-card" @click="$emit('create')">
          <div class="empty-slot">
            + 新建存档
          </div>
        </div>
      </div>

      <div class="pad-actions">
        <button class="action-button" @click="$emit('action', 'load', chosen_slot)">读取</button>
        <button class="action-button" @click="$emit('action', 'save', chosen_slot)">保存</button>
        <button class="action-button" @click="$emit('action', 'delete', chosen_slot)">删除</button>
        <button class="action-button" @click="$emit('close')">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pad-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.pad-body {
  background: #fff;
  border-radius: 8px;
  border: 1px solid #000;
  padding: 20px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
  margin: 20px 0;
}

.slot-card {
  border: 2px solid #4a5568;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 120px;
}

.slot-card:hover {
  border-color: #63b3ed;
  transform: translateY(-2px);
}

.slot-card.chosen-slot-card {
  background: #eee;
}

.saved-slot {
  height: 100%;
}

.empty-slot {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  font-style: italic;
}

.slot-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9em;
}

.pad-actions {
  text-align: right;
  margin-top: 20px;
}

.action-button {
  border-radius: 16px;
  width: 50px;
  height: 30px;
  border: 4px solid #aaa;
  background-color: #fff;
}

.action-button:hover {
  background-color: #eee;
}
</style>