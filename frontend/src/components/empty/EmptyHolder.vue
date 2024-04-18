<script>
import i18n from '@/i18n'

export default {
  name: 'EmptyHolder',
  props: {
    full: {
      type: Boolean,
      default: true
    },
    height: {
      type: Number,
      default: 200
    }
  },
  data () {
    return {
      i18n
    }
  },
  computed: {
    cls () {
      const full = this.full
      return {
        full
      }
    }
  }
}
</script>

<template lang="pug">
.empty-holder.row.justify-content-center.items-center(
  :class="cls",
  :style="full ? {} : { height: `${height}px` }"
)
  .col-6.text-center
    img.bg(src="/img/empty_bg.png")
    p.form-control-plaintext {{ i18n.t('common.nodata') }}
    slot
</template>

<style lang="scss">
$height: 200px;
.empty-holder {
  height: $height;
  &.full {
    height: calc(100vh - #{$height});
  }
  .bg {
    width: 371px;
  }
  p {
    color: #817f8b;
    font-size: 1.5rem;
  }
}
</style>
