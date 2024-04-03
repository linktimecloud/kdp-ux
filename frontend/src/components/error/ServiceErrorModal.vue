<script setup>
/**
 * {
 *  "app": "etl-services",
 *  "type": "error",
 *  "info": {
 *    "code": 100017,
 *    "description": "名称输入不合法，只支持数字字母下划线.",
 *    "solution": "重新输入名称.",
 *    "manual": "",
 *    "ext": {
 *      "hostIp": null,
 *      "containerIp": null,
 *      "stackTrace": "cloud.bdos.etlService.service.impl.DatasetServiceImpl.validateHiveTableName(DatasetServiceImpl.java:100)"
 *    }
 *  }
 * }
 **/

import { computed } from 'vue'
import i18n from '@/i18n'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const showItems = computed(() => {
  const { app, info = {}, exception } = props.data || {}
  const ret = [
    { key: 'app', value: app },
    { key: 'code', value: info.code },
    { key: 'description', value: info.description },
    { key: 'solution', value: info.solution },
    { key: 'manual', value: info.manual },
    { key: 'exception', value: info.exception || exception }
  ]

  return ret.filter(item => item.value)
})

</script>

<template lang="pug">
.api-service-error-detail-popup
  .flex.error-item.mb-2(
    v-for="(item, index) in showItems",
    :key="index"
  )
    .w-32.text-right.mr-2 {{ i18n.t(`error.${item.key}`) }} :
    .flex-1
      a(
        v-if="item.key === 'manual'",
        :href="data.info.manual",
        target="_blank"
      ) {{ i18n.t('error.clickLink') }}

      .max-h-80.overflow-y-auto(v-else-if="item.key === 'exception'")
        code {{ data.info.exception || data.exception }}

      span(v-else) {{ item.value }}
</template>
