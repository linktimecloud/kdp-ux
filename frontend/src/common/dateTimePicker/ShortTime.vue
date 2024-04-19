<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { TIME_DURATION_SHORTCUTS } from '@/constant'
import i18n from '@/i18n'

// Props
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ([])
  },
  defaultShortcutLable: {
    type: String,
    default: ''
  },
  shortcutList: {
    type: Array,
    default: () => TIME_DURATION_SHORTCUTS()
  },
  disableFutureTime: {
    type: Boolean,
    default: true
  },
  refreshFlag: {
    type: Number,
    default: 0
  }
})

const dateRange = ref([])
const curShortcutLable = ref('')
const tempLabel = ref('')

const emits = defineEmits(['update:modelValue'])

// Computed
const pickerOptions = computed(() => {
  return {
    shortcuts: props.shortcutList.map(item => ({
      text: item.label,
      value: () => {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - item.duration)
        tempLabel.value = item.label
        return [start, end]
      }
    })),
    disabledDate (date) {
      return props.disableFutureTime ? date.getTime() > Date.now() : false
    }
  }
})

// Methods
const handleChange = (data) => {
  const [start, end] = data || []

  curShortcutLable.value = tempLabel.value
  emits('update:modelValue', [start.getTime(), end.getTime()])

  tempLabel.value = ''
}

// Watches
watch(
  () => props.defaultShortcutLable,
  (val) => {
    curShortcutLable.value = val
  }
)

watch(
  () => props.refreshFlag,
  () => {
    curShortcutLable.value = props.defaultShortcutLable
  }
)

watch(
  () => props.modelValue,
  (val) => {
    dateRange.value = val.length ? [...val] : []
  }
)

onMounted(() => {
  if (props.modelValue && props.modelValue.length) {
    dateRange.value = [...props.modelValue]
  }
  curShortcutLable.value = props.defaultShortcutLable
})
</script>

<template lang="pug">
.datetime-picker-short.flex
  .label.input-prepend.text-center {{ i18n.t('common.timeInterval') }}{{ curShortcutLable ? ` (${curShortcutLable})` : '' }}
  el-date-picker.datetime-picker(
    v-model="dateRange",
    type="datetimerange",
    :shortcuts="pickerOptions.shortcuts",
    :disabled-date="pickerOptions.disabledDate",
    range-separator="-",
    :start-placeholder="i18n.t('common.startDate')",
    :end-placeholder="i18n.t('common.endDate')",
    align="bottom",
    :clearable="false",
    @change="handleChange"
  )
</template>

<style lang="scss">
@import '@/assets/root.scss';

.datetime-picker-short {
  position: relative;
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
    width: 350px;
    max-width: 350px;
    height: 30px !important;
    line-height: 30px !important;
    > .el-range-input {
      width: calc(50% - 10px);
    }
    .el-range__icon,
    .el-range__close-icon {
      display: none;
    }
    .el-range-separator {
      width: 20px;
    }
  }
}

</style>
