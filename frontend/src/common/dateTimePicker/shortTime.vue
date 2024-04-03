<script>
import { cloneDeep } from 'lodash'

import { TIME_DURATION_SHORTCUTS } from '@/constant'
export default {
  name: 'datetime-picker-short',
  props: {
    value: {
      type: Array,
      default: () => ([])
    },
    defaultShortcutLable: String,
    shortcutList: {
      type: Array,
      default: () => TIME_DURATION_SHORTCUTS()
    },
    disableFutureTime: {
      type: Boolean,
      default: true
    },
    refreshFlag: Number,
    hiddenClearBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      range: [],
      shortLabelDom: null
    }
  },
  computed: {
    pickerOptions () {
      const { disableFutureTime } = this
      return {
        shortcuts: this.shortcutList.map(item => ({
          text: item.label,
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - item.duration)
            // when picker on pick
            // 1. pickerVisible = false  即关闭弹框 触发 emitChange
            // 2. emitInput 此处 emit('input', data)  中 data 里第三项不是标准时间 所以这emit是有问题的，需要在 1 中的 change 中 再次emit input 带正确的 data
            picker.$emit('pick', [start, end, item.label])
          }
        })),
        disabledDate (date) {
          return disableFutureTime ? date.getTime() > Date.now() : true
        },
        showClear: false
      }
    }
  },
  methods: {
    change (data) {
      const [start, end, label] = data || []

      const parentDom = this.$refs.datePickerShort.$el

      if (label) {
        this.shortLabelDom.innerHTML = label
        this.shortLabelDom.style.display = 'block'

        parentDom.style.width = '100px'

        this.range = [start.getTime(), end.getTime()]
      } else {
        this.shortLabelDom.style.display = 'none'
        parentDom.style.width = '314px'
      }

      this.$emit('input', this.range)
    },
    clearShortLabel () {
      const parentDom = this.$refs.datePickerShort.$el
      const shortLabelDom = parentDom.querySelector('.datetime-picker-short-label')

      parentDom.style.width = 'auto'

      if (shortLabelDom) {
        shortLabelDom.style.display = 'none'
      }
    },
    setShortLabel () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 1000 * 60 * 5)
      const data = [start, end, this.$t('time.lastestMinutes', { number: 5 })]
      this.change(data)
    }
  },
  watch: {
    value (v) {
      this.range = cloneDeep(v || [])
      if (!v || !v.length) {
        this.clearShortLabel()
      }
    },
    defaultShortcutLable (val) {
      const dom = document.querySelector('.datetime-picker-short-label')
      dom.innerHTML = val
    },
    refreshFlag () {
      this.setShortLabel()
    }
  },
  mounted () {
    this.range = cloneDeep(this.value)

    const { defaultShortcutLable } = this

    this.$nextTick(() => {
      const parentDom = this.$refs.datePickerShort.$el

      const shortLabelDom = document.createElement('div')
      shortLabelDom.classList.add('datetime-picker-short-label')

      if (defaultShortcutLable) {
        shortLabelDom.innerHTML = defaultShortcutLable
        parentDom.style.width = '100px'
      } else {
        shortLabelDom.style.display = 'none'
      }

      parentDom && parentDom.appendChild(shortLabelDom)

      this.shortLabelDom = shortLabelDom
    })
  }
}
</script>

<template lang="pug">
.datetime-picker-short.d-flex
  .label.input-prepend.text-center {{ $t('common.timeInterval') }}
  el-date-picker.datetime-picker(
    v-model="range",
    type="datetimerange",
    :picker-options="pickerOptions",
    range-separator="-",
    :start-placeholder="$t('common.startDate')",
    :end-placeholder="$t('common.endDate')",
    align="right",
    value-format="timestamp",
    :clearable="false",
    @change="change",
    ref="datePickerShort",
    :popper-class="hiddenClearBtn ? 'hidden-clear-btn-popper' : ''"
  )
</template>

<style lang="scss">
@import '~@/root.scss';

.datetime-picker-short {
  .label.input-prepend {
    padding: 4px 12px;
    background-color: #fafafa;
    border: solid 1px $line;
    border-radius: 2px 0 0 2px;
    border-right: 0;
    height: 30px;
    line-height: normal;
    white-space: nowrap;
  }
  .datetime-picker {
    position: relative;
    width: 314px;
    cursor: pointer;
    border: solid 1px $line;
    border-radius: 0 2px 2px 0;
    height: 30px !important;
    line-height: 30px !important;
    > .el-range-input {
      width: calc(50% - 10px);
    }
    .el-icon-time,
    .el-range__close-icon {
      display: none;
    }
    .el-range-separator {
      width: 20px;
    }
    .datetime-picker-short-label {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #fff;
      text-align: center;
    }
  }
}

.hidden-clear-btn-popper {
  .el-picker-panel__footer {
    .el-button:first-child {
      display: none;
    }
  }
}

</style>
