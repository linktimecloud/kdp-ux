<script>
import { get, orderBy, uniqBy } from 'lodash'
import Ajax from '@/api/ajax'

import UpdateConfigButton from '@/common/apps/Operate/UpdateConfigButton'
import HomepageButton from '@/common/apps/AppHomepageBtn'
import PageHeader from '@/common/pageHeader'
import EmptyHolder from '@/components/empty'

import AppConfigBasic from '@/pages/apps/common/appConfig/basic'
import PodList from '@/pages/apps/pods/list'
import ResourcesTopology from '@/pages/apps/applications/resourcesTopology'
import UninstallButton from '@/common/apps/Operate/UninstallButton'
import ResourceDashboard from './resourceDashboard'

export default {
  name: 'application-instance-detail',
  data () {
    return {
      processing: false,
      rendappsDetail: {},
      uischema: {},
      activeTab: 'resourcesTopology',
      refreshFlag: Date.now(),
      gid: '',
      bdcInfo: {},
      grafanaUrl: '',
      appLinks: [],
      podNames: ''
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query
    },
    currentApplication () {
      return get(this.routeQuery, 'application')
    },
    appBasicData () {
      const { rendappsDetail, currentApplication } = this
      return {
        status: get(rendappsDetail, 'status.status') || 'notRunning',
        statusInfo: get(rendappsDetail, 'status') || {},
        updateTime: rendappsDetail.updateTime || rendappsDetail.createTime,
        bdc: get(rendappsDetail, 'bdc.name'),
        bdcStatus: get(rendappsDetail, 'bdc.status'),
        catalog: get(this.$route, 'params.name'),
        appForm: rendappsDetail.appFormName,
        name: currentApplication
      }
    },
    tabs () {
      const { routeQuery, currentApplication, refreshFlag, rendappsDetail, appBasicData, podNames } = this
      return [
        {
          name: 'resourcesTopology',
          label: this.$t('applications.resourcesTopology'),
          components: [
            {
              name: 'ResourcesTopology',
              component: ResourcesTopology,
              options: {
                refreshFlag,
                appName: currentApplication,
                appCatalog: get(this.$route, 'params.name') || '',
                appBasicData
              },
              isTable: true
            }
          ]
        },
        {
          name: 'podApplication',
          label: this.$t('menu.pods'),
          components: [
            {
              name: 'PodList',
              component: PodList,
              componentTitle: this.$t('menu.pods'),
              options: {
                showBreadcrumb: false,
                showSearch: false,
                showPager: false,
                propsFilter: { group: routeQuery.group, render: currentApplication, bdc: routeQuery.bdc, appForm: rendappsDetail.appFormName },
                refreshFlag: refreshFlag,
                hiddenColumns: ['bdc', 'containers', 'qosClass']
              },
              isTable: true
            },
            {
              name: 'ResourceDashboard',
              component: ResourceDashboard,
              componentTitle: this.$t('applications.runMetric'),
              options: {
                podNames,
                namespace: rendappsDetail.appRuntimeNs || ''
              }
            }
          ]
        }
      ]
    },
    currentComponents () {
      const { tabs, activeTab } = this
      return get(tabs.find(item => item.name === activeTab), 'components') || []
    },
    title () {
      return `${this.$t('applications.instance')}: ${this.currentApplication}`
    },
    status () {
      return get(this.rendappsDetail, 'status.status')
    },
    allowOperate () {
      return this.status !== 'stopping'
    },
    isRunning () {
      return this.status === 'running'
    }
  },
  methods: {
    getRendAppsDetail () {
      const { application } = this.$route.query
      const self = this
      application && new Ajax({
        resource: {
          name: 'GET_APPLICATION',
          sets: {
            appName: application
          }
        },
        success (rsp) {
          self.rendappsDetail = get(rsp, 'data') || {}
          self.getGrafanaUrl()
        },
        before () {
          self.rendappsDetail = {}
          self.grafanaUrl = ''
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    },
    getGrafanaUrl () {
      const catalog = get(this.$route, 'params.name')
      const form = get(this.rendappsDetail, 'appFormName')
      const self = this
      catalog && form && new Ajax({
        resource: {
          name: 'GET_CATALOGS_APP_FORM',
          sets: {
            catalog,
            form
          }
        },
        success (rsp) {
          self.grafanaUrl = get(rsp, 'data.dashboardUrl[0].link') || ''
        }
      }).fetch()
    },
    toLogviewer (query = {}) {
      const { group: namespace } = this.routeQuery
      return {
        name: 'logviewer',
        query: {
          namespace,
          ...query,
          isOneHour: true
        }
      }
    },
    toList () {
      const { name } = this.$route
      this.$router.push({ name, query: {} })
    },
    refresh (changeFlag = true) {
      this.getRendAppsDetail()
      this.getAppLinks()
      if (changeFlag) this.refreshFlag = Date.now()
    },
    getAppLinks () {
      const self = this
      const { currentApplication: appName } = this
      appName && new Ajax({
        resource: {
          name: 'GET_APPLICATION_SERVICE_ENDPOINTS',
          sets: {
            appName
          }
        },
        success (rsp = {}) {
          let list = get(rsp, 'data') || []
          list = list.map(item => {
            const appProtocol = get(item, 'endpoint.appProtocol')
            return {
              link: `${appProtocol ? `${appProtocol}://` : ''}${get(item, 'endpoint.host')}`,
              inner: get(item, 'endpoint.inner')
            }
          }) || []
          list = uniqBy(list, 'link')
          self.appLinks = orderBy(list, ['inner'], ['desc'])
        }
      }).fetch()
    },
    setPodNames (pods) {
      this.podNames = pods.join('|')
    }
  },
  created () {
    const activeTab = get(this.$route, 'params.activeTab')
    if (activeTab) this.activeTab = activeTab
  },
  mounted () {
    this.refresh(false)
  },
  components: {
    AppConfigBasic,
    UpdateConfigButton,
    PodList,
    PageHeader,
    EmptyHolder,
    HomepageButton,
    UninstallButton
  }
}
</script>

<template lang="pug">
.application-instance-detail(v-loading="processing")
  PageHeader(:data="{ content: title }")
    .action-btn.d-flex
      HomepageButton.mr-2(:appLinks="appLinks")
      .update-run-btn.mr-2(v-if="allowOperate")
        UpdateConfigButton(
          :data="appBasicData",
          btnType="primary"
        )
      el-button.mr-2(@click="refresh")
        i.remix.mr-0.ri-refresh-line
      el-dropdown
        el-button
          .d-flex.align-items-center
            span {{ $t('common.more') + $t('common.operate') }}
            i.el-icon-arrow-down
        el-dropdown-menu.dropdown-menu-full-button(slot="dropdown")
          el-dropdown-item(v-if="grafanaUrl && isRunning")
            a(:href="grafanaUrl", target="_blank")
              .d-flex.more-btn
                i.remix.ri-external-link-line
                span {{ $t('applications.monitoring') }}
          el-dropdown-item
            router-link(:to="{ name: 'process', query: { name: currentApplication } }", target="_blank")
              .d-flex.more-btn
                i.remix.ri-external-link-line
                span {{ $t('menu.process') }}
          el-dropdown-item
            UninstallButton(
              :appName="currentApplication",
              :group="routeQuery.group",
              :bdc="routeQuery.bdc",
              @refresh="toList"
            )
              .d-flex.more-btn
                i.remix.ri-uninstall-line
                span {{ $t('common.uninstall') }}
    template(slot="nextRow")
      AppConfigBasic.mt-3.mb-2(
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
        @setPodNames="setPodNames"
      )
</template>

<style lang="scss">
@import '~@/root.scss';

.application-instance-detail {
  .pageheader__container {
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
