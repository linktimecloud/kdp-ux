export default {
  install (Vue) {
    Vue.directive('disable-focus', {
      bind: function (el) {
        el.addEventListener('focus', () => {
          el.blur()
        })
      }
    })
  }
}
