<template>
	<div class="treeDataDic-manage">
		<div class="query-container">
			<el-row type="flex" justify="end">
				<el-input placeholder="输入关键字进行过滤" v-model="filterText" style="width: 200px;"></el-input>
			</el-row>
		</div>
		<div class="manage-container">
			<el-row type="flex" justify="start" style="margin-bottom:20px;">
				<el-col :span="2" v-if="buttonVisible['20701']"><el-button @click="insertTreeDicShow" size="small" type="primary" icon="plus">新增</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20702']"><el-button @click="updateTreeDicShow" size="small" type="primary" icon="edit">修改</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20708']"><el-button @click="deleteBatchTreeDicShow" size="small" type="primary" icon="delete">删除</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20704']"><el-button @click="showBatchTreeDicShow" size="small" type="primary" icon="menu">显示</el-button></el-col>
				<el-col :span="2" v-if="buttonVisible['20705']"><el-button @click="hideBatchTreeDicShow" size="small" type="primary" icon="minus">隐藏</el-button></el-col>
				<!-- <el-col :span="2"><el-button @click="contracts()" size="small" type="primary">收缩</el-button></el-col>
				<el-col :span="2"><el-button @click="spread()" size="small" type="primary">展开</el-button></el-col> -->
			</el-row>
			<div style="height:460px;overflow-y:auto;">
				<el-tree class="filter-tree" :data="treeDataView" show-checkbox node-key="id" :props="defaultProps" :check-strictly="false" ref="tree" :filter-node-method="filterNode" lazy :load="lazyLoad" :render-content="renderContent">
				</el-tree>
			</div>
		</div>
		

		<!-- 弹出框 -->
		<el-dialog title="新增字典" :visible.sync="dialogInsertVisible" @close="closeInsert" :close-on-click-modal="false" class="tddm-reAdd-width" @open="openNewAddModal">
			<el-form :inline="true" :model="insertTreeDicInfo" style="width:600px;margin:auto;" :rules="addRules" ref="insertForm" label-width="100px">
				<el-form-item label="字典编号" prop="code">
					<el-input v-model="insertTreeDicInfo.code"></el-input>
				</el-form-item>
				<el-form-item label="节点编号" prop="type">
					<el-input v-model="insertTreeDicInfo.type"></el-input>
				</el-form-item>
				<el-form-item label="节点名称" prop="caption">
					<el-input v-model="insertTreeDicInfo.caption"></el-input>
				</el-form-item>
				<el-form-item label="父节点编号" prop="caption">
					<el-input v-model="insertTreeDicInfo.parentCode"></el-input>
				</el-form-item>
				<el-form-item label="节点层级" prop="level">
					<el-input v-model="insertTreeDicInfo.level"></el-input>
				</el-form-item>
				<el-form-item label="是否末级">
					<el-select v-model="insertTreeDicInfo.bottomFlag" style="width:170px;">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节点备注">
					<el-input v-model="insertTreeDicInfo.summary"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="insertTreeDic">确 定</el-button>
				<el-button @click="closeInsert">取 消</el-button>
			</div>
		</el-dialog>

		<el-dialog title="修改字典" :visible.sync="dialogUpdateVisible" @close="closeUpdate" :close-on-click-modal="false" class="tddm-reAdd-width" @open="openNewAddModal">
			<el-form :inline="true" :model="updateTreeDicInfo" style="width:550px;margin:auto;" :rules="updateRules" ref="updateForm" label-width="87px">
				<el-form-item label="字典编号" prop="code">
					<el-input v-model="updateTreeDicInfo.code"></el-input>
				</el-form-item>
				<el-form-item label="节点编号"prop="type">
					<el-input v-model="updateTreeDicInfo.type"></el-input>
				</el-form-item>
				<el-form-item label="节点名称" prop="caption">
					<el-input v-model="updateTreeDicInfo.caption"></el-input>
				</el-form-item>
				<el-form-item label="父节点编号" prop="parentCode">
					<el-input v-model="updateTreeDicInfo.parentCode"></el-input>
				</el-form-item>
				<el-form-item label="节点层级" prop="level">
					<el-input v-model="updateTreeDicInfo.level"></el-input>
				</el-form-item>
				<el-form-item label="是否末级">
					<el-select v-model="updateTreeDicInfo.bottomFlag" style="width:170px;">
	  					<el-option label="否" value="0"></el-option>
						<el-option label="是" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="节点备注">
					<el-input v-model="updateTreeDicInfo.summary"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
    			<el-button type="primary" @click="updateTreeDic">确 定</el-button>
				<el-button @click="closeUpdate">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script src="./action.js"></script>

<style lang="scss">
@import '../../styles/common.scss';
.treeDataDic-manage{
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
	.tddm-reAdd-width{
		.el-dialog{
			width: 610px;
		}
	}
}
</style>