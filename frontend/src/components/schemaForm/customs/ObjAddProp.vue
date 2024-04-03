<script>
import { fieldProps, vueUtils, formUtils } from '@lljj/vue-json-schema-form'

import { cloneDeep, isEmpty } from 'lodash'
import i18n from '@/i18n'

export default {
  name: 'schema-form-object-add-prop',
  props: {
    ...fieldProps
  },
  data () {
    return {
      i18n,
      keyValues: []
    }
  },
  computed: {
    labelText () {
      return (this.schema.title || this.curNodePath.split('.').pop()) + this.formProps.labelSuffix
    },
    selectProps () {
      return formUtils.getUiOptions({
        schema: this.schema,
        uiSchema: this.uiSchema
      })
    },
    readonly () {
      return this.selectProps?.disabled
    },
    isPwdFormat () {
      return this.selectProps?.fieldProps?.isPwdFormat
    },
    rules () {
      const { schema, required } = this
      return [
        {
          validator (rule, value, callback) {
            const isValidate = !required || !isEmpty(value)

            if (isValidate) return callback()
            return callback(schema['err:options'].required)
          }
        }
      ]
    }
  },
  methods: {
    addItem () {
      this.keyValues.push({
        key: '',
        value: '',
        isVisible: true
      })
    },
    removeItem (idx) {
      const temp = cloneDeep(this.keyValues)
      temp.splice(idx, 1)

      this.keyValues = temp
    },
    checkDuplicate (key) {
      if (!key) return false

      const keys = this.keyValues.map(item => item.key)
      return keys.filter(item => item === key).length > 1
    },
    changeVisible (idx, curIsVisible) {
      if (!this.isPwdFormat) return
      if (this.keyValues[idx].isVisible === curIsVisible) return

      this.keyValues[idx].isVisible = curIsVisible

      if (curIsVisible) {
        // decode base 64
        try {
          this.keyValues[idx].value = atob(this.keyValues[idx].value)
        } catch (e) {}
      } else {
        // encode base 64
        try {
          this.keyValues[idx].value = btoa(this.keyValues[idx].value)
        } catch (e) {}
      }
    },
    initKeyValues () {
      const curValue = vueUtils.getPathVal(this.rootFormData, this.curNodePath) || {}
      this.keyValues = Object.keys(curValue).map(key => ({
        key,
        value: curValue[key],
        isVisible: false
      }))
    }
  },
  mounted () {
    this.initKeyValues()
  },
  watch: {
    keyValues: {
      handler (val) {
        const obj = {}
        val.forEach(item => {
          if (item.key) {
            if (item.isVisible && this.isPwdFormat) {
              // encode base 64
              try {
                obj[item.key] = btoa(item.value)
              } catch (e) {
                obj[item.key] = item.value
              }
            } else {
              obj[item.key] = item.value
            }
          }
        })
        vueUtils.setPathVal(this.rootFormData, this.curNodePath, obj)
      },
      deep: true
    },
    rootFormData () {
      this.initKeyValues()
    }
  }
}
</script>

<template lang="pug">
el-form-item.schema-form-object-add-prop.pb-2(
  :label-position="formProps.labelPosition",
  :prop="curNodePath",
  :label="labelText",
  :label-width="formProps.labelWidth",
  :required="required",
  :rules="rules"
)
  .schema-form-container.flex-fill
    .desc-text.mb-2.genFromWidget_des {{ selectProps.description }}
    .array-container.border.rounded.p-2
      .array-item.mb-2(
        v-for="(item, idx) in keyValues",
        :key="idx"
      )
        .d-flex
          .prepend-input.d-flex.flex-fill
            .input-group-prepend {{ i18n.t('common.key') }}
            el-input(v-model="keyValues[idx].key", :disabled="readonly")
          .prepend-input.d-flex.flex-fill.ml-2
            .input-group-prepend {{ i18n.t('common.value') }}
            el-input(
              v-model="keyValues[idx].value",
              :disabled="readonly",
              @focus="changeVisible(idx, true)"
            )
              i.cursor-pointer(
                v-if="!readonly && isPwdFormat",
                slot="suffix",
                :class="keyValues[idx].isVisible ? 'ri-eye-line' : 'ri-eye-off-line'",
                @click="changeVisible(idx, !keyValues[idx].isVisible)"
              )
          .action-btn.ml-2
            el-button.py-1.px-2(v-if="!readonly", @click="removeItem(idx)")
              i.ri-delete-bin-line.m-0
        .small.text-danger(v-if="checkDuplicate(keyValues[idx].key)") {{ i18n.t('schema.duplicateKeyTips') }}
      .add-btn(v-if="!readonly")
        el-button.py-1.px-2(@click="addItem")
          i.ri-add-line.m-0
</template>

<style lang="scss">
.schema-form-object-add-prop {
  .input-group-prepend {
    line-height: 1.6;
  }
  .el-input__suffix-inner {
    line-height: 32px;
  }
}
</style>
