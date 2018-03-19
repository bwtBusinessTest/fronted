<template>
	<div class="rule-manage">
		<div class="query-container">
		<el-form :inline="true" :model="form">
			<el-form-item label="规则名称">
				<el-input size="small" v-model="form.ruleName"></el-input>
			</el-form-item>
			<el-form-item label="规则状态">
				<el-select size="small" v-model="form.enableStatus">
					<el-option v-for="item in ruleStateList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="end">
			<el-col :span="3" v-if="buttonVisible['20501']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
			<el-col :span="3" v-if="buttonVisible['20502']"><el-button @click="queryRuleList" size="small" type="primary" icon="search">查询</el-button></el-col>
		</el-row>
		</div>
		
		<div class="manage-container">
		<el-row type="flex" justify="start">
			<el-col :span="2" v-if="buttonVisible['20504']"><el-button @click="dialogNewAddVisible = true" size="small" type="primary" icon="plus">新增</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20503']"><el-button @click="checkRuleInfo" size="small" type="primary" icon="check">查看</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20505']"><el-button @click="modifyRuleInfo" size="small" type="primary" icon="edit">修改</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20506']"><el-button @click="deleteBatchRuleShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20507']"><el-button @click="generateRuleJsShow" size="small" type="primary">生成js规则</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20508']"><el-button @click="viewJs" size="small" type="primary">js规则查看</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20509']"><el-button @click="jsTest" size="small" type="primary">js测试</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20510']"><el-button @click="enableBatchRuleShow" size="small" type="primary" icon="view">启用</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20511']"><el-button @click="disableBatchRuleShow" size="small" type="primary" icon="circle-close">禁用</el-button></el-col>
		</el-row>


		<el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column label="序号" prop="id">
			</el-table-column>
			<el-table-column label="规则名称" prop="ruleName">
			</el-table-column>
			<el-table-column label="规则函数名称" prop="functionName">
			</el-table-column>
			<el-table-column label="是否生成js文件" prop="createStatus">
			</el-table-column>
			<el-table-column label="生成规则路径" prop="ruleFilePath">
			</el-table-column>
			<el-table-column label="规则状态" prop="enableStatus">
			</el-table-column>
		</el-table>
		<div class="page-container">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRules" @current-change="handleCurrentChange"></el-pagination>
		</div>
		</div>

		<el-dialog title="新增规则" @close="clearNewAdd" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="newAddRuleInfoData" label-width="110px" style="width:600px;margin:auto;" :rules="newAddRuleInfoDataRules" ref="newAddRuleInfoData">
				<el-form-item label="规则名称" prop="ruleName">
					<el-input v-model="newAddRuleInfoData.ruleName" style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="规则函数名称" prop="functionName">
					<el-input v-model="newAddRuleInfoData.functionName" style="width:230px;" @input="sendValidateFunctionName('newAdd')"></el-input>
				</el-form-item>
				<el-form-item label="入参变量">
					<div v-for="(item,index) in newAddRuleInfoData.sysFunctionInParamDtos" style="margin-bottom:6px;">
						<el-select v-model="item.paramType" style="width:150px;">
							<el-option v-for="items in functionInParamTypeList" :label="items.caption" :value="items.value" :key="items.value"></el-option>
						</el-select>
						<el-input v-model="item.paramName" style="width:150px;"></el-input>
						<el-button v-if="index === 0" type="primary" class="el-icon-plus" @click="addParamsWithAddRule" style="width:50px"></el-button>
						<el-button v-if="index > 0" type="primary" class="el-icon-delete" @click="deleteParamsWithAddRule(index)" style="width:50px"></el-button>
					</div>
				</el-form-item>
				<el-form-item label="规则内容" prop="ruleContent">
					<!-- <textarea v-model="newAddRuleInfoData.ruleContent" name="ruleContent" required cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" @blur="checkNewAddRuleContentNull"></textarea> -->
					<el-input type="textarea" v-model="newAddRuleInfoData.ruleContent" cols=60 :rows="20"></el-input>
				</el-form-item>
				<!--
				<el-row>规则内容</el-row>
				<div class="ueditor-container">
					<UE :defaultMsg=defaultMsg :config=config :id="ue1" ref="ue1"></UE>
				</div>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleNewAddRule">确 定</el-button>
				<el-button @click="dialogNewAddVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="查看规则" :visible.sync="dialogCheckVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="checkRuleInfoData" label-width="110px" style="width:600px;margin:auto;" :rules="checkRuleInfoDataRules" ref="checkRuleInfoData">
				<el-form-item label="规则名称" prop="ruleName">
					<el-input v-model="checkRuleInfoData.ruleName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="规则函数名称" prop="functionName">
					<el-input v-model="checkRuleInfoData.functionName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="入参变量">
					<div v-for="(item,index) in checkRuleInfoData.sysFunctionInParamDtos" style="margin-bottom:6px;">
						<el-select v-model="item.paramType" style="width:150px;" disabled>
							<el-option v-for="items in functionInParamTypeList" :label="items.caption" :value="items.value" :key="items.value"></el-option>
						</el-select>
						<el-input v-model="item.paramName" style="width:150px;" disabled></el-input>
						<el-button v-if="index === 0" type="primary" class="el-icon-plus" style="width:50px"></el-button>
						<el-button v-if="index > 0" type="primary" class="el-icon-delete" style="width:50px"></el-button>
					</div>
				</el-form-item>
				<el-form-item label="规则内容" prop="ruleContent">
					<!--<textarea v-model="checkRuleInfoData.ruleContent" name="templateContent" required cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" disabled="disabled"></textarea>-->
					<el-input type="textarea" v-model="checkRuleInfoData.ruleContent" cols=60 :rows="20" disabled></el-input>
				</el-form-item>
				<!--
				<el-row>规则内容</el-row>
				<div class="ueditor-container" style="height:460px;overflow-y:auto;">
					<UE :defaultMsg="checkRuleInfoData.ruleContent" :config=config :id="ue2" ref="ue2" prop="ruleContent"></UE>
				</div>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
				<el-button @click="dialogCheckVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="修改规则" :visible.sync="dialogModifyVisible" :close-on-click-modal="false" class="customer-width" @close="clearModifyRuleInfoData" @open="openNewAddModal">
			<el-form :model="modifyRuleInfoData" label-width="110px" style="width:600px;margin:auto;" :rules="modifyRuleInfoDataRules" ref="modifyRuleInfoData">
				<el-form-item label="规则名称" prop="ruleName">
					<el-input v-model="modifyRuleInfoData.ruleName" style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="规则函数名称" prop="functionName">
					<el-input v-model="modifyRuleInfoData.functionName" style="width:230px;" @input="sendValidateFunctionName('modify')"></el-input>
				</el-form-item>
				<el-form-item label="入参变量">
					<div v-for="(item,index) in modifyRuleInfoData.sysFunctionInParamDtos" style="margin-bottom:6px;">
						<el-select v-model="item.paramType" style="width:150px;">
							<el-option v-for="items in functionInParamTypeList" :label="items.caption" :value="items.value" :key="items.value"></el-option>
						</el-select>
						<el-input v-model="item.paramName" style="width:150px;"></el-input>
						<el-button v-if="index === 0" type="primary" class="el-icon-plus" @click="addParamsWithModifyRule" style="width:50px"></el-button>
						<el-button v-if="index > 0" type="primary" class="el-icon-delete" @click="deleteParamsWithModifyRule(index)" style="width:50px"></el-button>
					</div>
				</el-form-item>
				<el-form-item label="规则内容" prop="ruleContent">
					<!--<textarea v-model="modifyRuleInfoData.ruleContent" name="ruleContent" required cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" @blur="checkModifyRuleContentNull"></textarea>-->
					<el-input type="textarea" v-model="modifyRuleInfoData.ruleContent" cols=60 :rows="20"></el-input>
				</el-form-item>
				<!--
				<el-row>规则内容</el-row>
				<div class="ueditor-container" style="height:460px;overflow-y:auto;">
					<UE :defaultMsg="modifyRuleInfoData.ruleContent" :config=config :id="ue3" ref="ue3"></UE>
				</div>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleModifyRule">确 定</el-button>
				<el-button @click="dialogModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="js规则查看" :visible.sync="dialogViewJsVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="viewJsData" label-width="110px" style="width:600px;margin:auto;">
				<el-form-item label="规则名称">
					<el-input v-model="viewJsData.ruleName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="规则内容" prop="ruleContent">
					<!--<textarea v-model="viewJsData.ruleContent" name="ruleContent" required cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" disabled="disabled"></textarea>-->
					<el-input type="textarea" v-model="viewJsData.ruleContent" cols=60 :rows="20" disabled></el-input>
				</el-form-item>
				<!--
				<el-row>规则内容</el-row>
				<div class="ueditor-container">
					<UE :defaultMsg="viewJsData.ruleContent" :config=config :id="ue4" ref="ue4"></UE>
				</div>
				-->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogViewJsVisible = false">确 定</el-button>
				<el-button @click="dialogViewJsVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="js规则测试" @close="clearJsTest" :visible.sync="dialogJsTestVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="jsTestData" label-width="110px" style="width:600px;margin:auto;">
				<el-form-item label="规则名称">
					<el-input v-model="jsTestData.ruleName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="规则函数名称">
					<el-input v-model="jsTestData.functionName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item label="入参变量">
					<div v-for="(item,index) in jsTestData.sysFunctionInParamDtos" style="margin-bottom:6px;">
						<el-select v-model="item.paramType" style="width:150px;" disabled >
							<el-option v-for="items in functionInParamTypeList" :label="items.caption" :value="items.value" :key="items.value"></el-option>
						</el-select>
						<el-input v-model="item.paramName" style="width:150px;" disabled></el-input>
						<el-button v-if="index === 0" type="primary" class="el-icon-plus" style="width:50px"></el-button>
						<el-button v-if="index > 0" type="primary" class="el-icon-delete" style="width:50px"></el-button>
					</div>
				</el-form-item>
				<el-form-item label="规则内容" prop="ruleContent">
					<!--<textarea v-model="jsTestData.ruleContent" name="ruleContent" required cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" disabled="disabled"></textarea>-->
					<el-input type="textarea" v-model="jsTestData.ruleContent" cols=60 :rows="20" disabled></el-input>
				</el-form-item>
				<!--
				<el-row>规则内容</el-row>
				<div class="ueditor-container">
					<UE :defaultMsg="jsTestData.ruleContent" :config=config :id="ue5" ref="ue5"></UE>
					
				</div>
				-->
				<el-form-item label="输入参数" prop="inParam">
					<el-input v-model="jsTestData.inParam" style="width:300px"></el-input>
					多个参数用逗号隔开
				</el-form-item>
				<el-form-item label="返回内容" prop="response">
					<el-input type="textarea" v-model="jsTestData.response" cols=60 :rows="3" style="width:300px"></el-input>
					<!--<el-input v-model="jsTestData.response" style="width:300px" :rows="3"></el-input>-->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="test">测 试</el-button>
				<el-button @click="dialogJsTestVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="启用规则" :visible.sync="dialogEnabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否启用对应的规则？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleEnableRule">确 定</el-button>
				<el-button @click="dialogEnabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="禁用规则" :visible.sync="dialogDisabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否禁用对应的规则？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDisableRule">确 定</el-button>
				<el-button @click="dialogDisabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		
		<el-dialog title="删除规则" :visible.sync="dialogDeleteVisible" class="reset-dialog-width" :close-on-click-modal="false" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p>确认是否删除对应的规则？</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDeleteRule">确 定</el-button>
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="生成js规则" :visible.sync="dialogGenerateJsVisible" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否生成该规则js文件？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleGenerateRuleJs">确 定</el-button>
				<el-button @click="dialogGenerateJsVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script src="./action.js"></script>


<style lang="scss">
	@import '../../styles/common.scss';
	.rule-manage{
		margin: 30px auto 0;
		width: 1160px;
		padding: 0 10px;
		.ueditor-container{
			margin-top: 20px;
		}
		.manage-container{
			.el-col{
				margin-right: 30px;
			}
		}
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