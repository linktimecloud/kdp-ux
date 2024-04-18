<script>
import { sortBy } from 'lodash'
import { Container, Draggable } from 'vue-smooth-dnd'
import { applyDrag } from '@/utils/dnd'
import { Local } from '@/utils/storage'

const DRAG_HANDLER_CLASSNAME = 'column-drag-handler'
const mergeCacheWithColumns = ({ columns, selection }) => {
  const colOrder = selection.map(({ value }) => value)
  return sortBy(columns, col => colOrder.indexOf(col.value))
    .map((col, idx) => {
      return selection[idx]
        ? { ...col, ...selection[idx] }
        : col
    })
}

export default {
  name: 'ColumnSettings',
  components: {
    Container,
    Draggable
  },
  props: {
    modelValue: {
      type: Array,
      default: () => ([])
    },
    cacheKey: {
      type: String,
      default: ''
    },
    tableRef: String
  },
  data () {
    return {
      show: false,
      selection: [],
      DRAG_HANDLER_CLASSNAME
    }
  },
  computed: {
    checkAll () {
      return this.selection
        .filter(col => !col.disabled)
        .every(col => col.show)
    },
    isIndeterminate () {
      return !this.checkAll && this.selection.some(col => col.show)
    }
  },
  watch: {
    modelValue: {
      deep: true,
      handler: 'resetSelection'
    }
  },
  mounted () {
    if (this.cacheKey) {
      this.loadCache()
    } else {
      this.resetSelection()
    }
  },
  methods: {
    cacheSelection () {
      if (!this.cacheKey) return
      Local.setItem(
        this.cacheKey,
        JSON.stringify(
          this.selection.map(col => ({
            value: col.value,
            name: col.name,
            show: col.show
          }))
        )
      )
    },
    loadCache () {
      if (!this.cacheKey) return
      const cachedSelection = Local.getItem(this.cacheKey)

      if (cachedSelection) {
        try {
          const selection = JSON.parse(cachedSelection)
          if (Array.isArray(selection)) {
            this.selection = mergeCacheWithColumns({ columns: this.modelValue, selection })
          } else {
            this.resetSelection()
          }
        } catch (e) {
          this.resetSelection()
        }
      } else {
        this.resetSelection()
      }

      this.handleSave()
    },
    resetSelection () {
      const list = this.modelValue || []
      this.selection = list.map((item, index) => ({
        ...item,
        show: item.show !== false,
        disabled: item.disabled || false,
        value: item.value || item.prop,
        key: `${item.value || item.prop}-${index}`
      }))
    },
    handleCheckAllChange (val) {
      this.selection
        .filter(col => !col.disabled)
        .forEach(col => {
          col.show = val
        })
    },
    handleSort (dropResult) {
      this.selection = applyDrag(this.selection, dropResult)
        .map((item, index) => ({
          ...item,
          value: item.value || item.prop,
          key: `${item.value || item.prop}-${index}`
        }))
    },
    handleCancel () {
      this.resetSelection()
      this.show = false
    },
    handleSave () {
      this.cacheSelection()
      this.$emit('update:modelValue', this.selection)
      this.$emit('refreshTable')
    }
  }
}
</script>

<template lang="pug">
.column-settings.d-inline
  el-popover(
    v-model="show",
    placement="bottom",
    width="200",
    popper-class="column-settings-popover",
    trigger="hover",
    :open-delay="200",
    @hide="handleCancel"
  )
    .column-settings-content.flex.flex-column
      .column-settings-header.my-1
        el-checkbox(
          :value="checkAll",
          :indeterminate="isIndeterminate",
          @change="handleCheckAllChange"
        )
          span {{$t('common.checkDisplayField')}}
      .column-settings-divider
      Container(
        lock-axis="y",
        :drag-handle-selector="`.${DRAG_HANDLER_CLASSNAME}`",
        @drop="handleSort"
      )
        Draggable(
          v-for="col in selection",
          :key="col.value"
        )
          .column-settings-row.flex.justify-between.items-center.mb-1(v-if="col.value !== 'operate'")
            el-checkbox(
              v-model="col.show",
              :disabled="col.disabled"
            )
              span {{ col.label }}
            el-button(
              :class="{ [DRAG_HANDLER_CLASSNAME]: !col.disabled }",
              :disabled="col.disabled",
              size="small",
              type="primary",
              link
            )
              i.remix.ri-menu-line
      .column-settings-divider.mx-1
      .column-settings-footer.flex.justify-end.mb-1
        el-button(size="small", type="primary", link, @click="handleCancel") {{ $t('common.cancel') }}
        el-button(size="small", plain, type="primary", @click="handleSave") {{ $t('common.confirm') }}
    template(#reference)
      el-button(
        type="primary",
        link
      )
        slot
          i.remix.ri-settings-3-line.me-1.text-secondary
          span.text-secondary {{ $t('common.columnSettings') }}
</template>
<style lang="scss">
@import '@/assets/root.scss';

.column-settings-popover {
  padding: 0;
  min-width: 13.5rem;
  width: auto;

  .el-checkbox__label {
    padding-left: 0.5rem;
    vertical-align: bottom;
  }

  .column-settings-header,
  .column-settings-footer {
    height: 2rem;
    padding: 0.25rem 1rem;
  }

  .column-settings-divider {
    height: 1px;
    border-bottom: 1px solid var(--color-border);
  }
  .column-settings-row,
  .column-settings-header {
    .el-checkbox {
      width: calc(100% - 20px);
      display: flex;
      align-items: center;
      margin-bottom: 0;
      .el-checkbox__label {
        width: calc(100% - 10px);
        display: block;
        word-break: break-word;
        white-space: pre-wrap;
      }
    }
  }
  .column-settings-row {
    padding: 0.25rem 1rem;
    line-height: 1.47;
    cursor: pointer;

    .el-checkbox {
      margin-right: 0.5rem;
    }

    &:hover {
      background-color: var(--color-background);
    }
  }
}
</style>
