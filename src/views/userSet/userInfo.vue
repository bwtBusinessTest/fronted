<template>
  <div class="user-info">
    <el-form :inline="true" :model="modifyUserInfoData" label-width="78px" ref="modifyUserForm" style="width:580px;margin:auto;" :rules="modifyUserRules">
		<el-form-item label="用户名称" prop="userName">
			<el-input v-model="modifyUserInfoData.userName" @input="sendValidateUser('modify')" disabled></el-input>
		</el-form-item>
		<el-form-item label="用户姓名" prop="realName">
			<el-input v-model="modifyUserInfoData.realName"></el-input>
		</el-form-item>
		<el-form-item label="手机号码" prop="mobile">
			<el-input v-model="modifyUserInfoData.mobile"></el-input>
		</el-form-item>
		<el-form-item label="联系电话" prop="phone">
			<el-input v-model="modifyUserInfoData.phone"></el-input>
		</el-form-item>
		<el-form-item label="电子邮件" prop="email">
			<el-input v-model="modifyUserInfoData.email"></el-input>
		</el-form-item>
		<el-form-item label="备注" prop="remark">
			<el-input v-model="modifyUserInfoData.remark"></el-input>
		</el-form-item>
	</el-form>
	<div class="dialog-footer">
		<el-button type="primary" @click="handleModifyUser" v-if="buttonVisible['2120102']">确 定</el-button>
	</div>
  </div>
</template>


<script src="./userInfo.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.user-info{
  margin: 30px auto 0;
  width: 620px;
  box-shadow: 0 0 4px #ccc;
  margin-top: 90px;
  padding: 10px;
  .dialog-footer{
  	margin-top: 20px;
  	text-align: center;
  	button{
  		width: 170px;
  	}
  }
}
</style>
