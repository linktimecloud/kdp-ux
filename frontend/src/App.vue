<script setup>
import { RouterView } from 'vue-router'
import { onMounted, computed, watch } from 'vue'
import { get } from 'lodash'

import NavBar from '@/components/navbar/NavBar.vue'
import SideBar from '@/components/sidebar/SideBar.vue'
import WebTerminalContent from '@/components/terminal/WebTerminalContent.vue'

import { useGlobalStore } from '@/stores/modules/global'
import { useBdcStore } from '@/stores/modules/bdc'
import { useTerminalStore } from '@/stores/modules/terminal'
import { useRoute } from 'vue-router'

const route = useRoute()
const globalStore = useGlobalStore()
const bdcStore = useBdcStore()
const terminalStore = useTerminalStore()

const showTerminal = computed(() => {
  return get(terminalStore.getTerminalProperty, 'showTerminal')
})
const hiddenIframe = computed(() => {
  return get(terminalStore.getTerminalProperty, 'hiddenIframe')
})
const layoutCollapse = computed(() => globalStore.layoutCollapse)
const cls = computed(() => {
  return {
    'layout-collapse': layoutCollapse.value
  }
})

onMounted(() => {
  globalStore.setCurrentUser()
  bdcStore.setCurrentBdc()
  terminalStore.setTerminalProperty('showTerminal',  false)
})
</script>

<template lang="pug">
.app.w-full
  header.app-header
    NavBar
  main.main-container.w-full(:class="cls")
    SideBar.app-sidebar
    .main-in(:class="{ 'is-padding-0': showTerminal }")
      RouterView(:class="{ 'main-top-box': showTerminal }")
      WebTerminalContent.main-bottom-box(v-if="showTerminal", :class="{ 'hidden-iframe': hiddenIframe }")
</template>

<style lang="scss">
@import '@/assets/root.scss';

$collapseSidebarWidth: 55px;
$expandSidebarWidth: 200px;
$navbarHeight: 60px;

.app-header {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  color: #fff;
  height: $navbarHeight;
  z-index: 1000;
  background: linear-gradient(90deg, #4353A4 0%, #416AFF 100%);
}


.main-container {
  margin-top: $navbarHeight;
  .app-sidebar {
    width: $expandSidebarWidth;
    height: calc(100vh - #{$navbarHeight});
    position: fixed;
    top: $navbarHeight;
    bottom: 0;
    left: 0;
    z-index: 11;
    overflow: hidden;
  }
  .main-in {
    margin-left: $expandSidebarWidth;
    padding: 1rem;
    background: $bg_gray_G1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px);
    &.is-padding-0 {
      padding: 0;
    }
    .main-top-box {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    .main-bottom-box {
      height: 60%;
    }
    .hidden-iframe {
      height: 45px !important;
    }
  }

  &.layout-collapse {
    .app-sidebar {
      width: $collapseSidebarWidth;
    }
    .main-in {
      margin-left: $collapseSidebarWidth;
    }
  }
}



@media (max-width: 1024px) {
  .app-header {
    position: relative;
  }
}
</style>
