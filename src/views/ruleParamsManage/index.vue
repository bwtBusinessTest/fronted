<template>
	<div class="rule-params-manage">
		<div class="query-container">
		<el-form :inline="true" :model="form" style="width:1072px;margin:auto;">
			<el-form-item label="规则参数名称">
				<el-input size="small" v-model="form.paramName" style="width:150px;" ></el-input>
			</el-form-item>
			<el-form-item label="规则变量名称">
				<el-input size="small" v-model="form.variableName" style="width:150px;"></el-input>
			</el-form-item>
			<el-form-item label="规则参数类型">
				<el-select size="small" v-model="form.paramType" style="width:150px;">
					<el-option v-for="item in ruleParamsTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="规则参数状态">
				<el-select size="small" v-model="form.status" style="width:150px;">
					<el-option v-for="item in ruleParamsStateList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row type="flex" style="width:1072px;" justify="end">
			<el-col :span="3" v-if="buttonVisible['20401']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20402']"><el-button @click="queryRuleParamList" size="small" type="primary" icon="search">查询</el-button></el-col>
		</el-row>
		</div>

		<div class="manage-container">
		<el-row type="flex" justify="start">
			<el-col :span="3" v-if="buttonVisible['20404']"><el-button @click="dialogNewAddVisible = true" size="small" type="primary" icon="plus">新增</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20403']"><el-button @click="checkRuleParamInfo" size="small" type="primary" icon="check">查看</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20405']"><el-button @click="modifyRuleParamInfo" size="small" type="primary" icon="edit">修改</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20406']"><el-button @click="deleteBatchRuleParamShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20407']"><el-button @click="enableBatchRuleParamShow" size="small" type="primary" icon="view">启用</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20408']"><el-button @click="disableBatchRuleParamShow" size="small" type="primary" icon="circle-close">禁用</el-button></el-col>
		</el-row>


		<el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column label="序号" prop="id">
			</el-table-column>
			<el-table-column label="规则参数名称" prop="paramName">
			</el-table-column>
			<el-table-column label="规则变量名称" prop="variableName">
			</el-table-column>
			<el-table-column label="规则参数类型" prop="paramType">
			</el-table-column>
			<el-table-column label="规则参数状态" prop="status">
			</el-table-column>
		</el-table>
		<div class="page-container">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRuleParams" @current-change="handleCurrentChange"></el-pagination>
		</div>
		</div>

		<el-dialog title="新增规则参数" @close="clearNewAdd" @open="openNewAddModal" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false" class="customer-width">
			<el-form :model="newAddRuleParam" :inline="true" label-width="110px" style="width:600px;margin:auto;" :rules="newAddRuleParamRules" ref="newAddRuleParam">
				<el-form-item label="规则参数类型" prop="paramType">
					<el-select size="small" v-model="newAddRuleParam.paramType" style="width:150px;">
						<el-option v-for="item in ruleParamsTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规则参数名称" prop="paramName">
					<el-input v-model="newAddRuleParam.paramName" style="width:150px;"></el-input>
				</el-form-item>
				<el-form-item label="规则变量名称" prop="variableName">
					<el-input v-model="newAddRuleParam.variableName" style="width:150px;" @input="sendValidateVariableName('newAdd')"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="newAddRuleParam.remark" style="width:150px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleNewAddRuleParam">确 定</el-button>
				<el-button @click="dialogNewAddVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="查看规则参数" :visible.sync="dialogCheckVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="checkRuleParamInfoData" :inline="true" label-width="110px" style="width:600px;margin:auto;" :rules="checkRuleParamInfoDataRules" ref="checkRuleParamInfoData">
				<el-form-item label="规则参数类型" prop="paramType">
					<el-select size="small" v-model="checkRuleParamInfoData.paramType" style="width:150px;" disabled>
						<el-option v-for="item in ruleParamsTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="规则参数名称" prop="paramName">
					<el-input v-model="checkRuleParamInfoData.paramName" disabled style="width:150px;"></el-input>
				</el-form-item>
				<el-form-item label="规则变量名称" prop="variableName">
					<el-input v-model="checkRuleParamInfoData.variableName" disabled style="width:150px;"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="checkRuleParamInfoData.remark" disabled style="width:150px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
				<el-button @click="dialogCheckVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改规则参数" :visible.sync="dialogModifyVisible" :close-on-click-modal="false" @close="clearModifyRuleParamInfoData" @open="openNewAddModal" class="customer-width">
			<el-form :model="modifyRuleParamInfoData" :inline="true" label-width="110px" style="width:600px;margin:auto;" :rules="modifyRuleParamInfoDataRules" ref="modifyRuleParamInfoData">
				<el-form-item label="规则参数类型" prop="paramType">
					<el-select size="small" v-model="modifyRuleParamInfoData.paramType" style="width:150px;">
						<el-option v-for="item in ruleParamsTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="规则参数名称" prop="paramName">
					<el-input v-model="modifyRuleParamInfoData.paramName" style="width:150px;" @input="sendValidateVariableName('modify')"></el-input>
				</el-form-item>
				<el-form-item label="规则变量名称" prop="variableName">
					<el-input v-model="modifyRuleParamInfoData.variableName" style="width:150px;"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="modifyRuleParamInfoData.remark" style="width:150px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleModifyRuleParam">确 定</el-button>
				<el-button @click="dialogModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="删除规则参数" :visible.sync="dialogDeleteVisible" class="reset-dialog-width" :close-on-click-modal="false" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p>确认是否删除该规则参数？</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDeleteRuleParam">确 定</el-button>
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		

		<el-dialog title="启用规则参数" :visible.sync="dialogEnabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否启用该规则参数？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleEnableRuleParam">确 定</el-button>
				<el-button @click="dialogEnabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="禁用规则参数" :visible.sync="dialogDisabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否禁用该规则参数？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDisableRuleParam">确 定</el-button>
				<el-button @click="dialogDisabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script src="./action.js"></script>


<style lang="scss" scoped>
	@import '../../styles/common.scss';
	.rule-params-manage{
		margin: 30px auto 0;
		width: 1160px;
		padding: 0 10px;
		.customer-width{
			.el-dialog {
				width: 60%;
			}
		}
		.el-dialog__wrapper{
			top: 50px;
			left: 200px;
		}
	}
</style>