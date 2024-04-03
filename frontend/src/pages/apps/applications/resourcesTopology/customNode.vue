<script>
/** Tips: This component renders a VNode (Virtual Node) and cannot access properties and methods on the global Vue instance (this.$). */

import { startCase } from 'lodash'
import i18n from '@/i18n'
import AppIcon from '@/components/icon'
import StatusInfo from '@/common/apps/Operate/StatusInfo'

import { GRAY_COLOR, DANGER_COLOR, WARNING_COLOR } from '@/constant/color'
import { ICON_NAMES } from './constant'

export default {
  name: 'topology-custom-node',
  props: {
    properties: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      i18n
    }
  },
  components: {
    AppIcon,
    StatusInfo
  },
  computed: {
    iconPath () {
      const { kind } = this.properties
      return ICON_NAMES.includes(kind) ? `/static/img/k8sIcon/${kind}.png` : ''
    },
    kindLabel () {
      return startCase(this.properties?.kind).replace(/[^A-Z]/g, '')
    },
    popoverItems () {
      const { name, kind, namespace, healthStatus, isRoot } = this.properties
      const ret = [
        {
          label: i18n.t('common.name'),
          value: name,
          show: true
        },
        {
          label: i18n.t('common.type'),
          value: kind,
          show: true
        },
        {
          label: i18n.t('common.namespace'),
          value: namespace,
          show: !isRoot
        },
        {
          label: i18n.t('common.status'),
          value: healthStatus?.statusCode || '',
          show: !!healthStatus?.statusCode
        },
        {
          label: i18n.t('applications.statusInfo'),
          value: healthStatus?.message || '',
          show: !!healthStatus?.message
        }
      ]

      return ret.filter(item => item.show)
    },
    boxStyle () {
      const { statusCode } = this.properties?.healthStatus || {}
      const colorMap = {
        Unhealthy: DANGER_COLOR,
        Progressing: WARNING_COLOR,
        Unknown: GRAY_COLOR
      }
      return {
        borderColor: colorMap[statusCode] || 'transparent'
      }
    },
    isPod () {
      return this.properties.kind === 'Pod'
    },
    detailReqData () {
      const { namespace: resNs, name: resName, kind: resKind, apiVersion: resAPIVersion } = this.properties
      return {
        resNs,
        resName,
        resKind,
        resAPIVersion
      }
    },
    hasMessage () {
      return !!this.properties?.healthStatus?.message
    }
  },
  methods: {
    handleClickName () {
      if (this.isPod) {
        this.$emit('onClickPod', this.properties)
      }
    }
  }
}
</script>

<template lang="pug">
.custom-node-wrapper.d-flex(:style="boxStyle")
  .icon-box
    AppIcon(v-if="properties.isRoot", :name="properties.appCatalog")
    img.w-100(v-else-if="iconPath" :src="iconPath")
    .custom-bg-box(v-else) {{ kindLabel }}
  .text-box
    el-popover(
      trigger="hover",
      :width="hasMessage ? 300 : 220",
      :open-delay="300",
      popper-class="custom-node-popover",
    )
      .popover-item.my-2(
        v-for="(item, index) in popoverItems",
        :key="index"
      )
        span {{ item.label }}: {{ item.value }}
      .text-box-container(slot="reference")
        .resource-name.text-ellipsis.text-high(
          :class="{ 'text-primary': isPod, 'cursor-pointer': isPod }"
          @click="handleClickName"
        ) {{ properties.name }}
        .resource-type.text-gray {{ properties.kind }}
  .btn-box
    StatusInfo(
      :type="properties.isRoot ? 'appDetail' : 'commonAppResource'",
      :data="{ name: properties.name, status: true }",
      :reqData="detailReqData",
      :drawerTitle="`${properties.kind} : ${properties.name}`",
      drawerSize="40%"
    )
      i.remix.ri-more-2-fill.text-primary
</template>

<style lang="scss">
.custom-node-wrapper {
  background-color: #fff;
  align-items: center;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 2px 4px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.02);
  .icon-box {
    width: 36px;
    height: 36px;
    margin-left: 4px;
    .custom-bg-box {
      width: 100%;
      height: 100%;
      line-height: 36px;
      background-color: #416aff;
      border-radius: 50%;
      text-align: center;
      font-size: 16px;
      color: #fff;
    }
  }
  .text-box {
    margin-left: 8px;
    width: calc(100% - 74px);
    .text-box-container {
      max-width: 100%;
      .resource-name {
        font-weight: 500;
      }
    }
  }

  .btn-box {
    i {
      font-size: 20px;
    }
  }
}

.custom-node-popover.el-popover {
  max-height: 300px;
  overflow-y: auto;
}
</style>
