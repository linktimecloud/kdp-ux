<script setup>
import { get, orderBy, uniqBy } from 'lodash'
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import i18n from '@/i18n'

import UpdateConfigButton from '@/common/apps/Operate/UpdateConfigButton.vue'
import HomepageButton from '@/common/apps/AppHomepageBtn.vue'
import PageHeader from '@/components/header/PageHeader.vue'
import AppConfigInfo from '@/common/apps/AppConfigInfo.vue'
import PodList from '@/pages/apps/pods/list/PodList.vue'
import ResourcesTopology from '../resourcesTopology/ResourcesTopology.vue'
import UninstallButton from '@/common/apps/Operate/UninstallButton.vue'
import ResourceDashboard from './resourceDashboard.vue'

import { getAppAPI, getAppServiceEndpointsAPI } from '@/api/applications'
import { getCatalogsAppFormAPI } from '@/api/catalog'

const route = useRoute()
const router = useRouter()

const processing = ref(false)
const rendappsDetail = ref({})
const activeTab = ref('resourcesTopology')
const refreshFlag = ref(Date.now())
const grafanaUrl = ref('')
const appLinks = ref([])
const podNames = ref('')

const appName = computed(() => {
  return get(route, 'query.application')
})

const appBasicData = computed(() => {
  const data = rendappsDetail.value
  return {
    status: get(data, 'status.status') || 'notRunning',
    statusInfo: get(data, 'status') || {},
    updateTime: data.updateTime || data.createTime,
    bdc: get(data, 'bdc.name'),
    bdcStatus: get(data, 'bdc.status'),
    catalog: get(route, 'params.name'),
    appForm: data.appFormName,
    name: appName.value
  }
})

const tabs = computed(() => {
  return [
    {
      name: 'resourcesTopology',
      label: i18n.t('applications.resourcesTopology'),
      components: [
        {
          name: 'ResourcesTopology',
          component: ResourcesTopology,
          options: {
            refreshFlag: refreshFlag.value,
            appName: appName.value,
            appCatalog: get(route, 'params.name') || '',
            appBasicData: appBasicData.value
          },
          isTable: true
        }
      ]
    },
    {
      name: 'podApplication',
      label: i18n.t('menu.pods'),
      components: [
        {
          name: 'PodList',
          component: PodList,
          componentTitle: i18n.t('menu.pods'),
          options: {
            propsFilter: { group: get(route, 'query.group'), render: appName.value, bdc: get(route, 'query.bdc'), appForm: rendappsDetail.value.appFormName },
            refreshFlag: refreshFlag.value
          },
          isTable: true
        },
        {
          name: 'ResourceDashboard',
          component: ResourceDashboard,
          componentTitle: i18n.t('applications.runMetric'),
          options: {
            podNames: podNames.value,
            namespace: rendappsDetail.value.appRuntimeNs || ''
          }
        }
      ]
    }
  ]
})

const currentComponents = computed(() => {
  return get(tabs.value.find(item => item.name === activeTab.value), 'components') || []
})

const appStatus = computed(() => {
  return get(rendappsDetail, 'value.status.status')
})

const getRendAppsDetail = () => {
  if (!appName.value) return
  rendappsDetail.value = {}
  grafanaUrl.value = ''
  processing.value = true
  getAppAPI({ appName: appName.value }).then(res => {
    rendappsDetail.value = res.data || {}
    getGrafanaUrl()
  }).finally(() => {
    processing.value = false
  })
}

const getGrafanaUrl = () => {
  const catalog = get(route, 'params.name')
  const form = get(rendappsDetail, 'value.appFormName')
  if (!catalog || !form) return
  getCatalogsAppFormAPI({ catalog, form }).then(res => {
    grafanaUrl.value = get(res, 'data.dashboardUrl[0].link') || ''
  })
}

const toList = () => {
  router.push({ name: route.name, query: {} })
}

const refresh = (changeFlag = true) => {
  getRendAppsDetail()
  getAppLinks()
  if (changeFlag) refreshFlag.value = Date.now()
}

const getAppLinks = () => {
  appName.value && getAppServiceEndpointsAPI({ appName: appName.value }).then(res => {
    let list = get(res, 'data') || []
    list = list.map(item => {
      const appProtocol = get(item, 'endpoint.appProtocol')
      return {
        link: `${appProtocol ? `${appProtocol}://` : ''}${get(item, 'endpoint.host')}`,
        inner: get(item, 'endpoint.inner')
      }
    }) || []
    list = uniqBy(list, 'link')
    appLinks.value = orderBy(list, ['inner'], ['desc'])
  })
}

const setPodNames = (pods) => {
  podNames.value = pods.join('|')
}

onBeforeMount(() => {
  const tab = get(route, 'query.activeTab')
  if (tab) activeTab.value = tab
  router.replace({
    query: {
      ...get(route, 'query'),
      activeTab: undefined
    }
  })
})

onMounted(() => {
  refresh(false)
})
</script>

<template lang="pug">
.application-instance-detail(v-loading="processing")
  PageHeader(:data="{ content: `${i18n.t('applications.instance')}: ${appName}` }")
    .action-btn.flex
      HomepageButton.mr-2(:app-links="appLinks")
      .update-run-btn.mr-2
        UpdateConfigButton(
          :data="appBasicData",
          :btn-options="{}"
        )
      el-button.mr-2(@click="refresh")
        i.remix.mr-0.ri-refresh-line
      el-dropdown
        el-button
          .flex.items-center
            span {{ $t('common.more') + $t('common.operate') }}
            i.ri-arrow-down-s-line
        template(#dropdown)
          el-dropdown-menu.dropdown-menu-full-button
            el-dropdown-item(v-if="grafanaUrl && appStatus === 'running'")
              a(:href="grafanaUrl", target="_blank")
                .flex.more-btn
                  i.remix.ri-external-link-line
                  span {{ $t('applications.monitoring') }}
            el-dropdown-item
              router-link(:to="{ name: 'process', query: { name: appName } }", target="_blank")
                .flex.more-btn
                  i.remix.ri-external-link-line
                  span {{ $t('menu.process') }}
            el-dropdown-item
              UninstallButton(
                :data="{ appName, bdc: get(route, 'query.bdc') }"
                @refresh="toList"
              )
                .flex.more-btn
                  i.remix.ri-uninstall-line
                  span {{ $t('common.uninstall') }}
    template(#nextRow)
      AppConfigInfo.mt-3.mb-2(
        :data="appBasicData",
        type="instance"
      )
      el-tabs(v-model="activeTab")
        el-tab-pane(
          v-for="({ name, label }) in tabs",
          :key="name",
          :label="label",
          :name="name"
        )
  .instance-detail-body.bg-gray
    .instance-component.mb-4(
      v-for="item in currentComponents",
      :key="item.name"
    )
      .box-title.text-high.mb-2(v-if="item.componentTitle") {{ item.componentTitle }}
      component(
        :is="item.component",
        v-bind="item.options",
        :class="item.isTable ? 'has-border-table' : 'border-0'",
        @set-pod-names="setPodNames"
      )
</template>

<style lang="scss">
@import '@/assets/root.scss';

.application-instance-detail {
  .page-header-container {
    padding-bottom: 0 !important;
  }

  .instance-detail-body {
    .application-load-balancer-list-container,
    .application-pods-list-container {
      height: auto;
      margin: 0 !important;
    }
    .box-title {
      font-size: 16px;
      font-weight: 500;
    }
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
}
</style>
