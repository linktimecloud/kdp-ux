export default {
  name: 'dialog-mixin',
  data () {
    return {
      show: false
    }
  },
  methods: {
    openDialog () {
      this.show = true
    },
    closeDialog () {
      this.show = false
    },
    toggleDialog () {
      this.show = !this.show
    }
  }
}
