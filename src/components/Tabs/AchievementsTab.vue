<script lang="ts" setup>

interface AchievementInfo {
  name: string,
  description: string,
  reward?: string,
  current_reward?: () => string,
}

const Achievements: AchievementInfo[] = [
  {
    name: "最初的一步",
    description: "获得 1 个点数.",
  },
];

</script>

<template>
  <div>

  </div>
</template>

<style scoped>

</style>