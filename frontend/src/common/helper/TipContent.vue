<script>
export default {
  name: 'TipContent',
  props: {
    obj: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  }
}
</script>

<template lang="pug">
.tip-content
  .form-control-plaintext
    span(v-html="obj.desc")
    a.ml-1(
      target="_blank",
      rel="noopener",
      :href="link"
    )
      i.fa.fa-external-link
</template>
