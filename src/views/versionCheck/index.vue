<template>
  <div class="version-check">
    <el-form ref="form" :model="form" label-width="130px" size="small" style="width:500px;margin:auto;" label-position="right">
      <el-form-item label="当前版本号">
        <el-input v-model="form.curVersionNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="当前版本更新时间">
        <el-input v-model="form.curPublishDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="上个版本号">
        <el-input v-model="form.preVersionNo" disabled></el-input>
      </el-form-item>
      <el-form-item label="上个版本更新时间">
        <el-input v-model="form.prePublishDate" disabled></el-input>
      </el-form-item>
      <el-form-item label="更新内容">
        <el-input type="textarea" v-model="form.curVersionContent" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>


<script src="./versionAction.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.version-check{
  margin: 30px auto 0;
  width: 680px;
  box-shadow: 0 0 4px #ccc;
  margin-top: 90px;
  padding: 10px
}
</style>
