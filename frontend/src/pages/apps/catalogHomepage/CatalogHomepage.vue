<script>
import { get, upperFirst, omit, isEmpty } from 'lodash'

import { getCatalogsAppFormAPI } from '@/api/catalog'
import { getLabelformat } from '@/utils/utils'

import AppIcon from '@/common/apps/AppIcon.vue'
import SystemAppsList from '@/pages/apps/catalogHomepage/SystemAppsList.vue'
import AppsList from '@/pages/apps/catalogHomepage/AppsList.vue'
import InstallList from '@/pages/apps/catalogHomepage/InstallList.vue'
import AppInstruction from '@/pages/apps/catalogHomepage/AppInstruction.vue'
import MarketInstallButton from '@/pages/apps/market/MarketInstallButton.vue'

import { useCatalogManageStore } from '@/stores/modules/catalogManage'
const catalogManageStore = useCatalogManageStore()

export default {
  name: 'catalog-homepage',
  data () {
    return {
      activeTab: 'homepage',
      refreshFlag: Date.now(),
      catalogFormInfo: {} // 当前系统下某个应用的类型、描述、说明等信息
    }
  },
  computed: {
    catalogTypesData () {
      return catalogManageStore.catalogTypesData
    },
    name () {
      return get(this.$route, 'params.name') || get(this.$route, 'query.catalogName')
    },
    showName () {
      let ret = ''
      const { name } = this
      if (name) {
        ret = this.$te(`menu.${name}`) ? this.$t(`menu.${name}`) : upperFirst(this.name)
      }
      return ret
    },
    sub () {
      return get(this.$route, 'query.sub')
    },
    isCatalogLevel () {
      // 判断当前是展示catalog主页，还是catalog下某个应用的主页
      return !!(this.name && !this.sub)
    },
    breadCrumb () {
      return [
        {
          text: this.showName
        },
        {
          text: this.sub
        }
      ]
    },
    catalogMap () {
      const { name, sub } = this
      return {
        system: {
          tabs: [
            {
              name: 'homepage',
              components: [
                {
                  name: 'SystemAppsList',
                  component: SystemAppsList,
                  componentTitle: this.$t('applications.app'),
                  options: {
                    name
                  },
                  isTable: true
                },
                {
                  name: 'InstallList',
                  component: InstallList,
                  componentTitle: this.$t('applications.containerRunningNum'),
                  options: {
                    name,
                    catalog: name
                  },
                  isTable: true,
                  showRefresh: true
                }
              ]
            },
            {
              name: 'instructions',
              components: [
                {
                  name: 'appInstruction',
                  component: AppInstruction,
                  options: {
                    catalog: name
                  }
                }
              ]
            }
          ]
        },
        apps: {
          tabs: [
            {
              name: 'homepage',
              components: [
                {
                  name: 'AppsList',
                  component: AppsList,
                  isTable: true,
                  componentTitle: this.$t('applications.appMode'),
                  options: {
                    catalog: name,
                    form: sub
                  }
                },
                {
                  name: 'InstallList',
                  component: InstallList,
                  componentTitle: this.$t('applications.containerRunningNum'),
                  options: {
                    name,
                    catalog: name,
                    form: sub
                  },
                  isTable: true,
                  showRefresh: true
                }
              ]
            },
            {
              name: 'operationAndMaintenanceGuide',
              components: [{
                name: 'appInstruction',
                component: AppInstruction,
                options: {
                  catalog: name,
                  form: sub
                }
              }]
            }
          ]
        }
      }
    },
    currentCatalogObj () {
      const { catalogMap, isCatalogLevel } = this
      const name = isCatalogLevel ? 'system' : 'apps'
      return catalogMap[name] || {}
    },
    tabs () {
      const { currentCatalogObj } = this
      return get(currentCatalogObj, 'tabs') || []
    },
    currentComponents () {
      const { tabs, activeTab } = this
      return get(tabs.find(item => item.name === activeTab), 'components') || []
    },
    catalogInfo () {
      const { name, catalogTypesData } = this
      const ret = catalogTypesData.length && catalogTypesData.find(item => item.name.toLowerCase() === name)
      const showCategory = get(ret, 'category', '').split('/').pop()
      return {
        ...ret,
        showCategory
      }
    }
  },
  methods: {
    get,
    getLabelformat,
    getTabText (item) {
      const pre = this.isCatalogLevel ? this.$t('common.system') : this.$t('applications.app')
      return `${pre}${this.$t(`catalogs.${item}`)}`
    },
    goHome () {
      const { name, params, query } = this.$route
      this.$router.push({
        name,
        params,
        query: {
          ...omit(query, 'sub')
        }
      })
    },
    getCatalogFormInfo () {
      const self = this

      const { sub: form, name: catalog } = self

      if (!catalog || !form) return

      self.catalogFormInfo = {}
      getCatalogsAppFormAPI({ catalog, form }).then(rsp => {
        self.catalogFormInfo = rsp.data || {}
      })
    },
    getComponentCls (item) {
      return {
        'bg-transparent': this.activeTab === 'installation',
        'h-full': item.name === 'appInstruction'
      }
    },
    refresh () {
      this.refreshFlag = Date.now()
    }
  },
  mounted () {
    if (isEmpty(this.catalogTypesData)) {
      catalogManageStore.setCatalogTypes()
    }
  },
  components: {
    AppIcon,
    MarketInstallButton
  },
  watch: {
    sub (val) {
      this.activeTab = 'homepage'
      this.refreshFlag = Date.now()
    },
    name (val) {
      this.activeTab = 'homepage'
      this.refreshFlag = Date.now()
    },
    isCatalogLevel: {
      immediate: true,
      handler (val) {
        if (!val) this.getCatalogFormInfo()
      }
    }
  }
}
</script>

<template lang="pug">
.catalog-homepage(v-if="name")
  .catalog-homepage-header.px-3
    .flex.mb-2.items-center(v-if="isCatalogLevel")
      .img-box.flex.justify-between.items-center.mr-2
        AppIcon(:key="name", :name="name")
      .info-box
        .flex.items-center
          span.font-twenty-eight.mr-3.header-bold-font.title {{ showName }}
          el-tag(v-if="catalogInfo.showCategory", type="warning") {{ catalogInfo.showCategory }}
        .d-block.text-gray.font-thirteen {{ catalogInfo.description }}
    .catalog-app-header(v-else)
      .d-block
        span.hover-primary(@click="goHome") {{ showName }}
        span.mr-2.ml-2 /
        span {{ sub }}
      .flex.items-center.mt-1.justify-between
        .flex.items-center
          i.remix.ri-arrow-left-line.cursor-pointer.font-twenty.header-bold-font.mr-2(@click="goHome")
          span.font-twenty.header-bold-font.mr-2 {{ sub }}
          el-tag.mr-2.tag-info(v-if="catalogFormInfo.version") {{ $t('common.version') }}{{ catalogFormInfo.version }}
        .flex.items-center
          MarketInstallButton.ml-2(
            v-if="!catalogFormInfo.invisible",
            :data="{ catalog: name, form: sub }",
            btnType="primary",
            @refresh="refresh"
          )
      .d-block.text-gray.font-thirteen.mt-1 {{ catalogFormInfo.description }}
    el-tabs(v-model="activeTab")
      el-tab-pane(
        v-for="item in tabs",
        :key="`${item.name}`",
        :label="getTabText(item.name)",
        :name="item.name"
      )
  .catalog-container.bg-gray.p-3(:class="isCatalogLevel ? '' : 'app-container'")
    .catalog-component(
      v-for="item in currentComponents",
      :key="item.name",
      :class="getComponentCls(item)"
    )
      .flex.justify-between.items-center(:class="{ 'mb-2': item.componentTitle }")
        .component-title.text-high(v-if="item.componentTitle") {{ item.componentTitle }}
        el-button.operate-btn.px-2(v-if="item.showRefresh", type="default", @click="refresh")
          i.remix.mr-0.ri-refresh-line
      component(
        :is="item.component",
        :key="`${item.name}${name}${sub}`",
        v-bind="item.options",
        :refreshFlag="refreshFlag",
        @refresh="refresh",
        :class="item.isTable ? 'has-border-table' : 'border-0'"
      )
</template>
<style lang="scss">
@import '@/assets/root.scss';

.catalog-homepage {
  margin: 0 -1rem;
  .catalog-homepage-header {
    margin-top: -15px;
    padding-top: 15px;
    background-color: #fff;
    .img-box {
      width: 80px;
      height: 80px;
    }
    .font-thirteen {
      font-size: 13px;
    }
    .font-twenty {
      font-size: 20px;
    }
    .font-twenty-eight {
      font-size: 28px;
    }
    .header-bold-font {
      font-weight: 500;
    }

    .el-tabs__header {
      margin: 0;
      .el-tabs__active-bar {
        height: 2px;
      }
    }
    .title {
      color: $font_high;
    }
    .tag-info {
      border: 1px solid $outline;
      color: $font;
    }
  }

  .catalog-container {
    height: calc(100vh - 234px);
    overflow-y: auto;
    &.app-container {
      height: calc(100vh - 224px);
    }
    .catalog-component {
      .component-title {
        font-size: 16px;
        font-weight: 500;
      }
      .application-load-balancer-list-container {
        margin-top: 0 !important;
        .table-box {
          border-top: 0;
        }
      }
      &:not(:last-child) {
        margin-bottom: 1rem;
      }
    }
  }
}
</style>
