<script setup>
import { ref, computed, watch } from 'vue'
import { get, map, omitBy } from 'lodash'
import i18n from '@/i18n'

import AppConfigInfo from '@/common/apps/AppConfigInfo.vue'
import ApplicationsContextSettings from './ContextSettings.vue'
import PageHeader from '@/components/header/PageHeader.vue'
import CommonTips from '@/common/TipsIcon.vue'
import InstanceList from '@/pages/apps/applications/list/ApplicationList.vue'
import EmptyHolder from '@/components/empty/EmptyHolder.vue'

import { getBdcAPI } from '@/api/bdc'
import { useGlobalStore } from '@/stores/modules/global'
import { useBdcStore } from '@/stores/modules/bdc'
const globalStore = useGlobalStore()
const bdcStore = useBdcStore()


const activeTab = ref('applications')
const processing = ref(false)
const data = ref({})
const refreshFlag = ref(Date.now())

const userOrgName = computed(() => {
  return globalStore.userOrgName
})
const currentBdcName = computed(() => {
  return bdcStore.currentBdcName
})
const bigDataClusterBasicData = computed(() => {
  return {
    ...data.value,
    labels: get(data, 'value.showLabels')
  }
})
const title = computed(() => {
  return `${i18n.t('menu.bigDataCluster')}: ${currentBdcName.value}`
})
const tabs = computed(() => {
  const org = userOrgName.value
  const bdc = currentBdcName.value

  return [
    {
      name: 'applications',
      label: i18n.t('applications.instance'),
      component: InstanceList,
      options: {
        propsFilter: {
          org,
          bdc
        }
      }
    },
    {
      name: 'applicationSetting',
      label: i18n.t('applications.applicationUsedSettings'),
      tip: 'APPLICATIONS_USED_SETTINGS',
      component: ApplicationsContextSettings,
      options: {
        propsFilter: {
          bdc
        },
        type: 'applicationSetting'
      }
    },
    {
      name: 'applicationSecret',
      label: `${i18n.t('applications.applicationSecret')}${i18n.t('menu.manage')}`,
      component: ApplicationsContextSettings,
      options: {
        propsFilter: {
          bdc
        },
        type: 'applicationSecret'
      }
    }
  ]
})
const currentComponent = computed(() => {
  return tabs.value.find(item => item.name === activeTab.value)
})

const getDBC = async () => {

  const bdcName = currentBdcName.value

  processing.value = true
  await getBdcAPI({ bdcName }).then((rsp) => {
    const item = get(rsp, 'data') || {}
    data.value = {
      ...item,
      org: get(item, 'orgName'),
      namespace: get(item, 'defaultNS'),
      status: item.status || 'InActive',
      labels: map(item?.labels, (value, key) => ({ key, value })),
      showLabels: omitBy(item?.labels, (value, key) => key === 'bdc.bdos.io/org')
    }
  })
  processing.value = false
}

const refresh = () => {
  getDBC()
  refreshFlag.value = Date.now()
}

watch(() => currentBdcName, (val) => {
  if (val) {
    getDBC()
  }
}, { immediate: true })
</script>

<template lang="pug">
.big-data-cluster-info-detail.px-3
  PageHeader(:data="{ content: title }")
    .action-btn.flex
      el-button.mr-2(
        type="default"
        @click="refresh"
      )
        i.remix.ri-refresh-line.mr-0
    template(#nextRow)
      AppConfigInfo.mt-3(:data="bigDataClusterBasicData", type="bigDataCluster")
      el-tabs(v-model="activeTab")
        el-tab-pane(
          v-for="item in tabs",
          :key="item.name",
          :name="item.name"
        )
          template.flex(#label)
            span {{ item.label }}
            CommonTips.ml-1(
              v-if="item.tip",
              :name="item.tip"
            )
  .detail-container.px-3.pb-3
    component(
      v-if="currentBdcName",
      :is="currentComponent.component",
      :key="activeTab",
      :refreshFlag="refreshFlag",
      v-bind="currentComponent.options",
      :type="activeTab"
    )
    EmptyHolder(
      v-else
    )
</template>

<style lang="scss">
.big-data-cluster-info-detail {
  margin: 0 -15px;
  .page-header-container {
    padding-bottom: 0 !important;
  }
  .el-tabs__header {
    margin: 0;
    .el-tabs__active-bar {
      height: 2px;
    }
    .el-tabs__nav-wrap::after {
      height: 0;
    }
  }
  .detail-container {
    height: calc(100vh - 242px);
    overflow-y: auto;
    margin: 0 -15px;
  }
}
</style>
