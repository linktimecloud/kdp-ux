<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { get } from 'lodash'
import i18n from '@/i18n'

import { getCatalogsAppFormsAPI } from '@/api/catalog'

import MarketInstallButton from '@/pages/apps/market/MarketInstallButton.vue'
import ReasonButton from '@/common/ReasonButton.vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const processing = ref(false)
const data = ref([])

const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})

const columns = computed(() => {
  return [
    {
      prop: 'name',
      label: i18n.t('applications.name'),
      minWidth: 200
    },
    {
      prop: 'version',
      label: i18n.t('applications.latestVersion')
    },
    {
      prop: 'description',
      label: i18n.t('catalogs.description'),
      minWidth: 300
    },
    {
      prop: 'operate',
      label: i18n.t('common.operate')
    }
  ]
})

const getList = async () => {
  const { name } = props
  data.value = []
  processing.value = true
  await getCatalogsAppFormsAPI({ catalog: name }).then(rsp => {
    data.value = get(rsp, 'data') || []
  }).finally(() => {
    processing.value = false
  })
}

const goDetail = (row) => {
  const { name: sub } = row

  return {
    ...route.query,
    sub
  }
}

onMounted(() => {
  getList()
})

watch(() => props.name, (val) => {
  getList()
})
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
