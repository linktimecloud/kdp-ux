<script>
import { getNodesLabelValid } from '@/utils/cluster/utils'

export default {
  name: 'label-form',
  props: {
    labels: {
      type: Array,
      default: () => ([])
    },
    hiddenKey: {
      type: String,
      default: ''
    },
    sign: {
      type: String,
      default: 'node'
    }
  },
  computed: {
    labelsDisabled () {
      return !this.labels.every(item => {
        return !this.labelValid('key', item) && !this.labelValid('value', item)
      })
    },
    labelKeyRegText () {
      return {
        node: this.$t('cluster.labelKeyRegText'),
        bdc: this.$t('cluster.bdcLabelKeyRegText')
      }[this.sign]
    }
  },
  methods: {
    removeLabel (index) {
      this.labels.splice(index, 1)
    },
    addLabel () {
      this.labels.push({
        key: '',
        value: ''
      })
    },
    isUniqKey (key) {
      return key && this.labels.filter(item => item.key === key).length === 1
    },
    labelValid (type, item) {
      const { sign } = this
      const isUniqKey = this.isUniqKey(item.key)
      return getNodesLabelValid({ type, item, isUniqKey, sign })
    }
  },
  watch: {
    labelsDisabled: {
      immediate: true,
      handler (val) {
        this.$emit('setLabelsDisabled', val)
      }
    }
  }
}
</script>

<template lang="pug">
.label-form
  .label
    span {{ $t('cluster.label') }}
    el-tooltip(placement="top")
      i.remix.ri-information-line
      .p-2(slot="content")
        .d-block.mb-1 {{ labelKeyRegText }}
        .d-block {{ $t('cluster.labelValueRegText') }}
  .label-box
    template(v-if="labels?.length")
      .package-box.w-100(
        v-for="(item, index) in labels",
        :key="index"
      )
        template(v-if="!(hiddenKey && (item.key).includes(hiddenKey))")
          .d-flex.mb-2.align-items-center
            el-input(
              v-model.trim="item.key",
              :placeholder="$t('cluster.labelKey')",
              clearable
            )
            span.mr-1.ml-1 :
            el-input(
              v-model.trim="item.value",
              :placeholder="$t('cluster.labelValue')",
              clearable
            )
            el-button.ml-2.remove-btn(type="text", @click="removeLabel(index)")
              i.remix.ri-delete-bin-5-line
          .d-flex.mb-1.label-error-text.text-danger
            small.d-block.w-50 {{ labelValid('key', item) }}
            small.d-block.w-50 {{ labelValid('value', item) }}
    el-button(type="text", @click="addLabel")
      i.remix.ri-add-line
      span {{ $t('cluster.addLabels') }}
</template>
<style lang="scss">
@import '~@/root.scss';
.label-form {
  .label {
    line-height: 32px;
    color: $font;
  }
  .label-error-text {
    margin-top: -4px;
  }
  .remove-btn {
    color: $font_gray;
  }
}
</style>
