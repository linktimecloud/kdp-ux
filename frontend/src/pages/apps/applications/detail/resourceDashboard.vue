<script>
import Dashboard from '@/common/dashboard/DashboardPanels.vue'

import { ONE_HOUR_AS_MS } from '@/constant'

export default {
  name: 'ApplicationDetailResourceDashboard',
  components: {
    Dashboard
  },
  props: {
    podNames: {
      type: String,
      required: true
    },
    namespace: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      timeQuery: {
        time: Date.now(),
        range: [Date.now() - ONE_HOUR_AS_MS * 1, Date.now()]
      }
    }
  },
  computed: {
    defaultVariables () {
      const { podNames, namespace } = this
      return {
        pod: podNames,
        namespace
      }
    }
  }
}
</script>

<template lang="pug">
.application-detail-resource-dashboard.shadow-box.p-2
  Dashboard(
    v-if="podNames && namespace",
    name="instance_resource",
    :time-query="timeQuery",
    :default-variables="defaultVariables"
  )
</template>

<style lang="scss">
.application-detail-resource-dashboard {
  height: 500px;
  .dashboard-panel-card {
    background-color: #f7f9ff !important;
    border: 0 !important;
  }
}
</style>
