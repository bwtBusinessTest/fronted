<template>
	<div class="template-manage">
		<div class="query-container">
		<el-form :inline="true" :model="form">
			<el-form-item label="模板类型">
				<el-select size="small" v-model="form.templateType">
					<el-option v-for="item in templateTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="模板名称">
				<el-input size="small" v-model="form.templateName"></el-input>
			</el-form-item>
			<el-form-item label="模板状态">
				<el-select size="small" v-model="form.templateState">
					<el-option v-for="item in templateStateList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row type="flex" justify="end">
			<el-col :span="3" v-if="buttonVisible['20301']"><el-button size="small" @click="clearQueryParams" type="primary" icon="delete">清空</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20302']"><el-button size="small" @click="queryTemplateList" type="primary" icon="search">查询</el-button></el-col>
		</el-row>
		</div>

		<div class="manage-container">
		<el-row type="flex" justify="start">
			<el-col :span="2" v-if="buttonVisible['20304']"><el-button @click="dialogNewAddVisible = true" size="small" type="primary" icon="plus">新增</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20303']"><el-button @click="checkTemplateInfo" size="small" type="primary" icon="check">查看</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20305']"><el-button @click="modifyTemplateInfo" size="small" type="primary" icon="edit">修改</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20306']"><el-button @click="deleteBatchTemplateShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20307']"><el-button @click="createTemplateShow" size="small" type="primary">生成H5页面</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20308']"><el-button @click="previewTemplateShow" size="small" type="primary">预览</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20309']"><el-button @click="enableBatchTemplateShow" size="small" type="primary" icon="view">启用</el-button></el-col>
			<el-col :span="2" v-if="buttonVisible['20310']"><el-button @click="disableBatchTemplateShow" size="small" type="primary" icon="circle-close">禁用</el-button></el-col>
		</el-row>

		<el-table :data="tableData" border @selection-change="handleSelectionChange" style="width: 100%" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData" height="500">
			<el-table-column type="selection">
			</el-table-column>
			<el-table-column label="模板编号" prop="id">
			</el-table-column>
			<el-table-column label="模板名称" prop="templateName">
			</el-table-column>
			<el-table-column label="模板类型" prop="templateType">
			</el-table-column>
			<el-table-column label="是否生成H5页面" prop="createStatus">
			</el-table-column>
			<el-table-column label="模板存储文件路径" prop="templateFilePath">
			</el-table-column>
			<el-table-column label="创建人" prop="createUser">
			</el-table-column>
			<el-table-column label="创建时间" prop="createTime">
			</el-table-column>
			<el-table-column label="模板状态" prop="enableStatus">
			</el-table-column>
		</el-table>
		<div class="page-container">
			<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalTemplates" :page-size="pageSize" :page-sizes="[20, 50, 100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
		</div>
		</div>

		<el-dialog title="新增模板" @close="clearNewAdd" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="newAddTemplate" label-width="80px" :rules="newAddTemplateRules" ref="newAddTemplate">
				<el-form-item label="模板类型" prop="templateType">
					<el-select v-model="newAddTemplate.templateType" style="width:230px;">
						<el-option v-for="item in templateTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模板名称" prop="templateName">
					<el-input v-model="newAddTemplate.templateName" style="width:230px;" @input="sendValidateTemplateName('newAdd')"></el-input>
				</el-form-item>
				<el-form-item label="模板内容" prop="templateContent">
					<!--<textarea v-model="newAddTemplate.templateContent" name="templateContent" required="required" cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" @blur="checkNewAddTemplateContentNull"></textarea>-->
					<el-input type="textarea" v-model="newAddTemplate.templateContent" cols=60 :rows="20"></el-input>
				</el-form-item>
			</el-form>
			
			<!--
			<el-row>模板内容</el-row>
			<div class="ueditor-container">
				<textarea style="behavior:url('Editor.htc');"></textarea>
				<UE :defaultMsg=defaultMsg :config=config :id="ue1" ref="ue1"></UE>
			</div>
			-->
			
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleNewAddTemplate">确 定</el-button>
				<el-button @click="dialogNewAddVisible=false;">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="查看模板" :visible.sync="dialogCheckVisible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
			<el-form :model="checkTemplateInfoData" label-width="80px" :rules="checkTemplateInfoDataRules" ref="checkTemplateInfoData">
				<el-form-item label="模板类型" prop="templateType">
					<el-select v-model="checkTemplateInfoData.templateType" disabled style="width:230px;">
						<el-option v-for="item in templateTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item  label="模板名称" prop="templateName">
					<el-input v-model="checkTemplateInfoData.templateName" disabled style="width:230px;"></el-input>
				</el-form-item>
				<el-form-item  label="模板内容" prop="templateContent">
					<!--<textarea v-model="checkTemplateInfoData.templateContent" name="templateContent" required="required" cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" disabled="disabled"></textarea>-->
					<el-input type="textarea" v-model="checkTemplateInfoData.templateContent" cols="60" :rows="20" disabled></el-input>
				</el-form-item>
			</el-form>
			<!--
			<el-row>模板内容</el-row>
			
			<div class="ueditor-container">
				<UE :defaultMsg="checkTemplateInfoData.templateContent" :config=config :id="ue2" ref="ue2"></UE>	
			</div>
			-->
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
				<el-button @click="dialogCheckVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改模板" :visible.sync="dialogModifyVisible" :close-on-click-modal="false" @close="clearModifyTemplateInfoData" class="customer-width" @open="openNewAddModal">
			<el-form :model="modifyTemplateInfoData" label-width="80px" :rules="modifyTemplateInfoDataRules" ref="modifyTemplateInfoData">
				<el-form-item label="模板类型" prop="templateType">
					<el-select v-model="modifyTemplateInfoData.templateType" style="width:230px;">
						<el-option v-for="item in templateTypeList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模板名称" prop="templateName">
					<el-input v-model="modifyTemplateInfoData.templateName" style="width:230px;" @input="sendValidateTemplateName('modify')"></el-input>
				</el-form-item>
				<el-form-item label="模板内容" prop="templateContent">
					<!--<textarea v-model="modifyTemplateInfoData.templateContent" name="templateContent" required="required" cols="60" placeholder="请输入内容" rows="20" style="overflow-x:auto" @blur="checkModifyTemplateContentNull"></textarea>-->
					<el-input type="textarea" v-model="modifyTemplateInfoData.templateContent" cols=60 :rows="20" ></el-input>
				</el-form-item>
			</el-form>
			<!--
			<el-row>模板内容</el-row>
			<div class="ueditor-container">
				<UE :defaultMsg="modifyTemplateInfoData.templateContent" :config=config :id="ue3" ref="ue3"></UE>
			</div>
			-->
			
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleModifyTemplate">确 定</el-button>
				<el-button @click="dialogModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>


		<el-dialog title="删除模板" :visible.sync="dialogDeleteVisible" class="reset-dialog-width" :close-on-click-modal="false" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p>确认是否删除对应模板？</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDeleteTemplate">确 定</el-button>
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="启用模板" :visible.sync="dialogEnabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否启用对应模板？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleEnableTemplate">确 定</el-button>
				<el-button @click="dialogEnabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="禁用模板" :visible.sync="dialogDisabledVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否禁用对应模板？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleDisableTemplate">确 定</el-button>
				<el-button @click="dialogDisabledVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		

		<el-dialog title="生成H5页面" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否生成H5页面？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleCreateTemplate">确 定</el-button>
				<el-button @click="dialogCreateVisible = false">取 消</el-button>
			</div>
		</el-dialog>

		
		<el-dialog title="预览" :visible.sync="dialogPreviewVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<h3 style="text-align:center;">确认是否预览H5页面？</h3>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handlePreviewTemplate">确 定</el-button>
				<el-button @click="dialogPreviewVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		
	</div>
</template>

<script src="./action.js"></script>


<style lang="scss" scoped>
	@import '../../styles/common.scss'; 
	.template-manage{
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