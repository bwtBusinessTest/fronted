<template>
  <div class='tabs-view-container'>
    <router-link class="tabs-view" v-for="tag in Array.from(visitedViews)" :to="tag.path" :key="tag.path" v-if="!hiddenTab(tag.name)">
      <el-tag :closable="true" :type="isActive(tag.path)?'success':''" @close='closeViewTabs(tag,$event)' size="small">
        {{tag.name}}
      </el-tag>
    </router-link>
  </div>
</template>

<script>
export default {
  computed: {
    visitedViews() {
      return this.$store.state.app.visitedViews.slice(-6)
    }
  },
  methods: {
    closeViewTabs(view, $event) {
      this.$store.dispatch('delVisitedViews', view).then((views) => {
        if (this.isActive(view.path)) {
          const latestView = views.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView.path)
          } else {
            this.$router.push('/')
          }
        }
      })
      $event.preventDefault()
    },
    generateRoute() {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    addViewTabs() {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      if (route.name !== '活动创建') {
        this.$store.dispatch('addVisitedViews', this.generateRoute())
      }
    },
    isActive(path) {
      return path === this.$route.path
    },
    hiddenTab(name) {
      return ['订单明细', '活动创建', '活动详情及修改', '卡bin详情及修改', '添加广告', '修改广告', '申请审核', '广告投放设置'].some(el => {
        return el === name;
      });
    }
  },
  watch: {
    $route() {
      this.addViewTabs()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .tabs-view-container {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    .tabs-view {
      margin-left: 10px;
    }
  }
</style>
