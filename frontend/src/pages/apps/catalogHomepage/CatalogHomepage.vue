<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { get, upperFirst, omit, isEmpty } from 'lodash'
import i18n from '@/i18n'

import { getCatalogsAppFormAPI } from '@/api/catalog'
import { CATALOG_COMPONENTS_MAP } from './constant'

import AppIcon from '@/common/apps/AppIcon.vue'
import MarketInstallButton from '@/pages/apps/market/MarketInstallButton.vue'

import { useRoute, useRouter } from 'vue-router'
import { useCatalogManageStore } from '@/stores/modules/catalogManage'
const catalogManageStore = useCatalogManageStore()
const route = useRoute()
const router = useRouter()

const activeTab = ref('homepage')
const refreshFlag = ref(Date.now())
const catalogFormInfo = ref({}) // 当前系统下某个应用的类型、描述、说明等信息

const catalogTypesData = computed(() => {
  return catalogManageStore.catalogTypesData
})
const name = computed(() => {
  return get(route, 'params.name') || get(route, 'query.catalogName')
})
const showName = computed(() =>{
  let ret = ''
  if (name.value) {
    ret = i18n.te(`menu.${name.value}`) ? i18n.t(`menu.${name.value}`) : upperFirst(name.value)
  }
  return ret
})
const sub = computed(() => {
  return get(route, 'query.sub')
})
const isCatalogLevel = computed(() => {
  // 判断当前是展示catalog主页，还是catalog下某个应用的主页
  return !!(name.value && !sub.value)
})
const catalogComponentsMap = computed(() => {
  return CATALOG_COMPONENTS_MAP({ name: name.value, sub: sub.value })
})
const currentCatalogObj = computed(() => {
  const name = isCatalogLevel.value ? 'system' : 'apps'
  return get(catalogComponentsMap, `value.${name}`, {})
})
const tabs = computed(() => {
  return get(currentCatalogObj, 'value.tabs', [])
})
const currentComponents = computed(() => {
  return get(tabs.value.find(item => item.name === activeTab.value), 'components', [])
})
const catalogInfo = computed(() => {
  const ret = catalogTypesData.value.length && catalogTypesData.value.find(item => item.name.toLowerCase() === name.value)
  const showCategory = get(ret, 'category', '').split('/').pop()
  return {
    ...ret,
    showCategory
  }
})

const getTabText = (item) => {
  const pre = isCatalogLevel.value ? i18n.t('common.system') : i18n.t('applications.app')
  return `${pre}${i18n.t(`catalogs.${item}`)}`
}
const goHome = () => {
  const { name, params, query } = route
  router.push({
    name,
    params,
    query: {
      ...omit(query, 'sub')
    }
  })
}
const getCatalogFormInfo = () => {
  const catalog = name.value
  const form = sub.value
  if (!catalog || !form) return

  catalogFormInfo.value = {}
  getCatalogsAppFormAPI({ catalog, form }).then(rsp => {
    catalogFormInfo.value = rsp.data || {}
  })
}
const getComponentCls = (item) => {
  return {
    'bg-transparent': activeTab.value === 'installation',
    'h-full': item.name === 'appInstruction'
  }
}
const refresh = (changeTab = false) => {
  if (changeTab) {
    activeTab.value = 'homepage'
  }
  refreshFlag.value = Date.now()
}

onMounted(() => {
  if (isEmpty(catalogTypesData.value)) {
    catalogManageStore.setCatalogTypes()
  }
})

watch(() => sub.value, () => {
  refresh(true)
})
watch(() => name.value, () => {
  refresh(true)
})
watch(() => isCatalogLevel.value, (val) => {
  if (!val) getCatalogFormInfo()
}, { immediate: true })
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
            btn-type="primary",
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
        :refresh-flag="refreshFlag",
        :class="item.isTable ? 'has-border-table' : 'border-0'",
        @refresh="refresh"
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
