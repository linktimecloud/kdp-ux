<script>
import i18n from '@/i18n'
import CopyToClipboard from '@/common/copyToClipboard'

// https://github.com/leezng/vue-json-pretty/tree/1.x
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import PATTERNS from '@/utils/patterns'

/**
 * Component format json
 */
export default {
  name: 'format-json',
  props: {
    data: {
      type: [Object, Array]
    },
    jsonFormatOptions: {
      type: Object,
      default: () => ({})
    },
    enableCopy: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: ''
    }
  },
  computed: {
    copyHoverTip () {
      return i18n.t('common.clickToCopy')
    },
    copyContent () {
      return JSON.stringify(this.data)
    },
    cls () {
      return {
        'is-dark': this.theme === 'dark',
        'pt-4': this.enableCopy && this.copyContent
      }
    },
    options () {
      return {
        showLine: false,
        ...this.jsonFormatOptions
      }
    },
    calculateValueStyle () {
      return this.jsonFormatOptions.calculateValueStyle || (() => ({}))
    }
  },
  methods: {
    getUrlValue (val) {
      let ret = ''
      try {
        ret = JSON.parse(val)
      } catch (e) {}

      return PATTERNS.url.test(ret) ? ret : ''
    }
  },
  components: {
    CopyToClipboard,
    VueJsonPretty
  }
}
</script>

<template lang="pug">
.format-json(:class="cls")
  CopyToClipboard.position-absolute.copybtn-adjust-location(
    v-if="enableCopy && copyContent",
    :content="copyContent",
    placement="top-start",
    :tip="copyHoverTip"
  )
  VueJsonPretty(:data="data", v-bind="options")
    template(slot="nodeKey", slot-scope="{ node, defaultKey }")
      span {{ defaultKey }}
    template(slot="nodeValue", slot-scope="{ node, defaultValue }")
      a(
        v-if="getUrlValue(defaultValue)",
        :href="getUrlValue(defaultValue)",
        target="_blank"
      ) {{ defaultValue }}

      span(
        v-else,
        :style="calculateValueStyle({ node, defaultValue, data })",
      ) {{ defaultValue }}

</template>

<style lang="scss">
@import '~@/root.scss';

.format-json {
  position: relative;
  .vjs-key {
    word-break: break-word;
    max-width: 50%;
    & + span {
      flex: 1;
    }
  }
  &.is-dark {
    .vjs-key {
      color: $primary_color;
    }
  }
  .copybtn-adjust-location {
    top: 0;
    right: 0.5rem;
  }
  .vjs-tree-node:hover {
    background-color: $bg_primary;
  }
}
</style>
