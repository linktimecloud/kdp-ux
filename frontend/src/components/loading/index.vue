<script>
import { mapGetters, mapActions } from 'vuex'

/**
 * Component Settings
 */
export default {
  name: 'loading',
  computed: {
    ...mapGetters([
      'loadingOptions'
    ]),
    text () {
      const options = this.loadingOptions || {}
      return options.text || this.$t('common.loading')
    },
    cls () {
      const options = this.loadingOptions || {}
      const bool = options.show > 0
      return {
        show: bool,
        hide: !bool
      }
    }
  },
  methods: {
    ...mapActions([
      'setLoadingOptions'
    ]),
    close () {
      const options = this.loadingOptions
      const closable = options && options.closable
      if (closable) {
        this.setLoadingOptions({
          show: 0
        })
      }
    }
  }
}
</script>

<template lang="pug">
.loading.modal-backdrop.block-middle.fade(
  :class="cls",
  @click.prevent="close"
)
  .loading-content
    .el-loading-spinner.spin.circular
      svg(viewBox="25 25 50 50", class="circular")
        circle(cx="50", cy="50", r="20", fill="none", class="path")
    .desc {{ text }}
</template>

<style lang="scss">
.loading {
  transition: all 0.5s;
  z-index: 99999;
}
.loading-content {
  position: relative;
  color: #fff;
  width: 300px;
  height: 300px;
  text-align: center;
  top: 50%;
  left: 50%;
  margin-left: -150px;
  margin-top: -150px;
  .desc {
    position: absolute;
    width: 300px;
    line-height: 1.6;
    top: 50%;
    margin-top: 40px;
  }
}
</style>
