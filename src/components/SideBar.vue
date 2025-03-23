<script lang="ts" setup>
import { type TabConfig, type TabGroupConfig, TabGroupId, TabId } from "@/core/typing.ts";
import { computed, type ComputedRef, ref, type Ref } from "vue";

let game = window.game;
let player = window.player;

type SideBarConfig = {
  groupId: TabGroupId;
  groupName: string;
  tabs: {
    tabId: TabId,
    tabName: string;
  }[]
}[]

function makeConfig(tabConfig: Record<TabId, TabConfig>, tabGroupConfig: Record<TabGroupId, TabGroupConfig>): SideBarConfig {
  let resultDict: any = {};
  let result: SideBarConfig = [];
  for (let tabGroupId of Object.values(TabGroupId).filter((k) => typeof k === "number")) {
    let element = tabGroupConfig[tabGroupId];
    let groupResult = {
      groupId: tabGroupId,
      groupName: element.sideBarName,
      tabs: [],
    };
    result.push(groupResult);
    resultDict[tabGroupId] = groupResult;
  }
  for (let tabId of Object.values(TabId).filter((k) => typeof k === "number")) {
    let element = tabConfig[tabId];
    if (player.progress.unlocked_tabs.includes(tabId)) {
      let groupId = element.groupId;
      resultDict[groupId].tabs.push({
        tabId: tabId,
        tabName: element.sideBarName,
      });
    }
  }
  return result.filter((group) => group.tabs.length > 0);
}

let tabs: Record<TabId, TabConfig> = {
  [TabId.A]: {
    sideBarName: "A",
    groupId: TabGroupId.A,
  },
  [TabId.A_UPGRADES]: {
    sideBarName: "A升级",
    groupId: TabGroupId.A,
  },
  [TabId.SETTINGS]: {
    sideBarName: "设置",
    groupId: TabGroupId.SETTINGS,
  },
  [TabId.CHEAT]: {
    sideBarName: "作弊",
    groupId: TabGroupId.CHEAT,
  },
};

let tabGroups: Record<TabGroupId, TabGroupConfig> = {
  [TabGroupId.A]: {
    sideBarName: "A",
  },
  [TabGroupId.SETTINGS]: {
    sideBarName: "设置",
  },
  [TabGroupId.CHEAT]: {
    sideBarName: "作弊",
  },
};

let config: ComputedRef<SideBarConfig> = computed(() => makeConfig(tabs, tabGroups));

function switchGroup(group: TabGroupId) {
  let current_tab = game.current_tab;
  let current_group = tabs[current_tab].groupId;
  if (current_group !== group) {
    let target_tab = game.group_tabs[group];
    if (target_tab !== undefined) {
      switchTab(target_tab);
      return;
    } else {
      let group_cfg = config.value.find((c) => c.groupId === group);
      if (group_cfg === undefined) return;
      if (group_cfg.tabs.length === 0) return;
      switchTab(group_cfg.tabs[0].tabId);
      return;
    }
  } else {
    let group_cfg = config.value.find((c) => c.groupId === group);
    if (group_cfg === undefined) return;
    if (group_cfg.tabs.length === 0) return;
    let idx = group_cfg.tabs.findIndex((c) => c.tabId === current_tab);
    if (idx === -1) {
      switchTab(group_cfg.tabs[0].tabId);
    } else {
      switchTab(group_cfg.tabs[(idx + 1) % group_cfg.tabs.length].tabId);
    }
  }
}

function switchTab(tab: TabId) {
  game.current_tab = tab;
  game.group_tabs[tabs[tab].groupId] = tab;
  game.alert_tabs.delete(tab);
}

let hoveredGroup: Ref<TabGroupId | null> = ref(null);
let hoveredTab: Ref<TabId | null> = ref(null);
let subMenuGroup: Ref<TabGroupId | null> = ref(null);
let leaveTimeout: NodeJS.Timeout | undefined;

function mouseEnterGroup(groupId: TabGroupId) {
  hoveredGroup.value = groupId;
  hoveredTab.value = null;
  subMenuGroup.value = groupId;
  clearTimeout(leaveTimeout);
  leaveTimeout = undefined;
}

function mouseEnterTab(tabId: TabId) {
  hoveredGroup.value = tabs[tabId].groupId;
  hoveredTab.value = tabId;
  subMenuGroup.value = tabs[tabId].groupId;
  clearTimeout(leaveTimeout);
  leaveTimeout = undefined;
}

function mouseLeaveGroup(groupId: TabGroupId) {
  if (hoveredGroup.value === groupId && hoveredTab.value === null) {
    hoveredGroup.value = null;
    leaveTimeout = setTimeout(() => { subMenuGroup.value = null; }, 300);
  }
}

function mouseLeaveTab(tabId: TabId) {
  if (hoveredGroup.value === tabs[tabId].groupId && hoveredTab.value === tabId) {
    hoveredGroup.value = null;
    hoveredTab.value = null;
    leaveTimeout = setTimeout(() => { subMenuGroup.value = null; }, 300);
  }
}
</script>

<template>
  <div class="sidebar">
    <div
        class="sidebar-header"
    >
      <span class="sidebar-header-text">
        菜单
      </span>
    </div>
    <div
        v-for="group of config"
        class="sidebar-element"
    >
      <button
          class="sidebar-button"
          @click="switchGroup(group.groupId)"
          @mouseenter="mouseEnterGroup(group.groupId)"
          @mouseleave="mouseLeaveGroup(group.groupId)"
      >
        <span class="sidebar-button-text">{{ group.groupName }}</span>
        <span v-if="tabs[game.current_tab].groupId == group.groupId" class="chosen-button-left"></span>
      </button>
      <div v-if="group.tabs.some((tab) => game.alert_tabs.has(tab.tabId))" class="sidebar-alert"/>
      <transition name="fade">
        <div
            v-if="subMenuGroup === group.groupId"
            class="sidebar-sub-menu"
        >
          <div v-for="tab of group.tabs" class="sidebar-sub-menu-element">
            <button
                class="sidebar-sub-menu-button"
                @click="switchTab(tab.tabId)"
                @mouseenter="mouseEnterTab(tab.tabId)"
                @mouseleave="mouseLeaveTab(tab.tabId)"
            >
              <span class="sidebar-sub-menu-button-text">{{ tab.tabName }}</span>
              <span v-if="game.current_tab == tab.tabId" class="chosen-button-top"></span>
            </button>
            <div v-if="game.alert_tabs.has(tab.tabId)" class="sidebar-alert"/>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
</style>