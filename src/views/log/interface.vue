<template>
	<div class="interface">
		<div class="query-container">
		    <el-form :inline="true" :model="form" label-width="129px" label-position="right">
			    <el-form-item label="分销商appid">
					<el-input size="small" v-model="form.appId"></el-input>
				</el-form-item>
				<el-form-item label="接口调用sequence">
					<el-input size="small" v-model="form.sequence" style="width:194px;"></el-input>
				</el-form-item>
				<el-form-item label="请求方IP">
					<el-input size="small" v-model="form.remoteIp"></el-input>
				</el-form-item>	
				<el-form-item label="调用接口名称">
					<el-input size="small" v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="接口调用状态">
					<el-select size="small" v-model="form.status">
						<el-option v-for="item in statusList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-col :span="3" v-if="buttonVisible['2100301']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['2100302']"><el-button @click="queryApiLogList" size="small" type="primary" icon="search">查询</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-table :data="tableData" border height="500" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData" @cell-dblclick="copyCellContent">
				<el-table-column label="序号" prop="sno" width="72">
				</el-table-column>
				<el-table-column label="分销商appid" prop="appId" :show-overflow-tooltip="true" width="120">
				</el-table-column>
				<el-table-column label="接口调用sequence" prop="sequence" :show-overflow-tooltip="true" width="162">
				</el-table-column>
				<el-table-column label="请求方IP" prop="remoteIp" :show-overflow-tooltip="true" width="123">
				</el-table-column>
				<el-table-column label="调用接口名称" prop="name" :show-overflow-tooltip="true" width="121">
				</el-table-column>
				<el-table-column label="公共请求参数" prop="requestHeader" :show-overflow-tooltip="true" width="121">
				</el-table-column>
				<el-table-column label="接口参数" prop="parameter" :show-overflow-tooltip="true" width="121">
				</el-table-column>
				<el-table-column label="接口回复数据" prop="response" :show-overflow-tooltip="true" width="121">
				</el-table-column>
				<el-table-column label="接口调用状态" prop="status" width="121">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[20, 50, 100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
  	</div>
</template>

<script src="./interface.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.interface{
	margin: 30px auto 0;
    width: 1120px;
}
</style>