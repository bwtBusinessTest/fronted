<template>
	<div class="system-operate">
		<div class="query-container">
		    <el-form :inline="true" :model="form">
			    <el-form-item label="操作用户">
					<el-input size="small" v-model="form.createUser" style="width:193px;"></el-input>
				</el-form-item>
				<el-form-item label="业务模块">
					<el-select size="small" v-model="form.menuCode" filterable clearable @change="menuChange">
						<el-option v-for="item in options" :key="item.id" :label="item.menuName" :value="item.menuCode">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="业务标识">
					<el-select size="small" v-model="form.businFlag" filterable clearable>
						<el-option v-for="item in businFlagOptions" :key="item.id" :label="item.businCaption" :value="item.businFlag">
						</el-option>
					</el-select>
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
			    <el-form-item label="操作内容">
					<el-input size="small" v-model="form.operContent" style="width:194px;"></el-input>
				</el-form-item>
				<el-form-item label="操作ip地址">
					<el-input size="small" v-model="form.ipAddress"></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-col :span="3" v-if="buttonVisible['2100201']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['2100202']"><el-button @click="queryOperLogList" size="small" type="primary" icon="search">查询</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-table :data="tableData" border height="380" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
				<el-table-column label="序号" prop="sno">
				</el-table-column>
				<el-table-column label="登录用户" prop="createUser">
				</el-table-column>
				<el-table-column label="业务模块" prop="menuName">
				</el-table-column>
				<el-table-column label="操作类型" prop="businCaption">
				</el-table-column>
				<el-table-column label="操作内容" prop="operContent" show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="操作时间" prop="createTime" width="170">
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

<script src="./systemOperate.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.system-operate{
	margin: 30px auto 0;
    width: 1120px;
}
</style>