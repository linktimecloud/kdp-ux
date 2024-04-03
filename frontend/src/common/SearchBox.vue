<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

import { get } from 'lodash'
import i18n from '@/i18n'
import DateTimePicker from '@/common/dateTimePicker/DateTimePicker.vue'
import CommonTips from '@/common/TipsIcon.vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  properties: {
    type: Array,
    default: () => ([])
  },
  actionBtns: {
    type: Array,
    default: () => ([
      {
        value: 'reset',
        label: i18n.t('common.reset'),
        plain: true
      },
      {
        value: 'search',
        label: i18n.t('tickets.query')
      }
    ])
  },
  searchAutocomplete: {
    type: Function
  },
  theme: {
    type: String,
    default: 'light'
  }
})

const searchItem = ref(null)
const containerBox = ref(null)
const actionBtnsBox = ref(null)

const oneRowNum = ref(0)

const isWrap = ref(false)

const isOpen = ref(true)

const showPropItemList = computed(() => {
  if (!isWrap.value || isOpen.value) {
    return props.properties
  } else {
    return props.properties.slice(0, oneRowNum.value)
  }
})

const properLen = computed(() => {
  return props.properties.length
})

const isGroupedOption = (list) => {
  return list && list.length && list[0].options
}

const getOneRowNum = () => {
  const searchItemDoms = searchItem.value || []
  const itemWidths = searchItemDoms.map(dom => dom.offsetWidth)

  const containerBoxW = containerBox.value ? containerBox.value.offsetWidth : 0
  const actionBtnsW = actionBtnsBox.value ? actionBtnsBox.value.offsetWidth : 0

  let i = 0
  let w = 0
  while (w < (containerBoxW - actionBtnsW) && (i === 0 || itemWidths[i - 1])) {
    if (itemWidths[i]) {
      w += itemWidths[i]
    }
    i++
  }
  oneRowNum.value = i > 0 ? i - 1 : i
  if (!isWrap.value) {
    isWrap.value = w + actionBtnsW > containerBoxW
  }
}

const emit = defineEmits()

const handleAction = (val) => {
  emit(val)
}

const getLabel = (value, options) => {
  return get(options.find(item => item.value === value), 'label') || value
}

onMounted(() => {
  getOneRowNum()
})

watch(() => properLen, () => {
  nextTick(() => {
    getOneRowNum()
  })
})
</script>
<template lang="pug">
.common-search-box.flex.justify-between.items-center(:class="{ 'light-bg': theme === 'light' }")
  .search-container.flex.items-center.w-full(ref="containerBox")
    slot(name="beforeLabel")
    .search-content(
      v-for="(property, idx) in properties",
      :key="idx",
      ref="searchItem",
      v-show="!isWrap || isOpen || idx < oneRowNum"
    )
      .search-item.flex.items-center
        template(v-if="!property.type || property.type === 'input'")
          .label.input-prepend(v-if="property.label") {{ property.label }}
          el-input.w-auto(
            v-model="data[property.name]",
            :class="property.class",
            :clearable="true",
            :placeholder="property.placeholder",
            :disabled="property.disabled"
          )
            template(v-if="property.suffixIcon", #suffix)
              i(:class="property.suffixIcon")
        template(v-if="property.type === 'select'")
          .label.input-prepend(v-if="property.label")
            span {{ property.label }}
            CommonTips.ml-1(
              v-if="property.labelTips || property.tipsContent",
              :name="property.labelTips",
              :content="property.tipsContent"
            )
          el-select.search-box-select(
            v-model="data[property.name]",
            :class="property.class",
            :multiple="property.multiple",
            :collapse-tags="property.collapseTags || true",
            filterable,
            :allow-create="property.allowCreate",
            :clearable="property.clearable === false ? false : true",
            :placeholder="property.placeholder",
            :disabled="property.disabled",
            @change="handleAction(`change-${property.name}`)"
          )
            .group-option(v-if="isGroupedOption(property.options)")
              el-option-group(
                v-for="group in property.options",
                :key="group.label",
                :label="group.label"
              )
                el-option(
                  v-for="(item, idx) in (group.options || [])",
                  :key="idx",
                  :value="item.value",
                  :label="item.label || item.name"
                )
            .simple-option(v-else)
              el-option(
                v-for="(item, idx) in (property.options || [])",
                :key="idx",
                :value="item.value",
                :label="item.label || item.name"
              )
        template(v-if="property.type === 'radioGroup'")
          .label.mr-2
            span {{ property.label }}
            el-tooltip(v-if="property.labelTips", :content="property.labelTips")
              i.remix.ri-information-fill.ml-1
          el-radio-group.mr-2(v-model="data[property.name]")
            el-radio.mr-3.mb-0(
              v-for="{ value, label } in (property.options || [])",
              :key="value",
              :label="value"
            ) {{ label }}
        template(v-if="property.type === 'checkbox'")
          el-checkbox.mb-0(
            v-model="data[property.name]",
          ) {{ property.label }}
        template(v-if="property.type === 'switch'")
          el-switch(
            v-model="data[property.name]",
            :active-value="property.activeValue || true",
            :inactive-value="property.inactiveValue || false"
          )
          .label.ml-2.mr-2 {{ property.label }}
        template(v-if="property.type === 'datetimerange'")
          DateTimePicker(
            :data.sync="data[property.name]",
            :class="property.class",
            :options="property.options || {}",
            :showSeparator="property.showSeparator",
            :disabled="property.disabled"
          )
        template(v-if="property.type === 'autocomplete'")
          .label.input-prepend(v-if="property.label") {{ property.label }}
          el-autocomplete(
            v-model="data[property.name]",
            :fetch-suggestions="property.searchAutocomplete || searchAutocomplete",
            :value-key="property.valueKey",
            :clearable="property.clearable === false ? false : true",
            :disabled="property.disabled",
            :trigger-on-focus="!!property.trigger",
            @select="property.handleSelect"
          )
            template(slot-scope="{ item }")
              el-tooltip(
                :content="item[property.valueKey]",
                placement="right-start",
                :open-delay="200"
              )
                .text-truncate.d-block {{ item[property.valueKey] }}
        template(v-if="property.type === 'sortBy' && data.sortBy")
          .sortBy-container.flex.items-center.mx-2
            el-dropdown(@command="val => data.sortBy.prop = val")
              el-button.pr-1.sort-btn
                span {{ $t('common.sort') }}: {{ getLabel(data.sortBy.prop, property.options) }}
                i.el-icon-arrow-down.text-gray
              template(#dropdown)
                el-dropdown-menu
                  el-dropdown-item(v-for="item in property.options", :key="item.value", :command="item.value")
                    span(:class="{ 'text-primary': item.value === data.sortBy.prop }") {{ item.label }}
            el-button(@click="data.sortBy.order = data.sortBy.order === 'ascending' ? 'descending' : 'ascending'")
              i.remix.mr-0(:class="data.sortBy.order === 'ascending' ? 'ri-sort-asc' : 'ri-sort-desc'")
    slot(name="searchAfter")
    .action-btns.flex.items-center(ref="actionBtns")
      el-button.mr-2(
        v-for="(item, idx) in actionBtns",
        :key="idx",
        :type="item.type",
        :plain="item.plain",
        :class="item.class",
        :disabled="item.disabled",
        @click="handleAction(item.value)"
      )
        .flex.items-center(v-if="item.label === i18n.t('common.refresh')")
          i.remix.ri-refresh-line
        .flex(v-else) {{ item.label }}
      slot
</template>

<style lang="scss">
@import '@/assets/root.scss';

.common-search-box {
  padding: 3px 12px;
  border-bottom: 1px solid $border-gray;
  &.light-bg {
    background: #fff;
  }
  .search-container {
    flex-wrap: wrap;
  }
  .search-item {
    padding: 6px 8px;
    &:first-child {
      padding-left: 0;
    }
    .label.input-prepend {
      display: flex;
      justify-content: center;
      color: #595959;
      padding: 4px 12px;
      background-color: #fafafa;
      border: solid 1px $line;
      border-radius: 2px 0 0 2px;
      border-right: 0;
      height: 30px;
      white-space: nowrap;
      text-align: center;
    }

    i.remix.ri-information-fill {
      font-size: 14px;
      color: #bfbfbf;
    }
  }
  .action-btns {
    padding: 8px 4px;
    margin-left: auto;
  }
  .search-box-select {
    .el-select__tags-text {
      display: inline-block;
      max-width: 48px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tag__close.el-icon-close {
      top: -3px;
    }
  }

  .sortBy-container {
    .el-button {
      border: 1px solid $outline !important;
      color: $font_high;
      &.sort-btn {
        border-right: 0 !important;
        border-radius: 2px 0 0 2px !important;
      }
    }
  }
}
</style>
