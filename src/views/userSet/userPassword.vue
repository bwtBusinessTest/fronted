<template>
  <div class="user-password">
    <el-form :inline="true" :model="passWord" label-width="78px" ref="modifyUserInfoData" style="width:300px;margin:auto;" :rules="modifyPasswordRules">
		<el-form-item label="旧密码" prop="oldPassword">
			<el-input type="password" v-model="passWord.oldPassword" style="width:208px"></el-input>
		</el-form-item>
		<el-form-item label="新密码" prop="newPassword">
			<el-input type="password" v-model="passWord.newPassword" @input="inputPassword()"  style="width:208px"></el-input>
			<div>
				<password-strong-validate :password="passWord.newPassword"></password-strong-validate>
			</div>
		</el-form-item>
		<el-form-item label="确认密码" prop="ensurePassword">
			<el-input type="password" v-model="passWord.ensurePassword" @input="inputPassword()" style="width:208px"></el-input>
		</el-form-item>
	</el-form>
	<div class="dialog-footer">
		<el-button type="primary" @click="handleModifyPassword" v-if="buttonVisible['2120201']">确 定</el-button>
	</div>
  </div>
</template>


<script src="./userPassword.js"></script>

<style lang="scss" scoped>
.user-password{
	margin: 30px auto 0;
	  width: 500px;
	  box-shadow: 0 0 4px #ccc;
	  margin-top: 110px;
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
