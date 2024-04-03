<script>
import { API_BASE } from '@/env'

export default {
  name: 'app-icon',
  props: {
    name: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    },
    cls: {
      type: String,
      default: 'mx-auto'
    }
  },
  data () {
    return {
      API_BASE
    }
  },
  computed: {
    icon () {
      return API_BASE + 'img?type=icon&name=' + this.name
    }
  }
}
</script>

<template lang="pug">
img.app-icon.img-fluid.mx-auto.d-block(
  v-if="API_BASE",
  :class="cls",
  :src="icon"
)
</template>
