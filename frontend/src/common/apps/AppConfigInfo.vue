<script setup>
import { computed } from 'vue'
import i18n from '@/i18n'
import { isBoolean } from 'lodash'

import AppStatus from '@/common/apps/AppStatus.vue'
import StatusInfo from '@/common/apps/Operate/StatusInfo.vue'
import AffinityInfo from '@/common/apps/Operate/AffinityInfo.vue'
import CommonTips from '@/common/TipsIcon.vue'
import LabelsBox from '@/common/LabelsBox.vue'

import { timeformat } from '@/utils/utils.js'

import { APP_CONFIG_INFO_MAP } from '@/constant/application'

const props = defineProps({
  data: Object,
  type: String
})

const itemMap = computed(() => {
  return APP_CONFIG_INFO_MAP()[props.type]
})

const statusTitle = computed(() => {
  const { type, data } = props
  const map = {
    workload: `${i18n.t('menu.loadbalancer')}：${data.name}`,
    pod: `${i18n.t('menu.pods')}：${data.pod}`,
    instance: `${i18n.t('applications.instance')}：${data.name}`
  }
  return map[type] || ''
})

const isLabelKey = (key) => {
  const labelMap = ['labels', 'annotations', 'labelSelector', 'nodeSelector', 'secrets']
  return labelMap.includes(key)
}
</script>

<template lang="pug">
.app-instance-config-basic.flex.items-center
  .basic-item.flex.items-center(v-for="({ key, label, format, tip, sign, isLink, defaultType }) in itemMap", :key="key")
    span {{ label }}
    CommonTips.ml-1(v-if="tip", :name="tip")
    span ：
    .flex(v-if="key === 'bdc'")
      router-link.mr-2.text-high(
        v-if="!isBoolean(isLink) && data.bdc",
        :to="{ name: 'bigDataClusterInfo' }",
        target="_blank"
      )
        span {{ data.bdc }}
        i.remix.ri-external-link-line.ml-1
      span.mr-1(v-else) {{ data.bdc ?? '-' }}
      AppStatus(:status="data.bdcStatus", :type="defaultType || type", :sign="sign")
    span(v-else-if="key === 'catalog'")
      router-link.ml-2.text-high(
        v-if="data.catalog",
        :to="`/catalogHomepage/${data.catalog}`",
        target="_blank"
      )
        span {{ data.catalog }}
        i.remix.ri-external-link-line.ml-1
      span.text-gray.ml-2(v-else) {{ $t('common.noData') }}
    span.ml-2(v-else-if="key === 'appName'") {{ data.appName ?? $t('common.noData') }}
    span(v-else-if="key === 'appForm'")
      router-link.ml-2.text-high(
        v-if="data.appForm",
        :to="{ path: `/catalogHomepage/${data.catalog}`, query: { sub: data.appForm } }",
        target="_blank"
      )
        span {{ data.appForm }}
        i.remix.ri-external-link-line.ml-1
      span.text-gray.ml-2(v-else) {{ $t('common.noData') }}
    .flex.items-center(v-else-if="key === 'status'")
      AppStatus.d-inline-block.mr-2(:status="data.status", :type="type")
      StatusInfo(
        v-if="type !== 'bigDataCluster'",
        :data="data",
        :type="type",
        :title="statusTitle",
        :info="data.statusInfo"
      )
    .flex.items-center(v-else-if="key === 'affinity'")
      AffinityInfo(:data="data.affinity", :show-label="true", :title="`Pod：${data.pod}`")
    span.text-high.ml-2(v-else-if="format === 'time'") {{ timeformat(data[key]) }}
    LabelsBox(v-else-if="isLabelKey(key)", :sign="key", :data="data")
    span.text-high.ml-2(v-else-if="key === 'kerberos'") {{ data[key] ? $t('common.on') : $t('common.off') }}
    span.text-high.ml-2(v-else) {{ data[key] ?? $t('common.noData') }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

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
