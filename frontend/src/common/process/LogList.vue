<script setup>
import { ref, computed } from 'vue'
import i18n from '@/i18n'

import LogItem from './LogItem.vue'

const props = defineProps({
  processing: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array
  },
  keyword: {
    type: String,
    default: ''
  },
  showInfinite: {
    type: Boolean,
    default: false
  }
})

const count = ref(100)

const limit = ref(100)

const currentList = computed(() => {
  return props.showInfinite ? props.data.slice(0, count.value) : props.data
})

const disabled = computed(() => {
  return count.value >= props.data.length
})

const load = () => {
  count.value += limit.value
}
</script>

<template lang="pug">
.log-list(v-loading="processing")
  .list-wrapper(v-if="currentList.length")
    .infinite-list-wrapper(
      v-if="showInfinite",
      v-infinite-scroll="load",
      :infinite-scroll-disabled="disabled"
    )
      log-item(
        v-for="(log, i) in currentList",
        :key="i",
        :data="log",
        :keyword="keyword"
      )
    template(v-else)
      log-item(
        v-for="(log, i) in currentList",
        :key="i",
        :data="log",
        :keyword="keyword"
      )
  .empty-holder-text.mt-4(v-else)
    img(src="/img/empty_data.svg")
    p {{ i18n.t('common.noData') }}
</template>

<style lang="scss">
.log-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.el-message-box__message {
  .filter {
    width: 260px;
  }
  .log-list {
    max-height: calc(80vh - 200px);
  }
}
</style>
