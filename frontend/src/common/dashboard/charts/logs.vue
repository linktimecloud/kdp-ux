<script>
import Logs from '@/common/process/logs'

export default {
  name: 'chart-logs',
  props: {
    processing: Boolean,
    dataResults: {
      type: Array,
      required: true
    },
    panelVariables: {
      type: Object,
      default: () => ({})
    }
  },
  components: { Logs }
}
</script>

<template lang="pug">
.chart-logs(v-loading="processing")
  Logs(:data="dataResults", :keyword="panelVariables.keyword")
