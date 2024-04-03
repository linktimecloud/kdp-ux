<script setup>
import { ref, computed, onMounted, h } from 'vue'
import i18n from '@/i18n'

import Marked from '@/components/marked/FormatMarkdown.vue'

import { useLanguagesStore } from '@/stores/modules/languages'
import { ElMessageBox } from 'element-plus'
import { getTutorialTipsAPI } from '@/api/tips'

const languagesStore = useLanguagesStore()

const props = defineProps({
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
})

const data = ref({})
// TODO
const tipsCache = ref({})

const lang = computed(() => {
  return languagesStore.currentLang
})
const currentType = computed(() => {
  return props.type || data.value.type || 'tooltip'
})
const currentContent = computed(() => {
  return props.content || tipsCache.value[props.name] || data.value.content
})
const shouldRequest = computed(() => {
  const { name, content } = props
  return !content && name && !tipsCache.value[name]
})

const getTipsData = async () => {
  const { name } = props

  shouldRequest.value && await getTutorialTipsAPI({
    keys: name,
    lang: lang.value
  }).then((rsp) => {
    data.value = rsp.data || {}
    // TODO: setTipsCache
  })
}

const openBox = () => {
  const { name, content } = props

  ElMessageBox({
    customClass: 'common-tips-msgbox el-message-box--md',
    title: i18n.t('common.usageTip', { name }),
    message: h(
      Marked,
      {
        props: {
          data: content
        }
      }
    ),
    confirmButtonClass: 'el-button--primary'
  }).catch(() => {})
}

onMounted(() => {
  getTipsData()
})
</script>

<template lang="pug">
span.common-tips.small(v-if="name || content")
  el-tooltip(
    v-if="currentType === 'tooltip'",
    popper-class="common-tips-tooltip",
    v-bind="options",
    :disabled="!currentContent"
  )
    template(#content)
      Marked(
        v-if="currentContent",
        :data="currentContent"
      )
    slot
      i.remix.ri-information-line.text-icon-tip.cursor-pointer
  el-tooltip(
    v-else,
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
@import '@/assets/root.scss';

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
