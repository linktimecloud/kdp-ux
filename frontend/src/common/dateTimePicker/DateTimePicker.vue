<script>
import { isBoolean, get } from 'lodash'
import i18n from '@/i18n'

const DEFAULT_TIME_OPTIONS = {
  'value-format': 'HH:mm:ss'
}

export default {
  name: 'DateTimePicker',
  props: {
    data: {
      type: String,
      required: true
    },
    showTime: {
      type: Boolean,
      default: true
    },
    showSeparator: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      DEFAULT_TIME_OPTIONS,
      form: {
        date: '',
        time: '00:00:00'
      }
    }
  },
  computed: {
    currentDate () {
      const { form: { time }, showTime } = this
      let ret = time || '00:00:00'
      if (!showTime) ret = '00:00:00'
      return ret
    },
    formatDate () {
      const { form: { date }, currentDate } = this
      let ret = ''
      if (date) ret = date + ' ' + currentDate
      return ret
    }
  },
  watch: {
    'options.resetFlag': {
      deep: true,
      handler () {
        this.date = ''
        this.time = '00:00:00'
      }
    },
    formatDate: {
      deep: true,
      handler (val) {
        this.$emit('update:data', val)
      }
    },
    data: {
      deep: true,
      handler () {
        this.initDate()
      }
    }
  },
  mounted () {
    if (this.data) this.initDate()
  },
  methods: {
    initDate () {
      const timeArray = this.data.split(' ')
      this.$set(this.form, 'date', timeArray[0])
      this.$set(this.form, 'time', timeArray[1] || '00:00:00')
    },
    getClearable (options, type) {
      let clearable = true
      if (type === 'date') clearable = get(options, 'dateOptions.clearable')
      if (type === 'time') clearable = get(options, 'timeOptions.clearable')
      return isBoolean(clearable) ? clearable : true
    },
    getPlaceholder (options, type) {
      let placeholder = ''
      if (type === 'date') placeholder = get(options, 'dateOptions.placeholder') || i18n.t('time.selectDate')
      if (type === 'time') placeholder = get(options, 'timeOptions.placeholder') || i18n.t('misc.selectTime')
      return placeholder
    }
  }
}
</script>
<template lang="pug">
.date-time-picker-box
  .content-box(
    :class="{ 'date-time-picker-separator' : showSeparator }"
  )
    el-date-picker.date-time-box(
      v-model="form.date",
      type="date",
      :disabled="disabled",
      :placeholder="getPlaceholder(options, 'date')",
      :clearable="getClearable(options, 'date')",
      v-bind="options.dateOptions || {}"
    )
    el-time-picker.date-time-box(
      v-if="showTime",
      v-model="form.time",
      :class="{ 'time-border' : showTime }",
      :disabled="disabled",
      :placeholder="getPlaceholder(options, 'time')",
      :clearable="getClearable(options, 'time')",
      v-bind="options.timeOptions || DEFAULT_TIME_OPTIONS"
    )
</template>

<style lang="scss">
@import '@/assets/root.scss';

.date-time-picker-box {
  .date-time-box {
    width: 132px;
    .el-input__inner {
      padding-right: 4px;
    }
  }
  .time-border {
    .el-input__inner {
      border-left: 0 !important;
    }
  }
  .date-time-picker-separator {
    &::after {
      content: "-";
      height: 10px;
      width: 2px;
      color: $font;
      margin-left: 8px;
    }
  }
}
</style>
