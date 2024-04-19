<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  modelValue: {
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

const emit = defineEmits(['refresh', 'update:modelValue'])

const currentPage = computed(() => {
  const { limit, start } = props.modelValue
  return Math.floor(start / limit) + 1
})

const paginationOptions = computed(() => {
  const { total, limit } = props.modelValue
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
  emit('update:modelValue', {
    ...props.modelValue,
    start: 0,
    limit: size
  })
  emit('refresh')
}

const handleChangeCurrent = (p) => {
  emit('update:modelValue', {
    ...props.modelValue,
    start: (p - 1) * props.modelValue.limit
  })
  emit('refresh')
}

onMounted(() => {
  if (props.type === 'router') {
    const p = route.query.p * 1 || 1
    emit('update:modelValue', {
      ...props.modelValue,
      start: (p - 1) * props.modelValue.limit
    })
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
.pager(v-if="modelValue")
  el-pagination.flex.justify-center.w-full.py-4.bg-white(
    :current-page="currentPage",
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