<script>
import { get, isEmpty } from 'lodash'
import Ajax from '@/api/ajax'

import CollapseLayout from '@/common/dashboard/collapseLayout'
import JsonTree from '@/components/json'
import AppConfigBasic from './basic'

export default {
  name: 'app-instance-config',
  props: {
    appName: String,
    gname: String,
    basicData: Object
  },
  data () {
    return {
      drawerVisible: false,
      configData: {},
      processing: false
    }
  },
  computed: {
    settingsOptions () {
      const settings = get(this.configData, 'baseSpec.properties.settings') || {}
      return Object.keys(settings).map(key => ({
        key,
        value: settings[key]
      }))
    },
    overrideBasicData () {
      const { configData, appName, basicData } = this
      return {
        ...basicData,
        instanceName: appName,
        annotations: get(configData, 'fullSpec.metadata.annotations'),
        labels: get(configData, 'fullSpec.metadata.labels')
      }
    }
  },
  methods: {
    get,
    handleOpen () {
      if (isEmpty(this.configData)) {
        this.getAppConfig()
      }
      this.drawerVisible = true
    },
    getAppConfig () {
      const { gname: group, appName: name } = this
      const self = this

      new Ajax({
        resource: {
          name: 'GET_CONFIGS_RENDAPPS',
          sets: {
            group,
            name
          }
        },
        success (rsp) {
          self.configData = rsp.data || {}
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
    }
  },
  components: {
    CollapseLayout,
    JsonTree,
    AppConfigBasic
  }
}
</script>

<template lang="pug">
.app-instance-config
  el-button(@click="handleOpen") {{ $t('applications.appConfigInfo') }}
  el-drawer(
    custom-class="app-instance-config-drawer",
    :title="`${$t('applications.appConfigInfo')}: ${appName}`",
    :visible="drawerVisible",
    size="50%"
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    .drawer-container(v-loading="processing")
      CollapseLayout.mb-3(:data="{ label: $t('applications.appBasicInfo') }")
        AppConfigBasic.bg-gray.border.rounded.p-2.ml-3(:data="overrideBasicData", :isFull="true")
      CollapseLayout.mb-3(
        :data="{ label: $t('applications.parameSettings') }",
        :tipsData="{ name: 'APP_PARAME_SETTINGS' }"
      )
        .settings-input.d-flex.flex-wrap.justify-content-between.ml-3(v-if="settingsOptions.length")
          el-input.mb-2(
            v-for="item in settingsOptions",
            :key="item.key",
            :value="item.value",
            :disabled="true"
          )
            template(slot="prepend")
              span {{ item.key }}
        span.text-gray.ml-3(v-else) {{ $t('common.noData') }}
      CollapseLayout.mb-3(
        :data="{ label: $t('applications.advancedSettings') }",
        :tipsData="{ name: 'APP_ADVANCED_SETTINGS' }"
      )
        JsonTree.config-spec.bg-gray.border.rounded.p-2.ml-3(:data="configData.fullSpec")
</template>

<style lang="scss">
.app-instance-config-drawer {
  .el-drawer__body {
    padding-bottom: 1rem;
  }
  .collapse-layout .collapse-header {
    margin-bottom: 0 !important;
    .title,
    i {
      font-size: 14px;
    }
  }
  .settings-input {
    .el-input {
      width: calc(50% - 8px);
    }
  }
  .config-spec {
    height: calc(100vh - 500px);
    min-height: 100px;
    overflow-y: auto;
  }
  .app-instance-config-basic .basic-item {
    width: calc(100% / 3);
  }
}
</style>
