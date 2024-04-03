<script>
import { mapGetters, mapActions } from 'vuex'

import Menulist from './menu'

export default {
  name: 'sidebar',
  data () {
    return {
      q: ''
    }
  },
  computed: {
    ...mapGetters([
      'layoutCollapse'
    ])
  },
  components: {
    Menulist
  },
  methods: {
    ...mapActions([
      'setLayoutCollapse'
    ]),
    reset () {
      this.q = ''
    },
    toggleCollapse () {
      const current = this.layoutCollapse
      this.setLayoutCollapse(!current)
    }
  }
}
</script>

<template lang="pug">
form.sidebar(
  @submit.prevent=""
)
  el-input.mt-2.mb-1.sidebar-filter.d-flex(
    clearable,
    size="small",
    :placeholder="$t('common.searchMenu')",
    v-model.lazy.trim="q",
    v-if="!layoutCollapse"
  )
    i.ri-search-line(slot="prefix")
  Menulist.sidebar-menu-box(
    :q="q",
    :collapse="layoutCollapse",
    @reset="reset"
  )
  .footer-box.w-100
    .collapse-btn.text-center(@click="toggleCollapse")
      i.remix(:class="layoutCollapse ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'")
      span.ml-1(v-if="!layoutCollapse") {{ $t('common.collapseSidebar') }}
</template>

<style lang="scss">
@import '~@/root';
$itemHeight: 2.5rem;
/* stylelint-disable no-descending-specificity */
.sidebar {
  background-color: $bg_white;
  padding: 65px 0 56px 0;
  border-right: 1px solid #dbdde9;
  position: relative;

  .sidebar-filter {
    margin-left: 14px;
    display: block;
    width: auto;
    .el-input__prefix {
      top: 4px;
      font-size: 18px;
    }

    .el-input__inner {
      background-color: transparent;
      padding-left: 30px;
      border: none;
      border-radius: 0;
    }
  }
  .sidebar-menu-box {
    height: calc(100% - 55px);
    overflow-y: auto;
  }

  .el-menu {
    .el-menu-item,
    .el-submenu > .el-submenu__title {
      height: $itemHeight;
      line-height: $itemHeight;
      min-width: auto;
      background-color: $bg_white;
      padding: 0 0.5rem 0 0.75rem !important;
      margin-bottom: 0.5rem;

      &:hover {
        color: $primary_color !important;
      }
      &.is-active {
        color: $primary_color !important;
        background-color: rgba($primary_color, 0.05);
        border-right: 3px solid $primary_color;
      }

      .menu-icon {
        font-size: 18px;
        margin-right: 0.5rem;
      }
    }

    .el-submenu__icon-arrow {
      right: 0.75rem;
      margin-right: 0;
    }

    .el-submenu {
      &.is-active,
      &:hover {
        > .el-submenu__title {
          .menu-icon,
          span {
            color: $primary_color !important;
          }
        }
      }
      .el-menu-item {
        padding-left: 38px !important;
      }
    }

    &.el-menu--collapse {
      width: 100%;
      margin-top: 1rem;
      .el-submenu {
        text-align: center;
        .menu-icon {
          display: block;
          margin-right: 0;
          height: 2rem;
          line-height: 2rem;
          width: 2rem;
          border-radius: 0.125rem;
        }
        &:hover {
          .menu-icon {
            color: $primary_color;
          }
        }
        &.is-active {
          .menu-icon {
            color: $font_white !important;
            background-color: $primary_color;
          }
        }
      }
    }
  }

  .footer-box {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 56px;
    line-height: 56px;
    border-top: 1px solid #dbdde9;
    .collapse-btn {
      cursor: pointer;
      &:hover {
        color: $primary_color;
      }
      i {
        font-size: 16px;
      }
    }
  }
}

.sidebar-submenu-popper {
  .el-menu {
    min-width: 150px;
    max-height: 50vh;
    overflow-y: auto;
  }
  .el-menu-item {
    height: $itemHeight;
    line-height: $itemHeight;
    background-color: $bg_white;
    padding: 0 2rem !important;

    &:hover {
      color: $primary_color !important;
    }
    &.is-active {
      color: $primary_color !important;
      background-color: rgba($primary_color, 0.05);
    }
  }
}
/* stylelint-enable */
</style>
