<template>
	<div class="user-role-manage">
		<div class="query-container">
			<el-form :model="queryCondition" :inline="true">
				<el-form-item label="角色名称">
					<el-input size="small" v-model="queryCondition.roleName"></el-input>
				</el-form-item>
			</el-form>
			<el-row type="flex" justify="end">
				<el-col :span="3" v-if="buttonVisible['20201']"><el-button size="small" type="primary" @click="clearQueryParams" icon="delete">清空</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20202']"><el-button size="small" type="primary" @click="queryRoleList" icon="search" >查询</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-row type="flex" justify="start">
				<el-col :span="2" v-if="buttonVisible['20203']"><el-button @click="dialogAddVisible = true" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20204']"><el-button @click="modifyRole" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20205']"><el-button @click="removeRole" size="small" type="primary" icon="delete">删除</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20206']"><el-button @click="getMenuPermission" size="small" type="primary" icon="minus">权限分配</el-button></el-col>
			</el-row>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" :empty-text="noTableData">
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column label="角色编号" prop="roleNo">
				</el-table-column>
				<el-table-column label="角色名称" prop="roleName">
				</el-table-column>
				<el-table-column label="备注" prop="remark">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<el-dialog title="新增角色" @close="clearAddModel" :visible.sync="dialogAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="addRoleData" :rules="addRoleRules" ref="addRoleForm" label-width="80px">
				<el-form-item label="角色编号" prop="roleNo" >
					<el-input v-model="addRoleData.roleNo"></el-input>
				</el-form-item>
				<el-form-item class="polish" label="角色名称"  prop="roleName">
					<el-input v-model="addRoleData.roleName"></el-input>
				</el-form-item>
				<el-form-item class="polish" label="备注" prop="remark">
					<el-input v-model="addRoleData.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleAddRole">确 定</el-button>
				<el-button @click="dialogAddVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改角色" @close="clearModifyModel" :visible.sync="dialogModifyVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="modifyRoleData" :rules="modifyRoleRules" ref="modifyRoleForm" label-width="80px">
				<el-form-item label="角色编号" prop="roleNo">
					<el-input v-model="modifyRoleData.roleNo"></el-input>
				</el-form-item>
				<el-form-item class="polish" label="角色名称" prop="roleName">
					<el-input v-model="modifyRoleData.roleName"></el-input>
				</el-form-item>
				<el-form-item class="polish" label="备注" prop="remark">
					<el-input v-model="modifyRoleData.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleModifyRole">确 定</el-button>
				<el-button @click="dialogModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="删除角色" :visible.sync="dialogDeleteVisible" class="reset-dialog-width" :close-on-click-modal="false" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p style="padding-left:50px;">确认删除角色？删除角色会级联删除相关的用户权限！</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleRemoveRole">确 定</el-button>
				<el-button @click="dialogDeleteVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="权限分配" :visible.sync="dialogRightDistributeVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<div style="height:460px;overflow-y:auto;" ref="permissionDialog">
				<el-tree :data="rightsModifyData" show-checkbox @check-change="handleRightsModifyChange"node-key="id" :default-expand-all = true :default-checked-keys= "checkedKeysData" ref="tree"></el-tree>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleSetPermission">确 定</el-button>
				<el-button @click="dialogRightDistributeVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
	@import '../../styles/common.scss';
	.user-role-manage{
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