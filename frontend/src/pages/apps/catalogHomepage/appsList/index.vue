<script>
import { get } from 'lodash'

import JsonTree from '@/components/json/FormatJson.vue'

import { getCatalogsAppFormsDataAPI } from '@/api/catalog'

export default {
  name: 'catalog-apps-list',
  data () {
    return {
      processing: false,
      data: [],
      drawerVisible: false,
      selectedData: {}
    }
  },
  props: {
    catalog: {
      type: String,
      default: ''
    },
    form: {
      type: String,
      default: ''
    }
  },
  computed: {
    columns () {
      return [
        {
          prop: 'name',
          label: `${this.$t('applications.appMode')}${this.$t('common.name')}`
        },
        {
          prop: 'type',
          label: this.$t('applications.modeType')
        },
        {
          prop: 'operate',
          label: this.$t('common.operate')
        }
      ]
    }
  },
  methods: {
    getList () {
      const { catalog, form } = this
      const self = this

      if (!catalog || !form) return

      self.processing = true
      getCatalogsAppFormsDataAPI({ catalog, form }).then(rsp => {
        const item = rsp.data || {}
        self.data = [{
          name: get(item, 'metadata.labels.app'),
          type: get(item, 'spec.type'),
          value: get(item, 'spec.properties') || {}
        }]
      }).finally(() => {
        self.processing = false
      })
    },
    openDrawer (item) {
      this.selectedData = item
      this.drawerVisible = true
    }
  },
  mounted () {
    this.getList()
  },
  components: {
    JsonTree
  }
}
</script>

<template lang="pug">
.catalog-apps-list.rounded(v-loading="processing")
  el-table.rounded(:data="data", border)
    el-table-column(
      v-for="({ prop, label }) in columns",
      :key="prop",
      :prop="prop",
      :label="label"
    )
      template(#default="scope")
        span(v-if="prop === 'operate'")
          el-button(type="primary", link, @click="openDrawer(scope.row)") {{ $t('common.view') }}{{ $t('applications.settingTemplate') }}
        span(v-else) {{ scope.row[prop]}}
  el-drawer(
    class="catalog-apps-list-drawer",
    :title="`${$t('applications.settingTemplate')}: ${selectedData.name}`",
    v-model="drawerVisible",
    size="40%"
    direction="rtl",
    :append-to-body="true",
    :before-close="() => drawerVisible = false"
  )
    JsonTree.config-data.bg-gray.border.rounded.p-2(:data="selectedData.value")
</template>

<style lang="scss">
.catalog-apps-list-drawer {
  .config-data {
    height: calc(100vh - 150px);
    min-height: 100px;
    overflow-y: auto;
  }
}
</style>
