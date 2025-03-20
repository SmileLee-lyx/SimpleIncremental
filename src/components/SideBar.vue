<script lang="ts" setup>
import { type TabConfig, type TabGroupConfig, TabGroupId, TabId } from "@/core/typing.ts";
import { keys } from "lodash";
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
  let result: SideBarConfig = []
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
    if (element.visible === undefined || element.visible()) {
      let groupId = element.groupId;
      resultDict[groupId].tabs.push({
        tabId: tabId,
        tabName: element.sideBarName,
      })
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
    visible: () => game.show_cheat,
  }
}

let tabGroups: Record<TabGroupId, TabGroupConfig> = {
  [TabGroupId.A]: {
    sideBarName: "A",
  },
  [TabGroupId.SETTINGS]: {
    sideBarName: "设置",
  },
  [TabGroupId.CHEAT]: {
    sideBarName: "作弊",
  }
}

let config: ComputedRef<SideBarConfig> = computed(() => makeConfig(tabs, tabGroups));

function switchGroup(group: TabGroupId) {

}

function switchTab(tab: TabId) {
  game.current_tab = tab;
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
        <span class="sidebar-button-text">{{group.groupName}}</span>
      </button>
      <transition name="fade">
      <div
        v-if="subMenuGroup === group.groupId"
        class="sidebar-sub-menu"
      >
        <button v-for="tab of group.tabs"
          @click="switchTab(tab.tabId)"
          @mouseenter="mouseEnterTab(tab.tabId)"
          @mouseleave="mouseLeaveTab(tab.tabId)"
          class="sidebar-sub-menu-button"
        >
          <span class="sidebar-sub-menu-button-text">{{tab.tabName}}</span>
        </button>
      </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
</style>