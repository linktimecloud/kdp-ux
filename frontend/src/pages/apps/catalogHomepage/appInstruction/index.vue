<script>
import { mapGetters } from 'vuex'
import { rest } from '@/api/rest'
import { API_BASE } from '@/env'

import EmptyHolder from '@/components/empty'

export default {
  name: 'app-instruction',
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
  components: {
    EmptyHolder
  },
  computed: {
    ...mapGetters([
      'lang'
    ]),
    link () {
      const self = this

      const { catalog, form, lang } = self
      let resource = {}
      if (catalog && form) {
        resource = {
          name: 'GET_CATALOGS_APP_FORMS_README',
          sets: {
            catalog,
            form
          }
        }
      } else {
        resource = {
          name: 'GET_CATALOGS_README',
          sets: {
            catalog
          }
        }
      }

      const path = rest(resource)?.obj?.path

      return `${API_BASE}api/${path}?lang=${lang}`
    }
  }
}
</script>

<template lang="pug">
.app-instruction.h-100
  .shadow-box.w-100.h-100
    iframe.w-100.h-100.px-2.pt-2(
      v-if="link",
      :frameBorder="0",
      :src="link"
    )
    EmptyHolder(v-else)
</template>

<style lang="scss">
.app-instruction {
  height: calc(100% - 8px);
}
</style>
