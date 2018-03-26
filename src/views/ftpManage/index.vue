<template>
  <div class="ftp-manage">
    <div class="query-container">
		<el-form :inline="true" :model="form" style="width:1072px;margin:auto;" ref="searchForm" :rules="formRules">
			<el-form-item  label="配置类型:" prop="configFtpType">
				<el-select v-model="form.configFtpType" clearable>
          <el-option v-for="item in typeDownMenu" :label="item.caption" :value="item.value" :key="item.id"></el-option>						
				</el-select>
			</el-form-item>
			<el-form-item label="ftp地址:"  prop="ftpIp">
			    <el-input v-model="form.ftpIp" size="small"></el-input>
			</el-form-item>
			<el-form-item label="端口:" prop="port">
          <el-input v-model="form.port"></el-input>
			</el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="form.status" placeholder="请选择" clearable>
			    <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-row type="flex" style="width:1072px;" justify="end">
			<el-col :span="3"><el-button @click="resetForm('searchForm')" size="small" type="primary" icon="delete" v-if="buttonVisible['21301']">清空</el-button></el-col>
			<el-col :span="3" ><el-button @click="cardSearchTerm('searchForm')" size="small" type="primary" icon="search" v-if="buttonVisible['21307']">查询</el-button></el-col>
		</el-row>
    </div>
    <div class="manage-container">
      <el-row type="flex" style="width:1072px" justify="start">
        <el-col :span="3"><el-button @click="openAdd" size="small" type="primary" icon="plus" v-if="buttonVisible['21302']">新增</el-button></el-col>
        <el-col :span="3"><el-button @click="openEdit" size="small" type="primary" icon="edit" v-if="buttonVisible['21305']">修改</el-button></el-col>
        <el-col :span="3"><el-button @click="useAble('1')" size="small" type="primary" icon="check" v-if="buttonVisible['21303']">启用</el-button></el-col>
        <el-col :span="3"><el-button @click="useAble('0')" size="small" type="primary" icon="minus" v-if="buttonVisible['21304']">禁用</el-button></el-col>
        <el-col :span="3"><el-button @click="removeFtp" size="small" type="primary" icon="delete" v-if="buttonVisible['21306']">删除</el-button></el-col>
      </el-row>
      <el-table fit:true :data="tableData" @selection-change="handleSelectionChange" border ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height="500">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="序号" type="index" width="100%">
        </el-table-column>
        <el-table-column label="配置类型" prop="configFtpType">
        </el-table-column>
        <el-table-column label="FTP地址" prop="ftpIp">
        </el-table-column>
        <el-table-column label="端口" prop="port">
        </el-table-column>
        <el-table-column label="用户名" prop="user">
        </el-table-column>
        <el-table-column label="密码" prop="pwd">
        </el-table-column>
        <el-table-column label="生成路径" prop="path">
        </el-table-column>
        <el-table-column label="状态" prop="status">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[20, 50, 100]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
      </div>
    </div>

<!-- 新增ftp配置 -->
    <el-dialog title="新增配置" :visible.sync="dialogAddVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="true" :model="addForm" label-width="90px" label-position="right" ref="addForm" style="width:550px;margin:auto;" :rules="newFtpRules">
        <el-form-item label="配置类型:" prop="configFtpType">
          <el-select v-model="addForm.configFtpType" style="width:160px" clearable>
            <el-option v-for="item in typeDownMenu" :label="item.caption" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item label="FTP地址:" prop="ftpIp">
            <el-input style="width:160px" v-model="addForm.ftpIp"></el-input>
        </el-form-item>
        <el-form-item label="端口:" prop="port">
          <el-input style="width:160px" v-model="addForm.port"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="user">
          <el-input style="width:160px" v-model="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pwd">
          <el-input style="width:160px" v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item  label="生成路径:" prop="path">
          <el-input style="width:160px" v-model="addForm.path"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">取 消</el-button>
        <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>

<!-- 修改ftp配置 -->
    <el-dialog title="修改配置" :visible.sync="dialogEditVisible" :close-on-click-modal="false" @open="openNewAddModal">
      <el-form class="demo-ruleForm" :inline="true" :model="editForm" label-width="90px" label-position="right" ref="editForm" style="width:550px;margin:auto;" :rules="editFtpRules">
        <el-form-item label="配置类型:" prop="configFtpType">
          <el-select v-model="editForm.configFtpType" style="width:160px" clearable>
            <el-option v-for="item in typeDownMenu" :label="item.caption" :value="item.value" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        </el-form-item>
        <el-form-item label="FTP地址:" prop="ftpIp">
            <el-input style="width:160px" v-model="editForm.ftpIp"></el-input>
        </el-form-item>
        <el-form-item label="端口:" prop="port">
          <el-input style="width:160px" v-model="editForm.port"></el-input>
        </el-form-item>
        <el-form-item label="用户名:" prop="user">
          <el-input style="width:160px" v-model="editForm.user"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="pwd">
          <el-input style="width:160px" v-model="editForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="生成路径:" prop="path">
          <el-input style="width:160px" v-model="editForm.path"></el-input>
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

<style rel="stylesheet/scss" lang="scss">
  @import '../../styles/common.scss';
  .ftp-manage{
    margin: 30px auto 0;
    width: 1120px;
    .demo-ruleForm{
			margin: auto;
    }
    .el-dialog__wrapper{
      top: 50px;
      left: 200px;
    }
    .el-dialog{
      width:580px;
    }
  }
</style>
