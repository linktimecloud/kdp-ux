<script>
import AppList from '@/pages/apps/applications/list'

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
    :showBreadcrumb="false",
    :propsFilter="propsFilter",
    :hiddenColumns="['catalog']",
    :showSearch="false",
    defaultOrderBy="bdc",
    :refreshFlag="refreshFlag"
  )
</template>
