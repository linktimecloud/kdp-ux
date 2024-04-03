<script setup>
import { ref, computed } from 'vue'
import { useGlobalStore } from '@/stores/modules/global'

import MenuList from './MenuList.vue'

const globalStore = useGlobalStore()
const layoutCollapse = computed(() => globalStore.layoutCollapse)

const q = ref('')

const toggleCollapse = () => {
  globalStore.toggleLayoutCollapse(!layoutCollapse.value)
}

</script>

<template lang="pug">
.sidebar
  el-input.sidebar-filter.mb-1(
    v-if="!layoutCollapse",
    v-model="q",
    clearable,
    :placeholder="$t('common.searchMenu')"
  )
    template(#prefix)
      i.ri-search-line
  MenuList.sidebar-menu-box(
    :q="q",
    :collapse="layoutCollapse"
  )
  .footer-box.w-full
    .collapse-btn.text-center.cursor-pointer(
      class="hover:text-primary",
      @click="toggleCollapse"
    )
      i(:class="layoutCollapse ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'")
      span.ml-1(v-if="!layoutCollapse") {{ $t('common.collapseSidebar') }}
</template>

<style lang="scss">
.sidebar {
  padding: 6px 0 56px 0;
  border-right: 1px solid #dbdde9;
  position: relative;

  .el-input.sidebar-filter {
    .el-input__wrapper {
      box-shadow: none;
    }
    .el-input__prefix i {
      font-size: 18px;
    }
  }

  .footer-box {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 56px;
    line-height: 56px;
    border-top: 1px solid #dbdde9;
  }
}
</style>