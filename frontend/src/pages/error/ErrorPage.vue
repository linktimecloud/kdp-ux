<script>
export default {
  name: 'ErrorPage',
  computed: {
    entry () {
      return 'home'
    }
  },
  methods: {
    backHome () {
      // this.setCurrentUser()
      this.$router.push({ name: this.entry })
    }
  }
}
</script>

<template lang="pug">
.error-page.flex.flex-column.items-center
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
