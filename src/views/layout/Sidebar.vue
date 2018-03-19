<template>
  <el-menu mode="vertical" background-color="#324157" text-color="#bfcbd9" unique-opened :default-active="$route.path" :collapse="isCollapse" style="z-index:2100;">
    <sidebar-item :routes="permission_routers"></sidebar-item>
  </el-menu>
</template>

<script>
import SidebarItem from './SidebarItem'
import { mapGetters } from 'vuex'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routers'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
