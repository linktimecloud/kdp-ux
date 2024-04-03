<script>
import { get, map, omitBy } from 'lodash'
import Ajax from '@/api/ajax'
import { mapGetters } from 'vuex'

import AppConfigBasic from '@/pages/apps/common/appConfig/basic'
import ApplicationsContextSettings from '../contextSettings'
import PageHeader from '@/common/pageHeader'
import CommonTips from '@/common/tips'
import InstanceList from '@/pages/apps/applications/list'
import EmptyHolder from '@/components/empty'

export default {
  name: 'bigDataClusterInfoDetail',
  data () {
    return {
      activeTab: 'applications',
      processing: false,
      data: {},
      refreshFlag: Date.now()
    }
  },
  computed: {
    ...mapGetters([
      'userOrgName',
      'currentBdcName'
    ]),
    bigDataClusterBasicData () {
      const { data } = this
      return {
        ...data,
        labels: data.showLabels
      }
    },
    name () {
      return this.currentBdcName
    },
    title () {
      return `${this.$t('menu.bigDataCluster')}: ${this.name}`
    },
    tabs () {
      const { userOrgName, name } = this

      return [
        {
          name: 'applications',
          label: this.$t('applications.instance'),
          component: InstanceList,
          options: {
            propsFilter: {
              org: userOrgName,
              bdc: name
            },
            hiddenColumns: ['group', 'bdc'],
            hiddenSearch: ['group', 'bdc']
          }
        },
        {
          name: 'applicationSetting',
          label: this.$t('applications.applicationUsedSettings'),
          tip: 'APPLICATIONS_USED_SETTINGS',
          component: ApplicationsContextSettings,
          options: {
            propsFilter: {
              bdc: name
            },
            type: 'applicationSetting'
          }
        },
        {
          name: 'applicationSecret',
          label: `${this.$t('applications.applicationSecret')}${this.$t('menu.manage')}`,
          component: ApplicationsContextSettings,
          options: {
            propsFilter: {
              bdc: name
            },
            type: 'applicationSecret'
          }
        }
      ]
    },
    currentComponent () {
      return this.tabs.find(item => item.name === this.activeTab)
    }
  },
  components: {
    AppConfigBasic,
    PageHeader,
    CommonTips,
    EmptyHolder
  },
  methods: {
    getDBC () {
      const self = this
      const { name } = this
      return name && new Ajax({
        resource: {
          name: 'GET_BDC',
          sets: {
            bdcName: name
          }
        },
        success (rsp) {
          const item = get(rsp, 'data') || {}
          self.data = {
            ...item,
            org: get(item, 'orgName'),
            namespace: get(item, 'defaultNS'),
            status: item.status || 'InActive',
            labels: map(item?.labels, (value, key) => ({ key, value })),
            showLabels: omitBy(item?.labels, (value, key) => key === 'bdc.bdos.io/org')
          }
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    },
    refresh () {
      this.getDBC()
      this.refreshFlag = Date.now()
    }
  },
  watch: {
    name: {
      immediate: true,
      handler (val) {
        if (val) {
          this.getDBC()
        }
      }
    }
  }
}
</script>

<template lang="pug">
.big-data-cluster-info-detail.px-3
  PageHeader(:data="{ content: title }")
    .action-btn.d-flex
      el-button.mr-2(
        type="default"
        @click="refresh"
      )
        i.remix.ri-refresh-line.mr-0
    template(slot="nextRow")
      AppConfigBasic.mt-3(:data="bigDataClusterBasicData", type="bigDataCluster")
      el-tabs(v-model="activeTab")
        el-tab-pane(
          v-for="item in tabs",
          :key="item.name",
          :name="item.name"
        )
          .d-flex(slot="label")
            span {{ item.label }}
            CommonTips.ml-1(
              v-if="item.tip",
              :name="item.tip"
            )
  .detail-container.px-3.pb-3
    components(
      v-if="name",
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
  .pageheader__container {
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
