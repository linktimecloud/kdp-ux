<script>
import { get } from 'lodash'

export default {
  name: 'schema-json',
  props: {
    data: {
      type: Object
    },
    schema: {
      type: Object
    },
    fields: {
      type: Array
    },
    cls: {
      type: [Object, String],
      default: ''
    },
    left: {
      type: [Object, String],
      default: 'col-5'
    },
    right: {
      type: [Object, String],
      default: 'col-7'
    }
  },
  computed: {
    list () {
      const data = this.data || {}
      const fields = this.fields
      let keys = []

      if (fields) {
        keys = fields
      } else {
        for (const key in data) {
          keys.push(key)
        }
      }

      return keys
    },
    properties () {
      return get(this.schema, 'properties') || {}
    }
  }
}
</script>

<template lang="pug">
.schema-json.form-horizontal(
  v-if="data",
  :class="cls"
)
  template(v-for="k in list")
    .json-schema-form-item.form-row.mb-1
      label.col-form-label(:class="left")
        span {{ k }}
        el-tooltip.ml-1(
          effect="light",
          placement="bottom",
          :content="properties[k].description",
          v-if="properties[k] && properties[k].description"
        )
          i.fa.fa-question-circle.text-info
      .col-form-content(:class="right")
        .form-control-plaintext
          span(v-if="data[k]") {{ data[k] }}
          span(v-else) {{ $t('common.empty') }}
</template>
