<script>
import { get } from 'lodash'

import { getCatalogsAppFormsAPI } from '@/api/catalog'

import MarketInstallButton from '@/pages/apps/market/MarketInstallButton.vue'
import ReasonButton from '@/common/ReasonButton.vue'

export default {
  name: 'catalog-system-apps-list',
  data () {
    return {
      processing: false,
      data: []
    }
  },
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  computed: {
    columns () {
      return [
        {
          prop: 'name',
          label: this.$t('applications.name'),
          minWidth: 200
        },
        {
          prop: 'version',
          label: this.$t('applications.latestVersion')
        },
        {
          prop: 'description',
          label: this.$t('catalogs.description'),
          minWidth: 300
        },
        {
          prop: 'operate',
          label: this.$t('common.operate')
        }
      ]
    },
    route () {
      return this.$route
    }
  },
  methods: {
    getList () {
      const self = this
      const { name } = self

      self.data = []
      self.processing = true

      getCatalogsAppFormsAPI({ catalog: name }).then(rsp => {
        self.data = get(rsp, 'data') || []
      }).finally(() => {
        self.processing = false
      })
    },
    goDetail (row) {
      const { name: sub } = row

      return {
        ...this.$route.query,
        sub
      }
    }
  },
  mounted () {
    this.getList()
  },
  components: {
    MarketInstallButton,
    ReasonButton
  },
  watch: {
    name (val) {
      this.getList()
    }
  }
}
</script>

<template lang="pug">
.catalog-system-apps-list.shadow-box(v-loading="processing")
  el-table(:data="data", border)
    el-table-column(
      v-for="({ prop, label, minWidth }) in columns",
      :key="prop",
      :prop="prop",
      :label="label",
      :minWidth="minWidth"
    )
      template(#default="scope")
        span(v-if="prop === 'name'")
          el-tooltip(:content="scope.row.name", :disabled="!scope.row.name", :open-delay="200", placement="left")
            router-link.text-ellipsis.block(:to="{ name: route.name, query: goDetail(scope.row) }") {{ scope.row.name }}
          el-tooltip(:content="scope.row.alias", :disabled="!scope.row.alias", :open-delay="200", placement="bottom")
            span.appname-tips.text-gray.text-ellipsis(v-if="scope.row.alias") ({{ scope.row.alias }})
        span(v-else-if="prop === 'description'")
          el-tooltip(:content="scope.row.description", :disabled="!!scope.row.description", placement="top-start")
            .d-block.system-app-description {{ scope.row.description ?? '-' }}
        span(v-else-if="prop === 'operate'")
          MarketInstallButton(
            v-if="!scope.row.invisible",
            :data="{ catalog: name, form: scope.row.name }",
            @refresh="$emit('refresh')"
          )
          ReasonButton(
            v-else,
            type="primary", link,
            :reason="$t('applications.isNotInAppStoreTip')",
          ) {{ $t('common.install') }}
        span(v-else) {{ scope.row[prop] ?? '-' }}
</template>

<style lang="scss">
.catalog-system-apps-list {
  .system-app-description {
    word-break: break-word;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box !important;
  }
  .appname-tips {
    max-width: 100%;
    display: inline-block;
  }
}
</style>
