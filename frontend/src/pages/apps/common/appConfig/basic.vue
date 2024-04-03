<script>
import AppStatus from '@/common/apps/AppStatus'
import AppRuntimeStatus from '@/common/apps/AppRuntimeStatus'
import StatusInfo from '@/common/apps/Operate/StatusInfo'
import AffinityInfo from '@/common/apps/Operate/AffinityInfo'
import CommonTips from '@/common/tips'
import LabelsBox from '@/pages/apps/common/labelsBox'
import BdcAppStatus from '@/common/cluster/bdcStatus'

import { SYSTEM_APPLICATION_STATUS } from '@/constant/application'
import { BIG_DATA_CLUSTER_STATUS } from '@/constant/cluster'

export default {
  name: 'app-instance-config-basic',
  props: {
    data: Object,
    isFull: Boolean,
    type: String,
    resourceType: {
      type: String,
      default: 'all'
    }
  },
  data () {
    return {
      systemApplicationStatus: SYSTEM_APPLICATION_STATUS(),
      bigDataClusterStatus: BIG_DATA_CLUSTER_STATUS()
    }
  },
  computed: {
    itemMap () {
      const defaultParam = (sign = 'workflowBdcNotReadyTip') => ([
        {
          key: 'bdc',
          label: this.$t('menu.bigDataCluster'),
          sign
        },
        {
          key: 'catalog',
          label: this.$t('applications.fromCatalog')
        },
        {
          key: 'appForm',
          label: this.$t('applications.fromApp')
        },
        {
          key: 'appName',
          label: this.$t('applications.instance')
        }
      ])
      const map = {
        pod: [
          {
            key: 'catalog',
            label: this.$t('applications.fromCatalog')
          },
          {
            key: 'appForm',
            label: this.$t('applications.fromApp')
          },
          {
            key: 'workloadName',
            label: this.$t('menu.loadbalancer')
          },
          {
            key: 'workloadKind',
            label: this.$t('applications.loadBalancer.kind')
          },
          {
            key: 'creationTime',
            label: this.$t('common.createdAt'),
            format: 'time'
          },
          {
            key: 'qosClass',
            label: this.$t('applications.qosClass'),
            tip: 'QOS_CLASS_TIP'
          },
          {
            key: 'restartNum',
            label: this.$t('applications.restartNum')
          },
          {
            key: 'status',
            label: this.$t('common.status')
          },
          {
            key: 'affinity',
            label: this.$t('applications.affinity'),
            tip: 'APPLICATION_POD_AFFINITY_TIP'
          },
          {
            key: 'node',
            label: this.$t('applications.runNode')
          },
          {
            key: 'labels',
            label: this.$t('applications.labels')
          },
          {
            key: 'annotations',
            label: this.$t('applications.annotations')
          }
        ],
        instance: [
          {
            key: 'bdc',
            label: this.$t('menu.bigDataCluster'),
            sign: 'appBdcNotReadyTip'
          },
          {
            key: 'catalog',
            label: this.$t('applications.fromCatalog')
          },
          {
            key: 'appForm',
            label: this.$t('applications.fromApp')
          },
          {
            key: 'updateTime',
            label: this.$t('applications.lastOperationTime'),
            format: 'time'
          },
          {
            key: 'status',
            label: this.$t('common.status')
          }
        ],
        bigDataCluster: [
          {
            key: 'status',
            label: this.$t('common.status')
          },
          {
            key: 'namespace',
            label: this.$t('common.namespace')
          },
          {
            key: 'createTime',
            label: this.$t('common.createdAt'),
            format: 'time'
          },
          {
            key: 'labels',
            label: this.$t('applications.labels')
          },
          {
            key: 'description',
            label: this.$t('common.description')
          }
        ]
      }
      return map[this.type] || defaultParam()
    },
    statusTitle () {
      const { type, data } = this
      const map = {
        workload: `${this.$t('menu.loadbalancer')}：${data.name}`,
        pod: `${this.$t('menu.pods')}：${data.pod}`,
        instance: `${this.$t('applications.instance')}：${data.name}`
      }
      return map[type] || ''
    },
    labelMap () {
      return ['labels', 'annotations', 'labelSelector', 'nodeSelector', 'secrets']
    },
    toGroupsAction () {
      return this.type === 'instance' ? 'apps' : 'users'
    },
    showToGroupBtn () {
      const { type, resourceType } = this
      return (type === 'instance' && resourceType !== 'system') || type === 'bigDataCluster'
    }
  },
  methods: {
    getTagList (key) {
      const ret = this.data[key] || {}
      return Object.entries(ret).map(item => ({ key: item[0], value: item[1] })) || []
    },
    isLabelKey (key) {
      return this.labelMap.includes(key)
    },
    toInstanceDetail () {
      const { appName, group } = this.data
      const bdc = this.data.bdc || this.data.bdcInfo?.name

      const query = {
        name: appName,
        group,
        bdc,
        action: 'detail'
      }

      const isSystem = this.resourceType === 'system'
      if (isSystem) {
        query.systemServiceType = 'instance'
      }

      return {
        name: this.resourceType === 'system' ? 'systemService' : 'applications',
        query
      }
    },
    toLoadBalancerDetail () {
      const { workloadName: name, group, kind: type } = this.data
      const bdc = this.data.bdc || this.data.bdcInfo?.name
      const query = {
        name,
        group,
        type,
        bdc,
        action: 'detail'
      }

      const isSystem = this.resourceType === 'system'
      if (isSystem) {
        query.systemServiceType = 'loadbalancer'
      }

      return {
        name: this.resourceType === 'system' ? 'systemService' : 'loadbalancer',
        query
      }
    }
  },
  components: {
    AppStatus,
    StatusInfo,
    AffinityInfo,
    CommonTips,
    AppRuntimeStatus,
    LabelsBox,
    BdcAppStatus
  }
}
</script>

<template lang="pug">
.app-instance-config-basic.d-flex.align-items-center
  .basic-item.d-flex.align-items-center(v-for="({ key, label, format, tip, sign }) in itemMap", :key="key")
    span {{ label }}
    CommonTips.ml-1(v-if="tip", :name="tip")
    span ：
    .d-flex(v-if="key === 'bdc'")
      router-link.mr-2.text-high(
        v-if="data.bdc",
        :to="{ name: 'bigDataClusterInfo' }",
        target="_blank"
      )
        span {{ data.bdc }}
        i.remix.ri-external-link-line.ml-1
      span.mr-1(v-else) {{ data.bdc | holder('-') }}
      BdcAppStatus(:status="data.bdcStatus", :sign="sign")
    span(v-else-if="key === 'catalog'")
      router-link.ml-2.text-high(
        v-if="data.catalog",
        :to="`/catalogHomepage/${data.catalog}`",
        target="_blank"
      )
        span {{ data.catalog }}
        i.remix.ri-external-link-line.ml-1
      span.text-gray.ml-2(v-else) {{ $t('common.noData') }}
    span(v-else-if="key === 'appName'")
      router-link.ml-2.text-high(
        v-if="data.appName",
        :to="toInstanceDetail()",
        target="_blank"
      )
        span {{ data.appName }}
        i.remix.ri-external-link-line.ml-1
      span.text-gray.ml-2(v-else) {{ $t('common.noData') }}
    span(v-else-if="key === 'appForm'")
      router-link.ml-2.text-high(
        v-if="data.appForm",
        :to="{ path: `/catalogHomepage/${data.catalog}`, query: { sub: data.appForm } }",
        target="_blank"
      )
        span {{ data.appForm }}
        i.remix.ri-external-link-line.ml-1
      span.text-gray.ml-2(v-else) {{ $t('common.noData') }}
    .d-flex.align-items-center(v-else-if="key === 'status'")
      AppRuntimeStatus.mr-2(v-if="type === 'instance'", :status="data.status", :overrideTypes="systemApplicationStatus")
      BdcAppStatus(v-else-if="type === 'bigDataCluster'", :status="data.status")
      AppStatus.d-inline-block.mr-2(v-else, :data="data")
      StatusInfo(
        v-if="type !== 'bigDataCluster'",
        :data="data",
        :type="type",
        :title="statusTitle",
        :info="data.statusInfo"
      )
    .d-flex.align-items-center(v-else-if="key === 'affinity'")
      AffinityInfo(:data="data.affinity", :showLabel="true", :title="`Pod：${data.pod}`")
    span.text-high.ml-2(v-else-if="format === 'time'") {{ data[key] | timeformat }}
    LabelsBox(v-else-if="isLabelKey(key)", :sign="key", :data="data")
    span.text-high.ml-2(v-else-if="key === 'kerberos'") {{ data[key] ? $t('common.on') : $t('common.off') }}
    span.text-high.ml-2(v-else) {{ data[key] | noData }}
</template>

<style lang="scss">
@import '~@/root.scss';

.app-instance-config-basic {
  flex-wrap: wrap;
  .basic-item {
    margin-right: 30px;
    margin-bottom: 0.5rem;
  }
  .text-high {
    color: $font_high !important;
    &:hover {
      color: $font_high;
    }
  }
}
</style>
