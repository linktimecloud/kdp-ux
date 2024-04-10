<script>
/**
 * https://vue-json-schema-form.lljj.me/
 */
import VueForm from '@lljj/vue3-form-element'
import { markRaw } from 'vue'

import { get } from 'lodash'

import CustomSecretInput from './customs/SecretInput.vue'
import CustomObjAddProp from './customs/ObjAddProp.vue'
import CustomJsonItem from './customs/JsonItem.vue'
import CustomNumberInput from './customs/NumberInput.vue'

export default {
  name: 'schema-form',
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    schema: {
      type: Object,
      required: true
    },
    uiSchema: {
      type: Object,
      default: () => ({})
    },
    valid: Boolean,
    optionProps: {
      type: Object
    },
    needFirstCheck: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isDirty: false
    }
  },
  computed: {
    formProps () {
      return {
        labelWidth: '100px',
        labelPosition: 'top',
        isMiniDes: false, // 是否优先mini形式显示描述信息（label文字和描述信息同行显示）
        ...this.optionProps
      }
    },
    formatSchema () {
      const { schema } = this
      return this.initSchema(schema)
    },
    customFormats () {
      return {
        // 自定义string类型的校验规则：必须有值且不能为空字符串
        validateString: value => typeof value === 'string' && value
      }
    }
  },
  methods: {
    initSchema (schema, parentPath = []) {
      const { properties, required: requiredKeys = [] } = schema
      if (!properties) return schema

      // 最外层的统一控制
      const { disabled, isPwdFormat } = this.optionProps || {}

      const curProperties = {}

      Object.keys(properties).forEach(key => {
        const curItem = this.initSchema(properties[key], [...parentPath, key])

        // 设置item必填值的提示文案内容
        curItem['err:options'] = {
          ...(curItem['err:options'] || {}),
          required: this.$t('schema.requiredCommon')
        }

        // 初始化ui:options
        curItem['ui:options'] = {
          ...(curItem['ui:options'] || {})
        }

        // 设置item是否禁用
        const isDisabled = disabled || curItem.final
        if (isDisabled) {
          curItem['ui:options'].disabled = true
        }

        // 设置是否展示特殊的secret input
        if (curItem.format === 'password' || isPwdFormat) {
          curItem['ui:widget'] = markRaw(CustomSecretInput)
        }

        // 设置object item的展示组件
        if (curItem.type === 'object' && !curItem.properties) {
          if (curItem.additionalProperties) {
            curItem['ui:field'] = markRaw(CustomObjAddProp)
          } else {
            curItem['ui:field'] = markRaw(CustomJsonItem)
          }

          curItem['ui:fieldProps'] = {
            ...curItem['ui:fieldProps'],
            ...this.optionProps,
            ...this.formProps,
            disabled: !!isDisabled
          }
        }

        if (!curItem.enum && (curItem.type === 'number' || curItem.type === 'integer')) {
          curItem['ui:widget'] = markRaw(CustomNumberInput)
        }

        // 自定义必填的string类型的校验规则
        if (curItem.type === 'string' && requiredKeys.includes(key)) {
          curItem.format = 'validateString'
          curItem['err:options'].format = this.$t('schema.requiredCommon')
        }

        // 如果当前为基础叶子节点，并且同级的字段存在子集，那这里就需要展示特殊的label样式
        const isBasicType = ['string', 'integer', 'number'].includes(curItem.type)
        if (this.formProps.labelPosition !== 'top' && isBasicType && Object.values(properties).find(val => val.properties)) {
          curItem['ui:options'].fieldClass = {
            'special-label-item': true
          }
        }

        // 设置是否存在描述字段的样式
        curItem['ui:options'].fieldClass = {
          ...(curItem['ui:options'].fieldClass || {}),
          'has-description': curItem.description || this.checkHasDescription([...parentPath, key])
        }

        curProperties[key] = curItem
      })

      return {
        ...schema,
        properties: curProperties
      }
    },
    checkHasDescription (fieldPath) {
      const { uiSchema } = this
      const cur = get(uiSchema, fieldPath.join('.')) || {}
      return cur.description || cur['ui:description'] || cur['ui:options']?.description
    },
    async checkValid () {
      let isValidate = false

      const formDom = this.$refs.schemaFormWrap && this.$refs.schemaFormWrap.$$uiFormRef

      if (formDom) {
        try {
          isValidate = await formDom.validate()
        } catch (err) {
          isValidate = false
        }

        this.$emit('update:valid', isValidate)
      }
    },
    handleInput (val) {
      this.isDirty = true
      this.$emit('update:modelValue', val)

      setTimeout(() => {
        // Tips: 表单变化的时候，这里需要延迟一点再校验，不然如果存在dom切换的场景下 验证会有问题
        this.checkValid()
      }, 100)
    }
  },
  components: {
    VueForm
  },
  mounted () {
    // init的时候会先执行一次 handleInput
    if (!this.needFirstCheck) {
      this.isDirty = false
    }
  },
  watch: {
    modelValue () {
      this.checkValid()
    }
  }
}
</script>

<template lang="pug">
.schema-form(:class="{ 'is-dirty': isDirty }")
  VueForm.schema-form-wrap(
    :modelValue="modelValue",
    ref="schemaFormWrap",
    :schema="formatSchema",
    :ui-schema="uiSchema",
    :fallback-label="true",
    :formFooter="{ show: false }",
    :formProps="formProps",
    :customFormats="customFormats",
    @update:modelValue="handleInput"
  )
</template>

<style lang="scss">
.schema-form {
  .fieldGroupWrap_box {
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    margin-bottom: 4px;

    .el-form-item {
      margin-bottom: 14px;
      margin-top: 8px;
      &.has-description {
        margin-bottom: 34px;
      }
      .el-form-item__label {
        margin-bottom: 0;
      }
      .el-select,
      .el-input {
        width: 100%;
      }
    }

    .fieldGroupWrap_title {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      font-size: 16px;
      color: #262626;
      font-weight: 400;
    }

    .fieldGroupWrap:not(:first-child) {
      > .fieldGroupWrap_title {
        margin-top: 12px !important;
      }
    }
  }

  /* 给第一层的父级节点设置背景边框等样式 */
  .schema-form-wrap > .fieldGroupWrap > .fieldGroupWrap_box {
    border: none;
    padding: 0;

    > .fieldGroupWrap {
      border: 1px solid #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 1rem;
      margin-top: 0.5rem;
      > .fieldGroupWrap_title {
        background-color: #fafafa;
        border-radius: 0;
        padding: 0.75rem 1rem;
        margin: 0 !important;
        font-weight: 500;
        font-size: 18px;
      }

      >.fieldGroupWrap_des {
        background-color: #fafafa;
        padding: 0 1rem 0.5rem;
        margin-bottom: 0;
      }

      > .fieldGroupWrap_box {
        border: none;
        border-top: 1px solid #f0f0f0;
        border-radius: 0;
      }
    }

    > .fieldGroupWrap:first-child {
      margin-top: 0;
    }
  }

  .el-input-number {
    width: 100%;
    input {
      text-align: left;
    }
  }

  /* 把默认展示在上方的描述信息 通过定位展示在下方 */
  .el-form-item__content {
    position: relative;
    .genFromWidget_des {
      position: absolute;
      top: calc(100% + 2px);
      z-index: 9;
      line-height: 12px;
    }
  }

  .el-form-item.is-error {
    .el-input__inner {
      border-color: #dcdfe6;
      &:focus {
        border-color: #416aff;
      }
    }
    .formItemErrorBox {
      opacity: 0;
    }
  }

  .special-label-item.el-form-item {
    display: flex;
    align-items: flex-end;
    .el-form-item__label {
      background-color: #fafafa;
      border: solid 1px #e5e5e5;
      border-radius: 2px 0 0 2px !important;
      color: #595959;
      white-space: nowrap;
      margin: 0;
      height: 30px;
      line-height: 28px;
      width: auto !important;
      padding: 0 8px;
    }
    .el-form-item__content {
      flex: 1;
      margin: 0 !important;
      .el-input__wrapper {
        margin-left: -1px;
        border-radius: 0 2px 2px 0 !important;
      }
      .el-input-number {
        .el-input-number__decrease,
        .el-input-number__increase {
          right: 2px;
        }
      }
    }
  }

  &.is-dirty {
    .el-form-item.is-error {
      .formItemErrorBox {
        opacity: 1;
      }
      .genFromWidget_des {
        top: calc(100% + 18px);
      }
    }
  }
}
</style>
