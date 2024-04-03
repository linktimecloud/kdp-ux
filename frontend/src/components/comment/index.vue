<script>
export default {
  name: 'comment-board',
  props: {
    data: {
      required: true,
      type: Array
    }
  },
  computed: {
    formatData () {
      return this.data.map(v => {
        v.isAdmin = v.user.type === 'root' || v.user.type === 'Engineer'
        return v
      })
    }

  },
  methods: {
    hasAssets (item) {
      return item.files && item.files.length
    },
    assetsIsImage (item) {
      return this.hasAssets(item) && item.files[0].mimeType.indexOf('image') > -1
    }
  }
}
</script>

<template lang="pug">
.comment-board
  .comment-item(:class="{'direction-reverse': item.isAdmin }", v-for="(item, $index) in formatData", :key="$index")
    img.avatar(:src="`${item.user.avatar}?t=${+new Date()}`")
    .w-15
    .content-wrapper
      .meta
        span.item-name {{ item.user.name }}
        span.item-date {{ item.updatedAt | timeformat }}
      .comment-dialog(v-if="assetsIsImage(item)")
        .dialog__header
          img(:src="item.files[0].url")
        .dialog__footer
          img(src="@/assets/img/attachment.svg")
          span {{$t('tickets.asset')}}
          a(:href="item.files[0].url", target="_blank", rel="noopener") {{ item.files[0].name }}
      .comment-dialog
        .dialog__body
          div.comment-content(v-html="item.content")
        .dialog__footer.width-border(v-if="hasAssets(item) && !assetsIsImage(item)")
          img(src="@/assets/img/attachment.svg")
          span {{$t('tickets.asset')}}
          a(:href="item.files[0].url", target="_blank", rel="noopener") {{ item.files[0].name }}
</template>

<style lang="scss">
  .comment-board {
    color: #607182;
    font-size: 12px;
    .comment-item {
      display: flex;
      margin: 40px 0;
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 100%;
      }
      .w-15 {
        width: 15px;
      }
      .content-wrapper {
        .meta {
          .item-name {
            font-size: 16px;
          }
          .item-date {
            margin-left: 6px;
          }
        }
        .comment-dialog {
          background: #f7fafe;
          border-radius: 10px;
          margin: 12px 0;
          max-width: 540px;
          min-width: 180px;
          .dialog__header {
            background: #f7fafe;
            text-align: center;
            img {
              max-width: 540px;
              min-width: 180px;
            }
          }
          .dialog__body {
            padding: 11px 20px;
            .comment-content {
              overflow-wrap: break-word;
              p {
                margin-bottom: 0;
              }
            }
          }
          .dialog__footer {
            padding: 12px 0 14px;
            margin-left: 20px;
            margin-right: 20px;
            color: #b0bac5;
            & > * {
              margin-right: 6px;
            }
            a {
              color: #2a62c4;
            }
          }
          .dialog__footer.width-border {
            border-top: 1px solid #e5e5e5;
          }
        }
      }
    }

    .comment-item.direction-reverse {
      flex-direction: row-reverse;
      .meta {
        text-align: right;
      }
      .comment-dialog {
        .dialog__footer {
          text-align: right;
        }
      }
    }
  }
</style>
