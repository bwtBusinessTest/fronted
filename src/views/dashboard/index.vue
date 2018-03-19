<template>
  <div class="dashboard-container">
    <img class="dahsboard-img" src="../../assets/image/headPic.png" alt="图片加载失败">
    <div class='dashboard-text-name'>{{name}}</div>
    <div class='dashboard-text-role'><span>{{role}}</span></div>
  </div>
</template>

<script>
import { mapGetters} from 'vuex';
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  data() {
    return {
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    width:200px;
    text-align: center;
    margin:150px auto;
  }
  &-text-name {
    font-size: 25px;
    line-height: 30px;
  }
  &-text-role {
    font-size: 14px;
    line-height: 20px;
    color:#ccc;
  }
  &-img{
      width: 80px;
      margin-bottom:10px;
  }
}

</style>
