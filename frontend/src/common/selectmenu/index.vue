<script>
import i18n from '@/i18n'
import { mapGetters } from 'vuex'

import MENU from '@/menu'
import { getSidebarMenuList } from '@/common/sidebar/utils'

export default {
  name: 'select-menu',
  props: {
    form: {
      type: Object,
      required: true
    },
    field: {
      type: String,
      default: 'category'
    },
    size: {
      type: String,
      default: 'small'
    },
    cls: {
      type: [String, Array, Object],
      default: 'w-100'
    },
    menu: {
      type: Array
    },
    showall: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      i18n
    }
  },
  computed: {
    ...mapGetters([
      'isOrgRole'
    ]),
    options () {
      const { isOrgRole } = this
      const menuList = getSidebarMenuList({ list: MENU, isOrgRole })

      const getItem = item => ({
        label: i18n.t(`menu.${item.name}`),
        value: item.name,
        desc: i18n.t(`menuDesc.${item.name}`)
      })

      const opts = menuList.reduce((total, cur) => {
        const { sub } = cur

        if (sub && sub.length) {
          total = total.concat(sub.map(item => getItem(item)))
        } else {
          total.push(getItem(cur))
        }
        return total
      }, [])

      if (this.showall) {
        opts.unshift({ value: 'all', label: i18n.t('common.all') })
      }

      return opts
    }
  }
}
</script>

<template lang="pug">
el-select.issues-form(
  :class="cls",
  :size="size",
  :placeholder="i18n.t('common.select')"
  v-model="form[field]",
  filterable
)
  el-option(
    v-for="item in options",
    :key="item.value",
    :title="item.desc",
    :label="item.label",
    :value="item.value"
  )
</template>
