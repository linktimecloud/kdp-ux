<script>
import { mapGetters } from 'vuex'

export default {
  name: 'sidebar-menu-item',
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters([
      'isAdmin'
    ]),
    cls () {
      const ret = {
        'text-muted': this.data.disabled
      }
      return ret
    }
  }
}
</script>

<template lang="pug">
el-menu-item(
  :class="cls",
  :index="data.index",
  v-if="data && !data.hidden"
)
  i.menu-icon(:class="data.icon", v-if="data.icon")
  span(
    slot="title",
    :title="$te(`menuDesc.${data.name}`) ? $t(`menuDesc.${data.name}`) : ''"
  ) {{ $t(`menu.${data.name}`) }}
</template>

<style lang="scss">
.el-menu-item.text-muted {
  i,
  span {
    color: #7c90a2 !important;
  }
}
.el-menu-item {
  padding-left: 70px !important;
}
</style>
