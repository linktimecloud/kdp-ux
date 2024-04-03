<script>
import AppList from '@/pages/apps/applications/list/ApplicationList.vue'

export default {
  name: 'catalog-install-list',
  props: {
    name: {
      type: String,
      default: ''
    },
    refreshFlag: Number
  },
  computed: {
    propsFilter () {
      const { name } = this
      const { query: { sub } } = this.$route
      return {
        catalog: name,
        form: sub
      }
    }
  },
  components: {
    AppList
  }
}
</script>

<template lang="pug">
.catalog-install-list.shadow-box
  AppList.content(
    :propsFilter="propsFilter",
    :options="{ hiddenSearch: true, hiddenColumns: ['catalog'], defaultOrderBy: 'bdc' }",
    :refreshFlag="refreshFlag"
  )
</template>
