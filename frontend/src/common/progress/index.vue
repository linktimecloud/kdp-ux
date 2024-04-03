<script>
/**
 * Component Settings
 */
export default {
  name: 'upload-progress',
  props: {
    upload: {
      type: Object,
      required: true
    }
  },
  computed: {
    cls () {
      const processing = this.upload.processing
      const hidden = !processing
      const show = processing
      return {
        hidden,
        show
      }
    }
  }
}
</script>

<template lang="pug">
.card.upload-progress(
  :class="cls"
)
  .card-body.p-0
    el-progress(
      type="line",
      :percentage="upload.percent",
      :show-text="true",
      :text-inside="true",
      :stroke-width="18",
      :status="upload.percent === 100 ? 'success' : ''"
    )
    .form-control-plaintext.text-center {{ $t('files.uploadProgress', upload) }}
</template>

<style lang="scss">
.upload-progress {
  margin-bottom: 15px;
  border: 0;
}
</style>
