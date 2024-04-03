<script>
import i18n from '@/i18n'

export default {
  name: 'service-error',
  props: {
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
    data: Object
  },
  data () {
    return { i18n }
  }
}
</script>

<template lang="pug">
.api-service-error-detail-popup
  .form-row(v-if="data.app")
    .col-4
      .form-control-plaintext.text-right {{ i18n.t('error.app') }}
    .col
      .form-control-plaintext {{ data.app }}
  .form-row(v-if="data.info.code")
    .col-4
      .form-control-plaintext.text-right {{ i18n.t('error.code') }}
    .col
      .form-control-plaintext {{ data.info.code }}
  .form-row
    .col-4
      .form-control-plaintext.text-right {{ i18n.t('error.description') }}
    .col
      .form-control-plaintext.desc-text {{ data.info.description }}
  .form-row(v-if="data.info.manual")
    .col-4
      .form-control-plaintext.text-right {{ i18n.t('error.manual') }}
    .col
      a.form-control-plaintext(:href="data.info.manual", target="_blank") {{ i18n.t('error.clickLink') }}
  .form-row(v-if="data.info.exception || data.exception")
    .col-4
      .form-control-plaintext.text-right {{ i18n.t('error.exception') }}
    .col-8.exception-log-wrapper
      code.form-control-plaintext {{ data.info.exception || data.exception }}
</template>
<style lang="scss">
.api-service-error-detail-popup {
  .form-control-plaintext {
    font-size: 14px;
  }
  .exception-log-wrapper {
    max-height: 300px;
    overflow-y: auto;
  }
  .desc-text {
    word-wrap: break-word;
  }
}
</style>
