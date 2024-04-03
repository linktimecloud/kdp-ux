<script>
import { mapGetters } from 'vuex'

import NavBar from '@/common/navbar'
import SideBar from '@/common/sidebar'
import EmptyHolder from '@/components/empty'

export default {
  name: 'layout',
  props: {
    type: {
      type: String,
      required: true
    },
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters([
      'isAdmin',
      'isRoot',
      'currentUser'
    ]),
    cls () {
      const collapse = this.collapse
      const type = this.type
      const ret = [`layout-${type}`]
      if (collapse) {
        ret.push('layout-collapse')
      }
      return ret
    },
    isPanel () {
      return this.type === 'panel'
    },
    isValidUser () {
      const { isAdmin, isRoot, currentUser } = this
      return isAdmin || isRoot || (currentUser?.groups || []).find(item => item.type === 'organization')
    }
  },
  components: {
    NavBar,
    SideBar,
    EmptyHolder
  }
}
</script>

<template lang="pug">
.layout(
  :class="cls"
)
  NavBar
  .main-container.w-100(v-if="isValidUser")
    SideBar(v-if="isPanel")
    .main
      .main-in
        slot
  .no-valid-container(v-else)
    EmptyHolder.w-100(:height="300")
      span.text-gray.mt-2 {{ $t('error.noOrgTips') }}
</template>

<style lang="scss">
$collapseSidebarWidth: 55px;
$expandSidebarWidth: 200px;

@import '~@/root.scss';

.navbar {
  width: 100%;
  min-width: 740px;
}

.main-in {
  padding: 1rem;
  overflow: auto;
  height: calc(100vh - 65px);
}

.layout-panel {
  display: flex;
  .sidebar {
    width: $expandSidebarWidth;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 11;
    overflow: {
      y: hidden;
      x: hidden;
    }

    position: fixed;
    height: 100vh;
  }
  .main {
    flex: 1;
    overflow: hidden;
    min-height: 100vh;
    margin-left: $expandSidebarWidth;
    padding-top: 65px;
    background: $bg_gray_G1;
  }
}

.layout-collapse {
  .sidebar {
    width: $collapseSidebarWidth;
  }
  .main {
    margin-left: $collapseSidebarWidth;
  }
}

.layout-plain {
  .main {
    flex: 1;
    overflow: hidden;
    min-height: calc(100vh - 65px);
    padding-top: 65px;
  }
}
</style>
