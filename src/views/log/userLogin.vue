<template>
	<div class="user-login">
		<div class="query-container">
		    <el-form :inline="true" :model="form">
			    <el-form-item label="操作用户">
					<el-input size="small" v-model="form.createUser" style="width:193px;"></el-input>
				</el-form-item>
				<el-form-item label="登陆类型">
					<el-select size="small" v-model="form.loginType">
						<el-option v-for="item in loginTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="ip地址">
					<el-input size="small" v-model="form.ipAddress"></el-input>
				</el-form-item>
				<el-form-item label="开始时间">
					<el-date-picker
				      v-model="form.searchFirstTime"
				      type="datetime"
				      placeholder="选择日期时间"
				      size="small">
				    </el-date-picker>
				</el-form-item>
			  	<el-form-item label="结束时间">
				    <el-date-picker
				      v-model="form.searchLastTime"
				      type="datetime"
				      placeholder="选择日期时间"
				      size="small">
				    </el-date-picker>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-col :span="3" v-if="buttonVisible['2100101']">
					<el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button>
				</el-col>
				<el-col :span="2" v-if="buttonVisible['2100102']">
					<el-button @click="queryLoginLogList" size="small" type="primary" icon="search">查询</el-button>
				</el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-table :data="tableData" border height="380" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
				<el-table-column label="序号" prop="sno">
				</el-table-column>
				<el-table-column label="登录用户" prop="createUser">
				</el-table-column>
				<el-table-column label="类型" prop="loginType">
				</el-table-column>
				<el-table-column label="登录/退出时间" prop="createTime">
				</el-table-column>
				<el-table-column label="操作ip地址" prop="ipAddress">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
  	</div>
</template>

<script src="./userLogin.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.user-login{
	margin: 30px auto 0;
    width: 1120px;
}
</style>