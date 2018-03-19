<template>
	<div class="dataDic-Manage">
		<div class="query-container">
			<el-form :inline="true" :model="form">
				<el-form-item label="字典编号">
					<el-input size="small" v-model="form.code"></el-input>
				</el-form-item>
				<el-form-item label="字典值">
					<el-input size="small" v-model="form.value"></el-input>
				</el-form-item>
				<el-form-item label="字典名称">
					<el-input size="small" v-model="form.caption"></el-input>
				</el-form-item>	
			</el-form>
			<el-row type="flex" justify="end">
				<el-col :span="3" v-if="buttonVisible['20601']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20602']"><el-button @click="queryDictList" size="small" type="primary" icon="search">查询</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-row type="flex" justify="">
				<el-col :span="2" v-if="buttonVisible['20603']"><el-button @click="getBeanDict" size="small" type="primary" icon="check">查看</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20604']"><el-button @click="insertDictShow" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20605']"><el-button @click="updateDictShow" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20610']"><el-button @click="deleteBatchDictShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20607']"><el-button @click="showBatchDictShow" size="small" type="primary" icon="menu">字典显示</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20608']"><el-button @click="hideBatchDictShow" size="small" type="primary" icon="minus">字典隐藏</el-button></el-col>
			</el-row>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" height="400" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
				<el-table-column type="selection">
			    </el-table-column>
				<el-table-column label="字典编号" prop="code">
				</el-table-column>
				<el-table-column label="字典值" prop="value">
				</el-table-column>
				<el-table-column label="字典名称" prop="caption">
				</el-table-column>
				<el-table-column label="是否隐藏" prop="status">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="查看字典" :visible.sync="dialogCheckVisible" :close-on-click-modal="false" class="reAdd-width" @open="openNewAddModal">
			<el-form :inline="true" :model="dictInfo" style="width:600px;margin:auto;" :rules="viewRules" label-width="100px">
				<el-form-item label="字典编号" prop="code">
					<el-input v-model="dictInfo.code" disabled></el-input>
				</el-form-item>
				<el-form-item label="字典值" prop="value">
					<el-input v-model="dictInfo.value" disabled></el-input>
				</el-form-item>
				<el-form-item label="字典名称" prop="caption">
					<el-input v-model="dictInfo.caption" disabled></el-input>
				</el-form-item>
				<el-form-item label="是否隐藏" prop="status">
					<el-input v-model="dictInfo.status" disabled></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>

		<el-dialog title="新增字典" :visible.sync="dialogInsertVisible" @close="closeInsert" :close-on-click-modal="false" class="reAdd-width" @open="openNewAddModal">
			<el-form :inline="true" :model="insertDictInfo" style="width:600px;margin:auto;" :rules="addRules" ref="insertForm" label-width="78px">
				<el-form-item label="字典编号" prop="code">
					<el-input v-model="insertDictInfo.code" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="字典值" prop="value">
					<el-input v-model="insertDictInfo.value" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="字典名称" prop="caption">
					<el-input v-model="insertDictInfo.caption" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="是否隐藏" prop="status">
					<el-select v-model="insertDictInfo.status">
	  					<el-option label="是" value="0"></el-option>
						<el-option label="否" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="insertDict">确 定</el-button>
				<el-button @click="closeInsert">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改字典" :visible.sync="dialogUpdateVisible" @close="closeUpdate" :close-on-click-modal="false" class="reAdd-width" @open="openNewAddModal">
			<el-form :inline="true" :model="updateDictInfo" style="width:600px;margin:auto;" :rules="updateRules" ref="updateForm" label-width="77px">
				<el-form-item label="字典编号" prop="code">
					<el-input v-model="updateDictInfo.code" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="字典值" prop="value">
					<el-input v-model="updateDictInfo.value" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="字典名称" prop="caption">
					<el-input v-model="updateDictInfo.caption" style="width:195px"></el-input>
				</el-form-item>
				<el-form-item label="是否隐藏" prop="status">
					<el-select v-model="updateDictInfo.status">
	  					<el-option label="是" value="0"></el-option>
						<el-option label="否" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="updateDict">确 定</el-button>
				<el-button @click="closeUpdate">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
@import '../../styles/common.scss';
.dataDic-Manage{
	margin: 30px auto 0;
    width: 1120px;
    .manage-container{
    	.el-col{
    		margin-right: 30px;
    	}
    }
    .el-dialog__wrapper{
		top: 50px;
		left: 200px;
	}
	.reAdd-width{
		.el-dialog{
			width: 600px;
		}
	}
}
</style>
