<script>
import { get } from 'lodash'

import Ajax from '@/api/ajax'
import JsonTree from '@/components/json'

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
      catalog && form && new Ajax({
        resource: {
          name: 'GET_CATALOGS_APP_FORMS_DATA',
          sets: {
            catalog,
            form
          }
        },
        success (rsp) {
          const item = rsp.data || {}
          self.data = [{
            name: get(item, 'metadata.labels.app'),
            type: get(item, 'spec.type'),
            value: get(item, 'spec.properties') || {}
          }]
        },
        before () {
          self.processing = true
        },
        complete () {
          self.processing = false
        }
      }).fetch()
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
.catalog-apps-list.has-border-table.rounded(v-loading="processing")
  el-table.rounded.no-border-table(:data="data", border)
    el-table-column(
      v-for="({ prop, label }) in columns",
      :key="prop",
      :prop="prop",
      :label="label"
    )
      template(slot-scope="scope")
        span(v-if="prop === 'operate'")
          el-button(type="text", @click="openDrawer(scope.row)") {{ $t('common.view') }}{{ $t('applications.settingTemplate') }}
        span(v-else) {{ scope.row[prop]}}
  el-drawer(
    custom-class="catalog-apps-list-drawer",
    :title="`${$t('applications.settingTemplate')}: ${selectedData.name}`",
    :visible="drawerVisible",
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
