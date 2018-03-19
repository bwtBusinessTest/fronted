<template>
	<div class="menu-manage">
		<div class="query-container">
			<el-row type="flex" justify="end">
				<el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px;"></el-input>
			</el-row>
		</div>
		<div class="manage-container">
			<el-row type="flex" justify="start" style="margin-bottom:20px;">
				<el-col :span="2" v-if="buttonVisible['20801']"><el-button @click="insertMenuShow" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20802']"><el-button @click="updateMenuShow" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20808']"><el-button @click="deleteBatchMenuShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20804']"><el-button @click="showBatchMenuShow" size="small" type="primary" icon="menu">显示</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20805']"><el-button @click="hideBatchMenuShow" size="small" type="primary" icon="minus">隐藏</el-button></el-col>
				<!-- <el-col :span="2"><el-button @click="contracts()" size="small" type="primary">收缩</el-button></el-col>
				<el-col :span="2"><el-button @click="spread()" size="small" type="primary">展开</el-button></el-col> -->
			</el-row>
			<div style="height:460px;overflow-y:auto;">
				<el-tree class="filter-tree" :data="treeDataView" show-checkbox node-key="id" :props="defaultProps" ref="tree" :filter-node-method="filterNode" :render-content="renderContent" :check-strictly="true">
				</el-tree>
			</div>
		</div>
		<!-- 弹出框 -->
		<el-dialog title="新增菜单" :visible.sync="dialogInsertVisible" @close="closeInsert" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="insertMenuInfo" style="width:640px;margin:auto;" :rules="addRules" ref="insertForm" label-width="120px">
				<el-form-item label="菜单编号" prop="menuCode">
					<el-input v-model="insertMenuInfo.menuCode" @input="sendValidateMenuCode('insert')"></el-input>
				</el-form-item>
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="insertMenuInfo.menuName" style="width:195px;"></el-input>
				</el-form-item>
				<el-form-item label="上级菜单编号" prop="menuParentCode">
					<el-input v-model="insertMenuInfo.menuParentCode"></el-input>
				</el-form-item>
				<el-form-item label="是否菜单" prop="menuFlag">
					<el-select v-model="insertMenuInfo.menuFlag">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="网页链接地址" prop="url">
					<el-input v-model="insertMenuInfo.url"></el-input>
				</el-form-item>
				<el-form-item label="是否子节点类型" prop="leafFlag">
					<el-select v-model="insertMenuInfo.leafFlag">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序号" prop="sortNo">
					<el-input v-model="insertMenuInfo.sortNo"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
					<el-select v-model="insertMenuInfo.status">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="insertMenu">确 定</el-button>
				<el-button @click="closeInsert">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改菜单" :visible.sync="dialogUpdateVisible" @close="closeUpdate" :close-on-click-modal="false" @open="openNewAddModal">
			<el-form :inline="true" :model="updateMenuInfo" style="width:640px;margin:auto;" :rules="updateRules" ref="updateForm" label-width="120px">
				<el-form-item label="菜单编号" prop="menuCode">
					<el-input v-model="updateMenuInfo.menuCode" @input="sendValidateMenuCode('update')"></el-input>
				</el-form-item>
				<el-form-item label="菜单名称" prop="menuName">
					<el-input v-model="updateMenuInfo.menuName" style="width:195px;"></el-input>
				</el-form-item>
				<el-form-item label="上级菜单编号" prop="menuParentCode">
					<el-input v-model="updateMenuInfo.menuParentCode"></el-input>
				</el-form-item>
				<el-form-item label="是否菜单" prop="menuFlag">
					<el-select v-model="updateMenuInfo.menuFlag">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="网页链接地址" prop="url">
					<el-input v-model="updateMenuInfo.url"></el-input>
				</el-form-item>
				<el-form-item label="是否子节点类型" prop="leafFlag">
					<el-select v-model="updateMenuInfo.leafFlag">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序号" prop="sortNo">
					<el-input v-model="updateMenuInfo.sortNo"></el-input>
				</el-form-item>
				<el-form-item label="是否启用" prop="status">
					<el-select v-model="updateMenuInfo.status">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="updateMenu">确 定</el-button>
				<el-button @click="closeUpdate">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
@import '../../styles/common.scss';
.menu-manage{
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
	.el-dialog{
		width: 720px;
	}
}	
</style>