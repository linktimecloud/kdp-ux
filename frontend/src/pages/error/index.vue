<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'error-page',
  computed: {
    ...mapGetters([
      'entry',
      'loadingOptions'
    ])
  },
  methods: {
    ...mapActions([
      'setCurrentUser'
    ]),
    backHome () {
      this.setCurrentUser()
      this.$router.push({ name: this.entry })
    }
  }
}
</script>

<template lang="pug">
.error-page.d-flex.flex-column.align-items-center(v-if="!loadingOptions.show")
  .holder-img.pt-4
    img(src="/static/img/busy_bg.png")
  .message.pt-4 {{ $t('error.systemErrorTips') }}
  .pt-4
    el-button(
      type="primary",
      @click="backHome"
    ) {{ $t('common.backHome') }}
</template>

<style lang="scss">
.error-page {
  padding-top: 20vh;
  .message {
    font-weight: 500;
  }
}
</style>
