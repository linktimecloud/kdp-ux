<script>
/**
 * Import modules
 */
import Ajax from '@/api/ajax'
import download from '@/utils/download'

/**
 * Component Settings
 */
export default {
  name: 'download-file',
  props: {
    name: {
      type: String
    },
    path: {
      type: String
    },
    resource: {
      type: [Object, String]
    },
    cls: {
      type: [String, Object],
      default: 'col-4 ml-auto mr-auto'
    },
    type: {
      type: String,
      default: 'button'
    },
    kls: {
      type: [String, Object],
      default: ''
    },
    text: {
      type: String
    }
  },
  computed: {
    isBtn () {
      return this.type === 'button'
    }
  },
  methods: {
    getFile () {
      const self = this
      const name = self.name
      const path = self.path
      const resource = self.resource
      new Ajax({
        path,
        resource,
        success (rsp = {}) {
          const d = rsp.data || {}
          download(d.key, name)
        }
      }).fetch()
    }
  }
}
</script>

<template lang="pug">
span.download-file
  .form-control-plaintext(
    v-if="isBtn",
    :class="cls"
  )
    button.btn.btn-info.btn-block(
      @click.prevent="getFile"
    ) {{ $t('common.download') }}
  a(
    v-else,
    href="#",
    :class="kls"
    @click.prevent="getFile"
  ) {{ text || name }}
</template>
