<script>
import i18n from '@/i18n'
/**
 * import LogItem
 */
import LogItem from '@/common/logItem'

/**
 * Component Settings
 */
export default {
  name: 'process-log',
  data () {
    return {
      i18n,
      count: 100,
      limit: 100
    }
  },
  props: {
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
  },
  computed: {
    currentList () {
      return this.showInfinite ? this.data.slice(0, this.count) : this.data
    },
    disabled () {
      return this.count >= this.data.length
    }
  },
  methods: {
    load () {
      this.count += this.limit
    }
  },
  components: {
    LogItem
  }
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
    img(src="@/assets/img/empty_data.svg")
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
