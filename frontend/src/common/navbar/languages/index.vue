<script>
import { mapGetters, mapActions } from 'vuex'
import { SUPPORTED_LANG_LIST } from '@/constant'

/**
 * Language LIST
 * @type {Array}
 */
// https://datatracker.ietf.org/doc/html/rfc5646

/**
 * Component Settings
 */
export default {
  name: 'navbar-languages',
  data () {
    return {
      list: SUPPORTED_LANG_LIST()
    }
  },
  computed: {
    ...mapGetters([
      'lang'
    ]),
    current () {
      const { list, lang } = this
      const obj = list.find(item => item.lang === lang) || list[0]
      return ` ${obj.text} `
    }
  },
  methods: {
    ...mapActions([
      'setLang'
    ]),
    handleSetLang (lang) {
      this.$confirm(this.$t('common.setLangTip', { lang: this.$t(`common.${lang}`) }), this.$t('common.attention'), {
        type: 'warning'
      }).then(() => {
        this.setLang(lang)
        location.reload()
      }).catch(() => {})
    }
  }
}
</script>

<template lang="pug">
li.nav-item
  el-dropdown(
    class="nav-link",
    trigger="click",
    @command="handleSetLang"
  )
    span.el-dropdown-link
      i.remix.ri-translate
      span {{ current }}
    el-dropdown-menu(
      class="language__select",
      slot="dropdown"
    )
      el-dropdown-item(
        v-for="(li, i) in list",
        :command="li.lang",
        :key="i"
      )
        span {{ li.text }}
</template>
