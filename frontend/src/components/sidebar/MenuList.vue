<script setup>
import { cloneDeep } from 'lodash'
import { computed } from 'vue'

import i18n from '@/i18n'

import { useRoute, useRouter } from 'vue-router'
import MENU from '@/menu'

import { getSidebarMenuList } from './utils'

import SidebarItem from './MenuItem.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  collapse: Boolean,
  q: String
})

const current = computed(() => route.name)

const list = computed(() => {
  return getSidebarMenuList({ list: cloneDeep(MENU) })
})

const checkNameMatch = name => {
  const text = i18n.t(`menu.${name}`).toLowerCase()
  return text.includes(props.q.toLowerCase())
}

const filtered = computed(() => {
  if (!props.q) return list.value

  const ret = []

  list.value.forEach(item => {
    const { name, sub = [], groups = [] } = item
    if (checkNameMatch(name)) {
      ret.push(item)
      return
    }

    const matchSubs = sub.filter(sitem => checkNameMatch(sitem.name))
    if (matchSubs.length) {
      ret.push({
        ...item,
        sub: sub.filter(sitem => checkNameMatch(sitem.name))
      })
    }

    const matchGroups = groups.map(gitem => {
      const subs = gitem.sub || []
      return {
        ...gitem,
        sub: subs.filter(sitem => checkNameMatch(sitem.name))
      }
    }).filter(gitem => gitem.sub.length)

    if (matchGroups.length) {
      ret.push({
        ...item,
        groups: matchGroups
      })
    }

  })

  return ret
})

const openeds = computed(() => {
  const item = filtered.value.find((item) => {
    const isSub = item.sub && item.sub.some(subItem => subItem.index === current.value)
    const isGroup = item.groups && item.name === current.value
    return isSub || isGroup
  })
  let ret = []
  if (props.q) {
    ret = filtered.value.map(item => item.index)
  } else if (item) {
    ret = [item.index]
  }
  return ret
})

const hasGroupKeys = computed(() => {
  return list.value.filter(item => item.groups).map(item => item.name)
})

const handleSelect = (key, keyPath) => {
  if (hasGroupKeys.value.includes(keyPath[0])) {
    router.push({ name: keyPath[0], params: { name: key }})
  } else {
    router.push({ name: key })
  }
}

</script>

<template lang="pug">
el-menu.sidebar-menu-box(
  :collapse="collapse",
  :collapse-transition="false",
  :default-active="current",
  :default-openeds="openeds",
  :unique-opened="true",
  @select="handleSelect"
)
  template(
    v-for="li in filtered"
  )
    el-sub-menu(
      v-if="li.sub || li.groups",
      :key="li.index",
      :index="li.index",
      :class="{ 'is-active': current === li.index }",
      popper-class="sidebar-submenu-popper"
    )
      template(#title)
        i.menu-icon(
          v-if="li.icon",
          :class="li.icon"
        )
        span {{ $t(`menu.${li.name}`) }}
      template(v-if="li.groups")
        el-menu-item-group(
          v-for="group in li.groups",
          :key="group.title",
          :title="$t(`menu.groupTitle.${group.title}`)"
        )
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
      :key="li.name",
      :data="li"
    )
</template>