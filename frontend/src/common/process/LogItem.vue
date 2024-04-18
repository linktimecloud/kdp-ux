<script setup>
import { isEmpty } from 'lodash'
import { ref, computed } from 'vue'
import { timeformat } from '@/utils/utils.js'

const props = defineProps({
  data: {
    // [{content, createdAt, labels, level}]
    type: Object,
    default: () => ({})
  },
  cls: {
    type: String,
    default: ''
  },
  labelCls: {
    default: 'float-left'
  },
  keyword: {
    type: String,
    default: ''
  }
})

const activeNames = ref(['Labels'])

const level = computed(() => {
  const dataLevel = (props.data || {}).level

  if (dataLevel) {
    return dataLevel.toLowerCase()
  }

  const dataContent = (props.data || {}).content
  const LEVELS = ['error', 'warn', 'warning', 'info', 'success', 'fatal', 'debug', 'trace', 'all', 'off']

  // level=error 判断 优先于 [ERROR] 判断
  const levelEqualRegs = LEVELS.map(levelString => ({
    level: levelString,
    reg: new RegExp('\\blevel=' + levelString + '\\b', 'i')
  }))

  const eqaulMatchedLevel = levelEqualRegs.find(item => dataContent && dataContent.match(item.reg))

  if (eqaulMatchedLevel) {
    return eqaulMatchedLevel.level.toLowerCase()
  }

  const levelBracketRegs = LEVELS.map(levelString => ({
    level: levelString,
    reg: new RegExp('\\[' + levelString + '\\]', 'i')
  }))

  const bracketMatchedLevel = levelBracketRegs.find(item => dataContent && dataContent.match(item.reg))

  if (bracketMatchedLevel) {
    return bracketMatchedLevel.level.toLowerCase()
  }
  return 'default'
})

const labels = computed(() => {
  const data = props.data
  if (!data.labels || isEmpty(data.labels)) {
    return null
  }

  return Object.keys(data.labels).map(k => ({
    name: k,
    value: data.labels[k]
  }))
})

const showData = computed(() => {
  const { keyword, data: { content } } = props
  let ret = content
  if (keyword) {
    // eslint-disable-next-line quotes
    ret = content.replace(new RegExp(keyword.trim(), 'gi'), `<span style='background-color: #ffff00;'>$&</span>`)
  }
  return ret
})
</script>

<template lang="pug">
.log-item.py-1.text-default(v-if="showData")
  .log-item-wrapper(:class="`level-${level}`")
    .flex.py-1.px-3.w-full(v-if="!labels")
      .time {{ timeformat(data.createdAt) }}
      .content.text-left
        //- span {{ `[${level.toUpperCase()}] `}}
        span(v-html="showData")
    el-collapse(v-else, v-model="activeNames")
      el-collapse-item(:class="`level-${level}`")
        template(#title)
          .flex.h-full.py-1.w-full
            .time {{ timeformat(data.createdAt) }}
            .content.text-left(
              style="-webkit-box-orient: vertical",
              :class="{ 'log-container': activeNames.length === 1 }"
            )
              //- span {{ `[${level.toUpperCase()}] `}}
              span(v-html="showData")
        .flex.w-full(v-for="label in labels", :key="label.name")
          .label-name.text-left.px-4 {{ label.name }}
          .label-value.text-left {{ label.value ?? '-' }}
</template>

<style lang="scss">
.log-item {
  .log-item-wrapper {
    border-left: 2px solid #416aff;
    background-color: #416aff0d;
    & > .el-collapse {
      border: none !important;
    }
  }

  .log-container {
    -webkit-line-clamp: 5;
    overflow: hidden;
    display: -webkit-inline-box;
  }
  .level-success {
    border-left: 2px solid #2fbfa0;
    background-color: #2fbfa012;

    & .el-collapse-item__header {
      @extend .level-success;
    }
  }

  .level-warn,
  .level-warning {
    border-left: 2px solid #f5a623;
    background-color: #f5a62312;

    & .el-collapse-item__header {
      @extend .level-warn;
    }
  }

  .level-default,
  .level-logs,
  .level-info,
  .level-debug,
  .level-trace,
  .level-all {
    border-left: 2px solid #416aff;
    background-color: #416aff0d;
    & .el-collapse-item__header {
      @extend .level-default;
    }
  }

  .level-error,
  .level-fatal,
  .level-off {
    border-left: 2px solid #e1464e;
    background-color: #e1464e0d;

    & .el-collapse-item__header {
      @extend .level-error;
    }
  }

  .time {
    width: 180px;
  }
  .label-name {
    width: 250px;
    word-break: break-all;
  }

  .time,
  .content {
    font-weight: 400 !important;
  }

  .content,
  .label-value {
    word-break: break-all;
    flex: 1;
    padding-right: 16px;
  }

  .el-collapse-item {
    position: relative;
    .el-collapse-item__header {
      border-bottom: none;
      border-left: none;
      height: auto !important;
      line-height: 1.5 !important;
      padding-left: 25px;

      &.is-active {
        border-left: none;
        border-bottom: none;
      }
    }
    .el-collapse-item__arrow.el-icon-arrow-right {
      position: absolute;
      left: 5px;
      top: 5px;
      transform-origin: left;

      &.is-active {
        top: -1px;
        left: 12px;
      }
    }
    .el-collapse-item__wrap {
      background-color: inherit;
      border-bottom: none;
      padding: 5px 20px 20px 20px;
    }
    .el-collapse-item__content {
      padding: 10px;
      background-color: #fff;
    }
  }

  .collapse-transition {
    transition: 0s height, 0s padding-top, 0s padding-bottom;
  }
  .horizontal-collapse-transition {
    transition: 0s width, 0s padding-left, 0s padding-right;
  }
}
</style>
