<script setup>
import { RouterView } from 'vue-router'
import { onMounted, computed } from 'vue'

import NavBar from '@/components/navbar/NavBar.vue'
import SideBar from '@/components/sidebar/SideBar.vue'
import { useGlobalStore } from '@/stores/modules/global'
import { useBdcStore } from '@/stores/modules/bdc'

const globalStore = useGlobalStore()
const bdcStore = useBdcStore()

const layoutCollapse = computed(() => globalStore.layoutCollapse)
const cls = computed(() => {
  return {
    'layout-collapse': layoutCollapse.value
  }
})

onMounted(() => {
  globalStore.setCurrentUser()
  bdcStore.setCurrentBdc()
})
</script>

<template lang="pug">
.w-full
  header.app-header
    NavBar
  main.main-container.w-full(:class="cls")
    SideBar.app-sidebar
    .main-in
      RouterView()
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
