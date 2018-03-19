<template>
  <el-breadcrumb class="app-levelbar" separator="/">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
      <!-- <router-link v-if='item.redirect==="noredirect"||index==levelList.length-1 || noClickLevelbar' to="" class="no-redirect">{{item.name}}</router-link>
      <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link> -->
      <span v-if="item.name === '订单明细'">团购订单／</span>
      <span>{{item.name}}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && (first.name !== 'Home' || first.path !== '')) {
        matched = [{ name: 'Home', path: '/' }].concat(matched)
      }
      this.levelList = matched
    }
  },
  computed: {
    noClickLevelbar() {
      return this.levelList.some(e => {
        return e.name === '订单明细';
      });
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-levelbar.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  .el-breadcrumb__item{
    .el-breadcrumb__item__inner{
      span{
        color: #97a8be;
        cursor: text;
      }
    }
  }
}
</style>
