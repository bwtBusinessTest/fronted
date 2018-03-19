<template>
	<div class="user-manage">
		<div class="query-container">
			<el-form :inline="true" :model="form" style="width:1072px;margin:auto;">
				<el-form-item label="用户编号">
					<el-input size="small" v-model="form.userNum"></el-input>
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input size="small" v-model="form.userName"></el-input>
				</el-form-item>
				<el-form-item label="用户角色">
					<el-select size="small" v-model="form.userRole" filterable clearable>
					<el-option v-for="item in userRoleOptions" :key="item.id" :label="item.roleName" :value="item.id">
					</el-option>
				</el-select>
				</el-form-item>
				<el-form-item label="用户状态">
					<el-select size="small" v-model="form.userState">
						<el-option v-for="item in userStateList" :label="item.caption" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<el-row type="flex" style="width:1072px;" justify="end">
				<el-col :span="3" v-if="buttonVisible['20115']"><el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20104']"><el-button @click="queryUserList" size="small" type="primary" icon="search">查询</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<el-row type="flex" justify="start">
				<el-col :span="2" v-if="buttonVisible['20101']"><el-button @click="addUserInfo()" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20103']"><el-button @click="checkUserInfo" size="small" type="primary" icon="check">查看</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20105'] && !isCancel"><el-button @click="modifyUserInfo" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20106'] && !isCancel"><el-button @click="cancleUserInfo('cancel')" size="small" type="primary" icon="delete">注销</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20109'] && !isCancel"><el-button @click="resetPassword" size="small" type="primary" icon="setting">密码重置</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20107'] && !isCancel"><el-button @click="cancleUserInfo('freeze')" size="small" type="primary" icon="circle-close">冻结</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20108'] && !isCancel"><el-button @click="cancleUserInfo('unfreeze')" size="small" type="primary" icon="view">解冻</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20110'] && !isCancel"><el-button @click="roleDistribute" size="small" type="primary" icon="menu">角色分配</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20111'] && !isCancel"><el-button @click="modifyRights" size="small" type="primary" icon="minus">权限修改</el-button></el-col>
			</el-row>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData">
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column label="用户编号" prop="id">
				</el-table-column>
				<el-table-column label="用户名称" prop="userName">
				</el-table-column>
				<el-table-column label="角色名称" prop="roleName">
				</el-table-column>
				<el-table-column label="用户状态" prop="statusDesc">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalUsers" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<el-dialog title="新增用户" @close="clearNewAdd" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="newAddUser" label-width="78px" :rules="newAddUserRules" ref="newAddUser" style="width:540px;margin:auto;" >
				<el-form-item label="用户名称" prop="userTitle">
					<el-input v-model="newAddUser.userTitle"></el-input>
				</el-form-item>
				<el-form-item label="用户姓名" prop="userName">
					<el-input v-model="newAddUser.userName"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="telephone">
					<el-input v-model="newAddUser.telephone"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="callNum">
					<el-input v-model="newAddUser.callNum"></el-input>
				</el-form-item>
				<el-form-item label="电子邮件" prop="email">
					<el-input v-model="newAddUser.email"></el-input>
				</el-form-item>
				<el-form-item label="城市:" prop="activeCity">
                    <el-select v-model="newAddUser.activeCity" style="width:180px;" filterable clearable>
                        <el-option-group
                            v-for="group in cityMenu"
                            :key="group.id"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                              </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="newAddUser.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleNewAddUser">确 定</el-button>
				<el-button @click="dialogNewAddVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="查看用户" :visible.sync="dialogCheckVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="checkUserInfoData" style="width:530px;margin:auto;">
				<el-form-item label="用户名称">
					<el-input v-model="checkUserInfoData.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户姓名">
					<el-input v-model="checkUserInfoData.realName" disabled></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="checkUserInfoData.mobile" disabled></el-input>
				</el-form-item>
				<el-form-item label="联系电话">
					<el-input v-model="checkUserInfoData.phone" disabled></el-input>
				</el-form-item>
				<el-form-item label="电子邮件">
					<el-input v-model="checkUserInfoData.email" disabled></el-input>
				</el-form-item>
				<el-form-item label="其他信息">
					<el-input v-model="checkUserInfoData.remark" disabled></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogCheckVisible = false">确 定</el-button>
				<el-button @click="dialogCheckVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="修改用户" @close="resetUserNameExist" :visible.sync="dialogModifyVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="modifyUserInfoData" :rules="modifyUserRules" label-width="78px" style="width:540px;margin:auto;" ref="modifyUserForm">
				<el-form-item label="用户名称" prop="userTitle">
					<el-input v-model="modifyUserInfoData.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户姓名" prop="realName">
					<el-input v-model="modifyUserInfoData.realName"></el-input>
				</el-form-item>
				<el-form-item label="手机号码" prop="mobile">
					<el-input v-model="modifyUserInfoData.mobile"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="modifyUserInfoData.phone"></el-input>
				</el-form-item>
				<el-form-item label="电子邮件" prop="email">
					<el-input v-model="modifyUserInfoData.email"></el-input>
				</el-form-item>
				<el-form-item label="城市:" prop="cityId">
                    <el-select v-model="modifyUserInfoData.cityId" style="width:180px;" filterable clearable>
                        <el-option-group
                            v-for="group in cityMenu"
                            :key="group.id"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.code">
                              </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
				<el-form-item label="其他信息">
					<el-input v-model="modifyUserInfoData.remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleModifyUser">确 定</el-button>
				<el-button @click="dialogModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="注销用户" :visible.sync="dialogCancelVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form class="cancel-user" label-width="80px" :model="cancelUserInfoData" :label-position="labelPosition">
				<el-form-item label="用户编号">
					<el-input v-model="cancelUserInfoData.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="cancelUserInfoData.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="注销原因">
					<el-input v-model="cancelUserInfoData.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleCancelUser">确 定</el-button>
				<el-button @click="dialogCancelVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="密码重置" :visible.sync="dialogPassResetVisible" :close-on-click-modal="false" class="reset-dialog-width" @open="openNewAddModal">
			<div class="el-message-box__status el-icon-warning"></div><p style="padding-left:40px;">请确认是否重置密码？，默认密码111111</p>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleResetPassword">确 定</el-button>
				<el-button @click="dialogPassResetVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="冻结用户" :visible.sync="dialogFreezeVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form class="cancel-user" label-width="80px" :model="cancelUserInfoData" :label-position="labelPosition">
				<el-form-item label="用户编号">
					<el-input v-model="cancelUserInfoData.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="cancelUserInfoData.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="冻结原因">
					<el-input v-model="cancelUserInfoData.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleFreezeUser">确 定</el-button>
				<el-button @click="dialogFreezeVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="解冻用户" :visible.sync="dialogUnfreezeVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form class="cancel-user" label-width="80px" :model="cancelUserInfoData" :label-position="labelPosition">
				<el-form-item label="用户编号">
					<el-input v-model="cancelUserInfoData.id" disabled></el-input>
				</el-form-item>
				<el-form-item label="用户名称">
					<el-input v-model="cancelUserInfoData.userName" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item class="polish" label="用户状态">
					<el-select v-model="cancelUserInfoData.status" disabled>
      					<el-option label="启用" value="1"></el-option>
						<el-option label="禁用" value="2"></el-option>
						<el-option label="注销" value="3"></el-option>
    				</el-select>
				</el-form-item> -->
				<el-form-item label="解冻原因">
					<el-input v-model="cancelUserInfoData.reason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handleUnfreezeUser">确 定</el-button>
				<el-button @click="dialogUnfreezeVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="角色分配" :visible.sync="dialogRoleDistributeVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<el-table :data="roleDistributeData" border @selection-change="handleSelectionRoleDisChange"  ref="roleTable" row-key="id">
    			<el-table-column type="selection" :selectable="checkSelectable" :reserve-selection="true" ></el-table-column>
    			<el-table-column property="roleNo" label="角色编码"></el-table-column>
    			<el-table-column property="roleName" label="角色名称"></el-table-column>
  			</el-table>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button type="primary" @click="setRolePermission">确 定</el-button> -->
				<el-button type="primary" @click="setRolePermission">确 定</el-button>
				<el-button @click="dialogRoleDistributeVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		<el-dialog title="权限修改" :visible.sync="dialogRightModifyVisible" :close-on-click-modal="false" @open="openNewAddModal">
			<div style="height:460px;overflow-y:auto;" ref="permissionDialog">
				<el-tree :data="rightsModifyData" show-checkbox @check-change="handleRightsModifyChange"  node-key="id" :default-checked-keys= "checkedKeysData"
				:default-expand-all = true ref="tree"></el-tree>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="setMenuPermission">确 定</el-button>
				<el-button @click="dialogRightModifyVisible = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
	@import '../../styles/common.scss';
	.user-manage{
		margin: 30px auto 0;
		width: 1120px;
		.polish{
			.el-form-item__label{
				width: 68px;
			}
			.el-form-item__content{
				width: 175px;
			}
		}
		.cancel-user{
			width: 255px;
			margin: auto;
		}
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