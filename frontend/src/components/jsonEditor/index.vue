<script>
import 'jsoneditor/dist/jsoneditor.min.css'
import i18n from '@/i18n'
import JsonEditor from 'jsoneditor'

export default {
  name: 'json-editor',
  props: {
    warningText: {
      type: String,
      default: ''
    },
    data: {
      type: [Object, Array, String],
      default: () => ({})
    },
    height: {
      type: String,
      default: '400px'
    },
    mode: {
      type: String,
      default: 'code'
    },
    // 展示最简单的json框样式，不需要menubar
    isSimpleJson: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      i18n,
      isError: false,
      editor: null,
      error: false,
      internalChange: false
    }
  },
  methods: {
    async setEditor (value) {
      if (this.editor) {
        this.editor.set(value)
      }
    },
    jsonChange (value) {
      this.isError = false
      this.$emit('change', value)
    },
    hasError (value) {
      if (value) {
        this.isError = true
      }
    }
  },
  watch: {
    isError (val) {
      this.$emit('getError', val)
    },
    data: {
      immediate: true,
      async handler (val) {
        if (!this.internalChange) {
          await this.setEditor(val)
        }
      },
      deep: true
    }
  },
  mounted () {
    const self = this
    const { isSimpleJson } = self

    const options = {
      mode: this.mode,
      modes: ['tree', 'code', 'form', 'text', 'view'],
      ace: window.ace,
      enableTransform: false,
      mainMenuBar: !isSimpleJson,
      statusBar: !isSimpleJson,
      onChange () {
        try {
          const json = self.editor.get()
          self.jsonChange(json)
          self.internalChange = true
          self.$nextTick(() => {
            self.internalChange = false
          })
        } catch (e) {
          self.hasError(e)
        }
      }
    }

    this.editor = new JsonEditor(
      this.$el.querySelector('#jsonEditor'),
      options,
      this.data
    )
  }
}
</script>

<template lang="pug">
.custom-json-editor(:class="isSimpleJson ? 'simple-json' : ''")
  #jsonEditor(:style="{ height }")
  p.text-warning(v-show="warningText") {{ warningText }}
  small.text-danger(v-show="isError") {{ i18n.t('common.jsonEditorErrorMessage') }}
</template>

<style lang="scss">
@import '~@/root.scss';
.custom-json-editor {
  #jsonEditor {
    .jsoneditor {
      border: thin solid $primary_color;
    }
    .jsoneditor-menu {
      background: $primary_color;
      border-bottom: 1px solid $primary_color;
      .jsoneditor-poweredBy,
      .jsoneditor-repair {
        display: none;
      }
    }
    .jsoneditor-outer {
      min-height: 160px;
    }
  }
  code {
    background-color: #f5f5f5;
  }
  &.simple-json #jsonEditor {
    .jsoneditor {
      border: 1px solid $border_gray;
      border-radius: 4px;
      overflow: hidden;
      .ace_scroller {
        background-color: $bg_gray_G1;
      }
      .ace_gutter,
      .ace_gutter-active-line {
        background-color: $bg_gray_G1;
        color: #519aba;
      }
      .ace_gutter-cell {
        padding-left: 0.5rem;
      }
    }
    .jsoneditor-outer,
    .ace-jsoneditor {
      min-height: 100px;
    }
  }
}
</style>
