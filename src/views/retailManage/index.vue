<template>

  <div class="user-manage">
    <div class="query-container">
      <el-row type="flex" style="width:1072px;" justify="start">
        <el-col :span="3"><el-button @click="retailAdd" size="small" type="primary" icon="plus" v-if="buttonVisible['3030101']">新增</el-button></el-col>
        <el-col :span="3"><el-button @click="retailEdit" size="small" type="primary" icon="edit" v-if="buttonVisible['3030104']">编辑</el-button></el-col>
        <el-col :span="3"><el-button @click="openConfirm" size="small" type="primary" icon="upload2" v-if="buttonVisible['3030106']">生成密钥</el-button></el-col>
      </el-row>
    </div>
    <div class="manage-container">
      <el-table :data="tableData" border ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height="470">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="分销商代码" prop="code">
        </el-table-column>
        <el-table-column label="分销商名称" prop="name">
        </el-table-column>
        <el-table-column label="简称" prop="shortName">
        </el-table-column>
        <el-table-column label="状态" prop="status">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="searchData.pageSize" :page-sizes="[10, 20, 30]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
      </div>
    </div>

    <el-dialog title="分销商新增" :visible.sync="dialogAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="false" :model="newAddForm" label-width="150px" :label-position="labelPosition" ref="newAddForm" style="margin:auto;" :rules="newRetailRules">
        <el-form-item label="分销商名称:" prop="name">
          <el-input v-model="newAddForm.name" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="简称:" prop="shortName">
          <el-input v-model="newAddForm.shortName" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="newAddForm.status" style="width:70%;" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('newAddForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('newAddForm')">确 定</el-button>
      </div>
    </el-dialog>

    
    <el-dialog title="分销商编辑" :visible.sync="dialogEditVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :model="editForm" :inline="false" label-width="170px" :rules="editRetailRules" :label-position="labelPosition" ref="editForm" style="margin:auto;">
        <el-form-item label="分销商代码:" prop="code">
          <el-input v-model="editForm.code" style="width:70%;" disabled></el-input>
        </el-form-item>
        <el-form-item label="分销商名称:" prop="name">
          <el-input v-model="editForm.name" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="简称:" prop="shortName">
          <el-input v-model="editForm.shortName" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item  label="appid:" prop="appId">
          <el-input type="textarea" :disabled="true" v-model="editForm.appId" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item  label="公钥:" prop="appSecret">
          <el-input type="textarea" :disabled="true" v-model="editForm.appSecret" style="width:70%;"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="editForm.status" style="width:70%;" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('editForm')">取 消</el-button>
        <el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
	</div>

</template>

<script src="./action.js"></script>

<style lang="scss">
  @import '../../styles/common.scss';
  .user-manage {
    margin: 30px auto 0;
    width: 1120px;
  }
  .el-input{
    margin:0 auto;
  }
  .el-dialog__wrapper{
      top: 50px;
      left: 200px;
  }
  .el-dialog{
      width:580px;
  }
  .el-loading-mask{
    z-index: 90;
  }
  .el-textarea__inner{ resize:none;}
</style>
