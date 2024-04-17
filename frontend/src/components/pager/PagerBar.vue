<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'router'
  },
  options: {
    type: Object,
    default: () => ({})
  },
  isMountedFetch: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const router = useRouter()

const emit = defineEmits(['refresh'])

const currentPage = computed(() => {
  const { limit, start } = props.data
  return Math.floor(start / limit) + 1
})

const paginationOptions = computed(() => {
  const { total, limit, start } = props.data
  return {
    // data config
    total,
    pageSize: limit,

    // layout config
    layout: 'total, prev, pager, next, sizes',
    'page-sizes': [10, 20, 50, 100],
    'hide-on-single-page': true,
    small: true,
    background: true,

    ...props.options,
  }
})

const handleChangeSize = (size) => {
  props.data.start = 0
  props.data.limit = size
  emit('refresh')
}

const handleChangeCurrent = (p) => {
  props.data.start = (p - 1) * props.data.limit
  emit('refresh')
}

onMounted(() => {
  if (props.type === 'router') {
    const p = route.query.p * 1 || 1
    props.data.start = (p - 1) * props.data.limit
  }
  if (props.isMountedFetch) {
    emit('refresh')
  }
})

watch(() => currentPage.value, (val) => {
  if (props.type === 'router') {
    const query = { ...route.query, p: val }
    router.push({ query })
  }
})

</script>

<template lang="pug">
.pager(v-if="data")
  el-pagination.flex.justify-center.w-full.py-4.bg-white(
    :currentPage="currentPage",
    v-bind="paginationOptions",
    @current-change="handleChangeCurrent",
    @size-change="handleChangeSize"
  )
</template>

<style lang="scss">
.pager {
  .el-pagination {
    .el-pagination__total {
      font-size: 14px;
    }
  }
}
</style>