import { ref, type Ref } from "vue";

export const versions: Ref<Record<string, { name: string, path: string }>> = ref({});

fetch('./versions.json')
    .then((response) => response.json())
    .then((data) => {
        versions.value = data;
    })
    .catch((error) => {
        console.error('读取版本文件失败:', error);
    });