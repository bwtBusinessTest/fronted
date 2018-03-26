<template>
	<div class="file-config">
		<div class="manage-container">
			<el-row type="flex" justify="start">
				<el-col :span="2" v-if="buttonVisible['20901']"><el-button @click="insertFileConfigShow" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20902']"><el-button @click="updateFileConfigShow" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20904']"><el-button @click="deleteBatchFileConfigShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
			</el-row>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" height="500" style="width: 100%" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
				<el-table-column type="selection">
			    </el-table-column>
				<el-table-column label="配置类型" prop="configFtpType" width="130">
				</el-table-column>
				<el-table-column label="生成路径" prop="ftpPath" width="160" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="访问路径" prop="visitPath" width="160" :show-overflow-tooltip="true">
				</el-table-column>
				<el-table-column label="创建人" prop="createUser" width="120">
				</el-table-column>
				<el-table-column label="创建时间" prop="createTime" width="180">
				</el-table-column>
				<el-table-column label="修改人" prop="updateUser" width="120">
				</el-table-column>
				<el-table-column label="修改时间" prop="updateTime" width="180">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[20, 50, 100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="新增文件配置" :visible.sync="dialogInsertVisible" @close="closeInsert" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="insertFileConfigInfo" style="width:300px;margin:auto;" :rules="addFileConfigRules" ref="insertForm">
				<el-form-item label="配置类型" prop="configFtpType">
					<el-select v-model="insertFileConfigInfo.configFtpType">
	  					<el-option v-for="item in configTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="生成路径" prop="ftpPath">
					<el-input v-model="insertFileConfigInfo.ftpPath" style="width:195px;"></el-input>
				</el-form-item>
				<el-form-item label="访问路径" prop="visitPath">
					<el-input v-model="insertFileConfigInfo.visitPath" style="width:195px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeInsert">取 消</el-button>
    			<el-button type="primary" @click="insertFileConfig">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改文件配置" :visible.sync="dialogUpdateVisible" @close="closeUpdate" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="updateFileConfigInfo" style="width:300px;margin:auto;" :rules="updateFileConfigRules" ref="updateForm">
				<el-form-item label="配置类型" prop="configFtpType">
					<el-select v-model="updateFileConfigInfo.configFtpType">
	  					<el-option v-for="item in configTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="生成路径" prop="ftpPath">
					<el-input v-model="updateFileConfigInfo.ftpPath" style="width:195px;"></el-input>
				</el-form-item>
				<el-form-item label="访问路径" prop="visitPath">
					<el-input v-model="updateFileConfigInfo.visitPath" style="width:195px;"></el-input>
				</el-form-item>	
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeUpdate">取 消</el-button>
    			<el-button type="primary" @click="updateFileConfig">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="删除文件配置" :visible.sync="dialogDeleteVisible" class="reset-dialog-width" :close-on-click-modal="false" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p>请你确认是否删除？</p>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
    			<el-button type="primary" @click="deleteBatchFileConfig">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.file-config{
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
}
</style>