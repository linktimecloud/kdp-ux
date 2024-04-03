<script>
import { mapGetters } from 'vuex'

import LoadingMask from '@/components/loading'
import LayoutWrapper from '@/layout'
import ErrorPage from '@/pages/error'

const PREFIX = 'app'

export default {
  name: 'app',
  computed: {
    ...mapGetters([
      'route',
      'lang',
      'layoutType',
      'layoutCollapse',
      'navbarType',
      'currentUser',
      'systemHealthy'
    ]),
    visible () {
      return this.currentUser
    },
    cls () {
      const manualShow = this.manualShow
      const manualLayout = this.manualLayout
      const navbarType = this.navbarType
      const layout = this.layoutType
      const layoutCollapse = this.layoutCollapse
      const r = this.route || {}
      const name = r.name
      const query = r.query
      const obj = Object.assign({
        layout,
        name
      }, query)
      const ret = Object.keys(obj).map(k => `${PREFIX}-${k}-${obj[k]}`)
      if (manualShow) {
        ret.push(`app-manual-layout-${manualLayout}`)
      }
      if (layoutCollapse && layout === 'panel') {
        ret.push('app-layout-panel-collapse')
      }
      if (this.navbarType) {
        ret.push(`navbar-${navbarType}`)
      }
      return ret
    },
    isEn () {
      return this.lang === 'en'
    }
  },
  components: {
    LayoutWrapper,
    LoadingMask,
    ErrorPage
  }
}
</script>

<template lang="pug">
#app(:class="[cls, isEn ? 'is-en' : '']")
  .app-root(v-if="visible")
    LayoutWrapper(:type="layoutType", :collapse="layoutCollapse")
      router-view
  ErrorPage(v-else-if="!systemHealthy")
  LoadingMask
</template>

<style lang="scss">
.app-manual-layout-bottom {
  .main-container > .layout {
    padding-bottom: 40vh;
    .sidebar {
      height: calc(60vh - 60px);
      min-height: calc(60vh - 60px);
    }
  }
}
#app {
  &.is-en {
    .el-button {
      font-size: 12px !important;
    }
    .el-table {
      font-size: 12px !important;
    }
  }
}
</style>
