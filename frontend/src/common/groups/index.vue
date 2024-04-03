<script>

/**
 * Component Settings
 */
export default {
  name: 'groups',
  props: {
    data: {
      type: Array,
      default: null
    },
    cls: {
      type: String,
      default: ''
    }
  },
  computed: {
    list () {
      return this.data || []
    }
  }
}
</script>

<template lang="pug">
.groups(:class="cls")
  el-tag.text-ellipsis(
    v-for="(item, i) in list",
    :data="item",
    :key="i"
  ) {{ item.name }}
</template>

<style lang="scss">
.groups {
  .el-tag {
    max-width: 100%;
    margin-right: 3px;
  }
  &.form-control-plaintext {
    padding-bottom: 0;
    .el-tag {
      margin-right: 7px;
      margin-bottom: 7px;
    }
  }
}
</style>
