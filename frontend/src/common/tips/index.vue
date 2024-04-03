<script>
import { mapGetters, mapActions } from 'vuex'

import Ajax from '@/api/ajax'
import Marked from '@/components/marked'

export default {
  name: 'CommonTips',
  props: {
    type: {
      type: String,
      default: '' // tooltip/link/msgbox
    },
    options: {
      type: Object,
      default: () => ({})
    },
    linkTip: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: {}
    }
  },
  computed: {
    ...mapGetters([
      'lang',
      'tipsCache'
    ]),
    currentType () {
      return this.type || this.data.type || 'tooltip'
    },
    currentContent () {
      return this.content || this.tipsCache[this.name] || this.data.content
    },
    shouldRequest () {
      const { name, content, tipsCache } = this
      return !content && name && !tipsCache[name]
    }
  },
  methods: {
    ...mapActions([
      'setTipsCache'
    ]),
    getTipsData () {
      const { name, shouldRequest, lang } = this
      const self = this

      shouldRequest && new Ajax({
        resource: 'GET_TUTORIAL_TIPS',
        data: { keys: name, lang },
        success (rsp = {}) {
          self.data = rsp.data || {}
          self.setTipsCache({ name, content: rsp.data && rsp.data.content })
        }
      }).fetch()
    },
    openBox () {
      const self = this
      const { name, content } = self.data

      const h = self.$createElement

      this.$msgbox({
        customClass: 'common-tips-msgbox el-message-box--md',
        title: self.$t('common.usageTip', {name}),
        message: h(
          'Marked',
          {
            props: {
              data: content
            }
          }
        ),
        confirmButtonClass: 'el-button--primary'
      }).catch(() => {})
    }
  },
  mounted () {
    this.getTipsData()
  },
  components: {
    Marked
  },
  watch: {
    lang () {
      this.setTipsCache()
      this.getTipsData()
    }
  }
}
</script>

<template lang="pug">
span.common-tips.small(v-if="name || content")
  el-tooltip(
    v-if="currentType === 'tooltip'",
    popper-class="common-tips-tooltip",
    v-bind="options",
    :disabled="!currentContent"
  )
    template(slot="content")
      Marked(
        v-if="currentContent",
        :data="currentContent"
      )
    slot
      i.remix.ri-information-line.text-icon-tip.cursor-pointer
  el-tooltip(
    v-show="currentType !== 'tooltip'",
    :content="linkTip || $t('common.clicktoviewDetails')"
  )
    a.text-icon-tip.hover-primary(
      v-if="currentType === 'link'",
      :href="data.link || options.link || data.content || '#'",
      target="_blank",
    )
      slot
        i.remix.ri-information-line
    span.hover-primary.text-icon-tip(
      v-if="currentType === 'msgbox'"
      @click="openBox"
    )
      slot
        i.remix.ri-information-line
</template>

<style lang="scss">
@import '~@/root.scss';

.common-tips-tooltip {
  &.is-dark .markdown-body {
    padding: 0 !important;
    max-height: 300px;
    overflow-y: auto;
    color: #fff;
    > p {
      color: #fff;
      font-size: 12px;
    }
    > ul {
      font-size: 12px;
    }
  }
}

.common-tips-msgbox {
  .el-message-box__content {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }
}
</style>
