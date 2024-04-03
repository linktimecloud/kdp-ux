<script>
import { cloneDeep } from 'lodash'
import { mapGetters } from 'vuex'

import MENU from '@/menu'

import SidebarItem from './item'

import { getSidebarMenuList } from './utils'

export default {
  name: 'sidebar-menu',
  props: {
    q: {
      type: String,
      default: ''
    },
    collapse: {
      type: Boolean,
      requied: true
    },
    collapseTransition: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'isAdmin',
      'isRoot',
      'isOrgRole',
      'isOrgAdmin'
    ]),
    routeName () {
      return this.$route.name
    },
    current () {
      return this.routeName
    },
    openeds () {
      const q = this.q
      const filtered = this.filtered || []
      const current = this.current
      // const runningapps = this.runningapps
      const item = filtered.find(item => {
        const isSub = item.sub && item.sub.some(subItem => subItem.index === current)
        const isGroup = item.groups && item.name === current
        return isSub || isGroup
      })
      let ret = []
      if (q) {
        ret = filtered.map(item => item.index)
      } else if (item) {
        ret = [item.index]
      }
      return ret
    },
    list () {
      const { isAdmin, isRoot, isOrgRole, isOrgAdmin } = this
      return getSidebarMenuList({ list: cloneDeep(MENU), isAdmin: isAdmin || isRoot, isOrgRole, isOrgAdmin })
    },
    filtered () {
      const self = this
      let q = self.q || ''
      let ret = cloneDeep(self.list)
      if (q) {
        q = q.toLowerCase()
        ret = ret.filter(item => {
          const name = item.name
          const sub = item.sub || []
          const groups = item.groups || []
          const text = self.$t(`menu.${name}`).toLowerCase()
          return text.includes(q) || sub.some(sitem => {
            const sname = sitem.name
            const stext = self.$t(`menu.${sname}`).toLowerCase()
            return stext.includes(q)
          }) || groups.some(gitem => {
            // 针对核心组件中的app名称 匹配name
            const apps = gitem.sub || []
            return apps.some(app => app.name.toLowerCase().includes(q))
          })
        }).map(item => {
          if (item.sub && item.sub.length) {
            item.sub = item.sub.filter(sitem => {
              const sname = sitem.name
              const stext = self.$t(`menu.${sname}`).toLowerCase()
              return stext.includes(q)
            })
          }
          // 针对核心组件中的app名称 匹配name
          if (item.groups && item.groups.length) {
            item.groups = item.groups.map(gitem => {
              const apps = gitem.sub || []
              return {
                ...gitem,
                sub: apps.filter(app => app.name.toLowerCase().includes(q))
              }
            })
          }
          return item
        })
      }
      return ret
    },
    route () {
      return this.$route
    },
    hasGroup () {
      return this.list.filter(item => item.groups).map(item => item.name)
    }
  },
  components: {
    SidebarItem
  },
  methods: {
    handleSelect (key, keyPath) {
      const self = this
      if (this.hasGroup.includes(keyPath[0])) {
        self.$router.push({
          name: keyPath[0],
          params: { name: key }
        })
      } else {
        self.$router.push({ name: key })
      }
    }
  }
}
</script>

<template lang="pug">
el-menu.border-0(
  text-color="#595959",
  active-text-color="#fff",
  :collapse="collapse",
  :collapse-transition="collapseTransition",
  :default-active="current",
  :default-openeds="openeds",
  :unique-opened="true",
  @select="handleSelect",
  v-if="filtered"
)
  template(
    v-for="li in filtered"
  )
    el-submenu(
      v-if="li.sub || li.groups",
      :index="li.index",
      :class="{ 'is-active': current === li.index }",
      popper-class="sidebar-submenu-popper"
    )
      template(slot="title")
        i.menu-icon(:class="li.icon", v-if="li.icon")
        span.text-high(slot="title") {{ $t(`menu.${li.name}`) }}
      template(v-if="li.groups")
        el-menu-item-group(
          v-for="group in li.groups",
          :key="group.title"
        )
          template(slot="title")
            span(v-if="group.sub && group.sub.length") {{ $t(`menu.groupTitle.${group.title}`) }}
          SidebarItem(
            v-for="item in group.sub"
            :key="item.index || item.name",
            :data="item",
            :class="{ 'is-active': route.params.name === item.index }"
          )
      template(v-else)
        SidebarItem(
          v-for="item in li.sub"
          :key="item.index || item.name",
          :class="{ 'is-active': current === item.index }"
          :data="item"
        )
    SidebarItem(
      v-else,
      :data="li"
    )
</template>
