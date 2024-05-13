<script setup>
import i18n from '@/i18n'
import DateTimePicker from '@/common/dateTimePicker/DateTimePicker.vue'
import CommonTips from '@/common/TipsIcon.vue'

const props = defineProps({
  modelValue: {
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
        plain: true
      },
      {
        value: 'search'
      }
    ])
  }
})

const emits = defineEmits(['update:modelValue'])

const handleChange = (newValue, propName) => {
  emits('update:modelValue', {
    ...props.modelValue,
    [propName]: newValue
  })

  emits(`change-${propName}`, newValue)
}

</script>

<template lang="pug">
.common-search-box
  .search-container.flex.flex-wrap
    slot(name="beforeLabel")
    .search-item.flex(
      v-for="(property, idx) in properties",
      :key="idx",
      ref="searchItem"
    )
      .label.input-prepend(
        v-if="property.label",
        :class="{ 'full-bg': ['input', 'select', 'autocomplete', 'datetimerange'].includes(property.type) || !property.type }"
      )
        span {{ property.label }}
        CommonTips.ml-1(
          v-if="property.labelTips || property.tipsContent",
          :name="property.labelTips",
          :content="property.tipsContent"
        )
      template(v-if="property.type === 'input' || !property.type")
        el-input(
          :model-value="modelValue[property.name]",
          :clearable="true",
          v-bind="property",
          @input="val => handleChange(val, property.name)"
        )
      template(v-if="property.type === 'select'")
        el-select.search-box-select(
          :model-value="modelValue[property.name]",
          :filterable="true",
          :clearable="true",
          v-bind="property",
          @change="val => handleChange(val, property.name)"
        )
          .group-option(v-if="property?.options[0]?.options")
            el-option-group(
              v-for="group in property.options",
              :key="group.label",
              :label="group.label"
            )
              el-option(
                v-for="(item, gIdx) in (group.options || [])",
                :key="gIdx",
                :value="item.value",
                :label="item.label || item.name"
              )
          .simple-option(v-else)
            el-option(
              v-for="(item, oIdx) in (property.options || [])",
              :key="oIdx",
              :value="item.value",
              :label="item.label || item.name"
            )
      template(v-if="property.type === 'radioGroup'")
        el-radio-group.mr-2(
          :model-value="modelValue[property.name]",
          v-bind="property",
          @change="val => handleChange(val, property.name)"
        )
          el-radio.mr-3.mb-0(
            v-for="{ value, label } in (property.options || [])",
            :key="value",
            :label="value"
          ) {{ label }}
      template(v-if="property.type === 'checkbox'")
        el-checkbox.mb-0(
          :model-value="modelValue[property.name]",
          v-bind="property",
          @change="val => handleChange(val, property.name)"
        ) {{ property.label }}
      template(v-if="property.type === 'switch'")
        el-switch(
          :model-value="modelValue[property.name]",
          v-bind="property",
          @change="val => handleChange(val, property.name)"
        )
      template(v-if="property.type === 'datetimerange'")
        DateTimePicker(
          :model-value="modelValue[property.name]",
          v-bind="property",
          @change="val => handleChange(val, property.name)"
        )
      template(v-if="property.type === 'autocomplete'")
        el-autocomplete(
          :model-value="modelValue[property.name]",
          v-bind="property",
          @change="val => handleChange(val, property.name)",
          @select="property.handleSelect"
        )
    slot(name="searchAfter")
    .action-btns.ml-auto
      .flex.items-center.justify-end
        el-button(
          v-for="(item, idx) in actionBtns",
          :key="idx",
          type="primary",
          v-bind="item",
          @click="emits(item.value)"
        )
          .d-flex.items-center
            i.remix(
              v-if="item.icon",
              :class="item.icon"
            )
            span {{ item.label || i18n.t(`common.${item.value}`) }}
</template>

<style lang="scss">
@import '@/assets/root.scss';

.common-search-box {
  padding: 14px 16px;
  background-color: #fff;
  border-bottom: 1px solid $border_gray;
  .search-container {
    column-gap: 12px;
    row-gap: 8px;
    .search-item {
      align-items: start;
      .label.input-prepend {
        &.full-bg {
          background-color: $bg_gray_G1;
          border: solid 1px $line;
          white-space: nowrap;
          padding: 0 12px;
          border-radius: 2px 0 0 2px;
          border-right: none;
          height: 30px;
          line-height: 28px;
        }
        &:not(.full-bg) {
          margin: 6px 8px 0 0;
        }
      }

      .el-input__wrapper,
      .el-select__wrapper {
        border-radius: 0 2px 2px 0;
      }
    }
  }
}
</style>