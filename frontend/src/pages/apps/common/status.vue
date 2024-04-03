<script>
import Ajax from '@/api/ajax'

import SettingsForm from '@/components/json'

export default {
  name: 'app-detail-status',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      data: null
    }
  },
  computed: {
    id () {
      const q = this.$route.query
      return q.leaf || q.id
    },
    resource () {
      const name = this.id
      const type = this.type === 'apps' ? 'APPS' : 'SYSAPPS'
      const sets = { name }
      return {
        sets,
        name: `GET_CLUSTER_${type}_APPNAME_SIMPLIFIEDSTATUS`
      }
    }
  },
  components: {
    SettingsForm
  },
  methods: {
    getData () {
      const self = this
      const resource = self.resource
      new Ajax({
        resource,
        success (rsp = {}) {
          const d = rsp.data || {}
          self.data = d.status
        },
        loading: true
      }).fetch()
    }
  },
  mounted () {
    this.id && this.getData()
  },
  watch: {
    id (id) {
      id && this.getData()
    }
  }
}
</script>

<template lang="pug">
.card.app-detail-status.mb-3(
  v-if="data"
)
  .card-header.clearfix
    span {{ $t('applications.status') }}
  .card-body
    SettingsForm(:data="data")
</template>
