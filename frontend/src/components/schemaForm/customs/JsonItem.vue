<script>
import { isEmpty } from 'lodash'

import JsonEditor from '@/components/json/JsonEditor.vue'
import JsonTree from '@/components/json/FormatJson.vue'

import { fieldProps, vueUtils, formUtils } from '@lljj/vue3-form-element'

export default {
  name: 'JsonSchemaFormItemJson',
  components: {
    JsonEditor,
    JsonTree
  },
  props: {
    ...fieldProps
  },
  data () {
    return {
      jsonError: null
    }
  },
  computed: {
    value () {
      return vueUtils.getPathVal(this.rootFormData, this.curNodePath) || {}
    },
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
    height () {
      const jsonHeight = this.selectProps?.fieldProps?.jsonHeight
      return `${jsonHeight || 300}px`
    },
    rules () {
      const { schema, jsonError, required } = this
      const errMsg = this.$t('common.jsonError')
      return [
        {
          validator (rule, value, callback) {
            if (jsonError) return callback(errMsg)

            const isValidate = !required || !isEmpty(value)

            if (isValidate) return callback()
            return callback(schema['err:options'].required)
          }
        }
      ]
    }
  },
  methods: {
    onJsonChange (value) {
      vueUtils.setPathVal(this.rootFormData, this.curNodePath, value)
      this.jsonError = null
    },
    onHasError (isError) {
      this.jsonError = isError
    }
  }
}
</script>

<template lang="pug">
el-form-item.schema-form-item-json.pb-2(
  :label-position="formProps.labelPosition",
  :prop="curNodePath",
  :label="labelText",
  :label-width="formProps.labelWidth",
  :required="required",
  :rules="rules"
)
  .desc-text.mb-2.genFromWidget_des {{ selectProps.description }}
  .view-json-tree.border.rounded.p-2(
    v-if="readonly",
    :style="{ height }"
  )
    JsonTree(:data="value")
  template(v-else)
    JsonEditor.w-full(
      v-if="value",
      :key="curNodePath",
      :data="value",
      :is-simple-json="true",
      :height="height",
      @change="onJsonChange",
      @get-error="onHasError"
    )
</template>

<style lang="scss">
.json-schema-form-item-json {
  .view-json-tree {
    overflow-y: auto;
  }
}
</style>
