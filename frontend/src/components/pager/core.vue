<script>
export default {
  name: 'pager-core',
  props: {
    data: {
      type: Object,
      required: true
    },
    cls: {
      type: [String, Array, Object],
      required: true
    },
    layout: {
      type: String,
      required: true
    },
    sizes: {
      type: Array,
      required: true
    },
    p: {
      type: Number,
      required: true
    },
    offsetField: {
      type: String,
      default: 'start'
    }
  },
  methods: {
    handleChange (p) {
      this.$emit('handleChange', p)
    },
    handleSizeChange (size) {
      this.$emit('handleSizeChange', size)
    }
  }
}
</script>

<template lang="pug">
el-pagination(
  ref="pager",
  :class="cls",
  :current-page="p",
  :layout="layout",
  :page-size="data.limit",
  :page-sizes="sizes",
  :total="data.total",
  :offsetField="offsetField",
  @current-change="handleChange",
  @size-change="handleSizeChange"
)
</template>

<style lang="scss">
@import '~@/root.scss';

.el-pagination {
  span.el-pagination__total {
    font-size: 14px;
    color: #17223c;
  }
  .el-pager {
    li {
      height: 28px;
      color: #999cad;
      font-weight: 500;
      line-height: 24px;
      border-radius: 5px;
      padding-top: 2px;
      min-width: 28px;
      margin-right: 5px;
    }
    li:last-child {
      width: auto;
      margin-right: 0;
    }
    li:not(.disabled).active {
      background-color: $blue;
      color: #fff;
    }
  }
  .el-icon {
    font-size: 16px !important;
  }
}
.el-pagination .btn-prev,
.el-pagination .btn-next {
  color: #999cad;
}
.is-in-pagination,
.el-input--suffix {
  .el-input__inner {
    color: #292943;
  }
}
</style>
