<script>
import { mapGetters } from 'vuex'

import TipContent from './TipContent'

export default {
  name: 'HelperTip',
  props: {
    name: {
      type: String,
      default: ''
    },
    target: {
      type: String,
      default: null
    },
    cls: {
      type: [String, Array, Object],
      default: 'text-info'
    }
  },
  data () {
    return {
      showMaual: false
    }
  },
  computed: {
    ...mapGetters([
      'route',
      'lang',
      'customizeEnv',
      'manualBase',
      'manualList'
    ]),
    item () {
      const name = this.name
      const list = this.manualList
      return list.find(item => item.index === name.toUpperCase())
    },
    obj () {
      const lang = this.lang
      const item = this.item || {}
      return item[lang]
    },
    to () {
      const name = 'manual'
      const idx = this.name
      return {
        name,
        query: { idx }
      }
    },
    link () {
      const base = this.manualBase
      const { path } = this.obj
      const ret = `${base}${path}`
      return ret
    },
    title () {
      const { name, desc } = this.obj
      return `[${name}] ${desc}`
    }
  },
  components: {
    TipContent
  }
}
</script>

<template lang="pug">
.helper-wrapper.ml-2(v-if="item")
  el-tooltip.helper-tip(
    v-if="customizeEnv.features && customizeEnv.features.MANUAL",
    effect="light",
    :disabled="!!target",
    :class="cls",
    :content="title",
    :open-delay="200"
  )
    a(
      target="_blank",
      :href="link"
    )
      i.fa.fa-book
</template>
<style lang="scss">
.helper-wrapper {
  font-size: 14px;
  display: inline-block;
  .el-dialog {
    margin-right: 0;
    height: 60vh;
    width: 40vw;
    &__header {
      padding: 10px 20px 10px;
      border: 2px solid rgb(49, 65, 88);
      border-bottom: none;
    }
    &__body {
      height: 100%;
      padding: 0;
    }
  }
  .manual-content {
    width: 100%;
    height: 100%;
    border: 2px solid rgb(49, 65, 88);
  }
}
</style>
