<template>
  <div class="task-config">
    <div class="query-container" ref="queryContainer" style="height:166px;">
      <el-form :inline="true" :model="form" label-width="100px" style="width:1072px;margin:auto;">
        <el-form-item label="服务名称:">
          <el-input size="small" v-model="form.taskName" style="width: 194px;"></el-input>
        </el-form-item>
        <el-form-item label="服务类型:">
          <el-select size="small" v-model="form.taskType" filterable clearable>
            <el-option v-for="item in taskTypes" :key="item.value" :label="item.caption" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select size="small" v-model="form.status" filterable clearable>
            <el-option v-for="item in taskStatus" :label="item.caption" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="query-btn">
        <el-button  v-if="buttonVisible['2140201']" @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button>
        <el-button  v-if="buttonVisible['2140202']" @click="queryTaskList" size="small" type="primary" icon="search">查询</el-button>
      </div>
      <div class="draggable" @click="shrinkQueryArea(166)">
        <icon-svg icon-class="hamburger"/>
      </div>
    </div>
    <div class="manage-container">
      <el-row type="flex" justify="start">
        <el-col :span="2"  v-if="buttonVisible['2140203']" >
          <el-button size="small" type="primary" @click="addTask">新增</el-button>
        </el-col>
        <el-col :span="2"  v-if="buttonVisible['2140204']" >
          <el-button size="small" type="primary" @click="modifyTask">修改</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable"
                v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="服务ID" align="center" prop="id" width="120">
        </el-table-column>
        <el-table-column label="服务名称" align="center" prop="taskName" width="180">
        </el-table-column>
        <el-table-column label="服务描述" align="center" prop="taskDesc" width="180">
        </el-table-column>
        <el-table-column label="服务类型" align="center" prop="taskTypeDesc" width="100">
        </el-table-column>
        <el-table-column label="类名" align="center" prop="classFullname" width="100">
        </el-table-column>
        <el-table-column label="接口地址" align="center" prop="execApi" width="180">
        </el-table-column>
        <el-table-column label="服务参数" align="center" prop="taskParam" width="180">
        </el-table-column>
        <el-table-column label="参数说明" align="center" prop="taskParamDesc" width="180">
        </el-table-column>
        <el-table-column label="状态" align="center" prop="statusDesc" width="100">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalTask" :page-size="pageSize"
                       :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="新增" @open="openNewAddModal" @close="clearNewAdd" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form :model="addTaskInfo" label-width="100px" :rules="addTaskConfigRules" ref="addTask" style="width:540px;margin:auto;">
        <el-form-item label="服务名称:" prop="taskName">
          <el-input v-model="addTaskInfo.taskName"></el-input>
        </el-form-item>
        <el-form-item label="服务描述:" prop="taskDesc" >
          <el-input type="textarea" :rows="3" v-model="addTaskInfo.taskDesc"></el-input>
        </el-form-item>
        <el-form-item label="服务类型:" prop="taskType">
          <el-select size="small" v-model="addTaskInfo.taskType" filterable clearable>
            <el-option v-for="item in taskTypes" :key="item.value" :label="item.caption" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类名:" prop="classFullname">
          <el-input v-model="addTaskInfo.classFullname" ></el-input>
        </el-form-item>
        <el-form-item label="接口地址:" prop="execApi">
          <el-input v-model="addTaskInfo.execApi" ></el-input>
        </el-form-item>
        <el-form-item label="执行参数:" prop="taskParam">
          <el-input v-model="addTaskInfo.taskParam" ></el-input>
        </el-form-item>
        <el-form-item label="参数说明:" prop="taskParamDesc">
          <el-input type="textarea" :rows="3" v-model="addTaskInfo.taskParamDesc"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select size="small" v-model="addTaskInfo.status" filterable clearable>
            <el-option v-for="item in taskStatus" :label="item.caption" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddTask">确 定</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改" @open="openNewAddModal" :visible.sync="dialogModifyVisible" :close-on-click-modal="false">
      <el-form :model="modifyTaskInfo" label-width="100px" :rules="modifyTaskConfigRules" ref="modifyTask" style="width:540px;margin:auto;">
        <el-form-item label="服务名称:" prop="taskName">
          <el-input v-model="modifyTaskInfo.taskName" disabled></el-input>
        </el-form-item>
        <el-form-item label="服务描述:" prop="taskDesc" >
          <el-input type="textarea" :rows="3" v-model="modifyTaskInfo.taskDesc"></el-input>
        </el-form-item>
        <el-form-item label="服务类型:" prop="taskType">
          <el-select size="small" v-model="modifyTaskInfo.taskType" filterable clearable disabled="true">
            <el-option v-for="item in taskTypes" :key="item.value" :label="item.caption" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类名:" prop="classFullname" >
          <el-input v-model="modifyTaskInfo.classFullname" disabled></el-input>
        </el-form-item>
        <el-form-item label="接口地址:" prop="execApi">
          <el-input v-model="modifyTaskInfo.execApi"></el-input>
        </el-form-item>
        <el-form-item label="执行参数:" prop="taskParam">
          <el-input v-model="modifyTaskInfo.taskParam"></el-input>
        </el-form-item>
        <el-form-item label="参数说明:" prop="taskParamDesc">
          <el-input type="textarea" :rows="3" v-model="modifyTaskInfo.taskParamDesc"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select size="small" v-model="modifyTaskInfo.status" filterable clearable>
            <el-option v-for="item in taskStatus" :label="item.caption" :value="item.value"
                       :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleModifyTask">确 定</el-button>
        <el-button @click="dialogModifyVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSelectList } from '@/api/userManage';
 // import { formatLongDate } from '@/utils';
  import {
    getTaskByName,
    getTask,
    getTaskList,
    addTask,
    modifyTask
  } from '@/api/taskConfig';
  import publicMixin from '@/utils/publicMethod';
  import butVisibleMixin from '@/utils/buttonVisible';

  export default {
      name: 'taskConfig',
      data() {
          var validateTaskName = (rule, value, callback) => {
              if (value) {
                  getTaskByName({ params: value.trim() }).then(res => {
                      if (res.result.isExist) {
                          callback('服务名称已存在');
                      } else {
                          callback();
                      }
                  });
              }
          };
          return {
              pageId: '21402',
              form: {
                  taskName: '',
                  taskType: '',
                  status: ''
              },
              taskTypes: [],
              taskStatus: [],
              tableData: [],
              loading: false,
              noTableData: '',
              totalTask: 0,
              pageSize: 10,
              currentPage: 1,
              multipleSelection: [],
              dialogAddVisible: false,
              dialogModifyVisible: false,
              addTaskInfo: {
                  taskName: '',
                  taskType: '',
                  taskDesc: '',
                  taskParam: '',
                  taskParamDesc: '',
                  classFullname: '',
                  execApi: '',
                  status: ''
              },
              modifyTaskInfo: {},
              beCompareExecuteParams: {},
              queryContainerShrink: false,
              addTaskConfigRules: {
                  taskName: [{ validator: validateTaskName, trigger: 'blur' }, { required: true, message: '请输入服务名称', trigger: 'blur' }, { max: 50, message: '最长50个字符', trigger: 'blur' }],
                  taskDesc: [{ max: 100, message: '最长100个字符', trigger: 'blur' }],
                  taskType: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
                  classFullname: [{ required: true, message: '请输入类名', trigger: 'blur' }, { max: 200, message: '最长200个字符', trigger: 'blur' }],
                  execApi: [{ max: 200, message: '最长200个字符', trigger: 'blur' }],
                  taskParam: [{ max: 500, message: '最长500个字符', trigger: 'blur' }],
                  taskParamDesc: [{ max: 500, message: '最长500个字符', trigger: 'blur' }],
                  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
              },
              modifyTaskConfigRules: {
                  taskName: [{ required: true, message: '请输入服务名称', trigger: 'blur' }, { max: 50, message: '最长50个字符', trigger: 'blur' }],
                  taskDesc: [{ max: 100, message: '最长100个字符', trigger: 'blur' }],
                  taskType: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
                  classFullname: [{ required: true, message: '请输入类名', trigger: 'blur' }, { max: 200, message: '最长200个字符', trigger: 'blur' }],
                  execApi: [{ max: 200, message: '最长200个字符', trigger: 'blur' }],
                  taskParam: [{ max: 500, message: '最长500个字符', trigger: 'blur' }],
                  taskParamDesc: [{ max: 500, message: '最长500个字符', trigger: 'blur' }],
                  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
              }
          };
      },
      created() {
          this.getTaskTypeList();
          this.getTaskStatusList();
          this.getTaskList();
      },
      methods: {
          getTaskTypeList() {
              getSelectList({ params: { code: '1037' }}).then(res => {
                  if (res.errcode === '0000') {
                      this.taskTypes = res.result;
                  }
              });
          },
          getTaskStatusList() {
              getSelectList({ params: { code: '1039' }}).then(res => {
                  if (res.errcode === '0000') {
                      this.taskStatus = res.result;
                  }
              });
          },
          getTaskList(page) {
              const pageNo = page || 1;
              const params = {
                  pageNo: pageNo,
                  pageSize: this.pageSize,
                  taskType: this.form.taskType || null,
                  taskName: this.form.taskName || null,
                  status: this.form.status || null
              };
              getTaskList({ params }).then(res => {
                  if (res.errcode === '0000') {
                      this.tableData = res.result.rows;
                      this.totalTask = res.result.totalCount;
                  }
              });
          },
          clearQueryParams() {
              for (const i in this.form) {
                  this.form[i] = '';
              }
          },
          queryTaskList() {
              this.getTaskList(this.currentPage);
          },
          handleSelectionChange(val) {
              this.multipleSelection = val;
          },
          handleCurrentChange(val) {
              this.currentPage = val;
              this.getTaskList(this.currentPage);
          },
          handleSizeChange(val) {
              this.pageSize = val;
              this.getTaskList(this.currentPage);
          },
          clearNewAdd() {
              for (var key in this.addTaskInfo) {
                  this.addTaskInfo[key] = '';
              }
              this.$refs.addTask.resetFields();
          },
          addTask() {
              this.dialogAddVisible = true;
          },
          modifyTask() {
              if (this.multipleSelection.length === 1) {
                  getTask({ params: this.multipleSelection[0].id }).then(res => {
                      if (res.errcode === '0000') {
                          this.modifyTaskInfo = res.result;
                          this.dialogModifyVisible = true;
                      }
                  });
              } else {
                  this.$notify.warning({
                      title: '消息',
                      message: this.multipleSelection.length === 0 ? '请选择一条记录' : '只能选择一条记录',
                      duration: 600
                  });
              }
          },
          handleAddTask() {
              this.$refs.addTask.validate((valid) => {
                  if (valid) {
                      const params = {
                          taskName: this.addTaskInfo.taskName,
                          taskType: this.addTaskInfo.taskType,
                          taskDesc: this.addTaskInfo.taskDesc || null,
                          taskParam: this.addTaskInfo.taskParam || null,
                          taskParamDesc: this.addTaskInfo.taskParamDesc || null,
                          classFullname: this.addTaskInfo.classFullname,
                          execApi: this.addTaskInfo.execApi || null,
                          status: this.addTaskInfo.status || null
                      };
                      addTask({ params }).then(res => {
                          if (res.errcode === '0000') {
                              this.$notify({
                                  title: '成功',
                                  message: '添加服务成功',
                                  type: 'success',
                                  duration: 1000
                              });
                              this.dialogAddVisible = false;
                              this.getTaskList();
                          }
                      });
                  } else {
                      return false;
                  }
              });
          },
          handleModifyTask() {
              this.$refs.modifyTask.validate((valid) => {
                  if (valid) {
                      const params = {
                          id: this.modifyTaskInfo.id,
                          taskName: this.modifyTaskInfo.taskName,
                          taskType: this.modifyTaskInfo.taskType,
                          taskDesc: this.modifyTaskInfo.taskDesc || '',
                          taskParam: this.modifyTaskInfo.taskParam || '',
                          taskParamDesc: this.modifyTaskInfo.taskParamDesc || '',
                          classFullname: this.modifyTaskInfo.classFullname,
                          execApi: this.modifyTaskInfo.execApi || '',
                          status: this.modifyTaskInfo.status || ''
                      };
                      modifyTask({ params }).then(res => {
                          if (res.errcode === '0000') {
                              this.$notify({
                                  title: '成功',
                                  message: '修改服务成功',
                                  type: 'success',
                                  duration: 1000
                              });
                              this.dialogModifyVisible = false;
                              this.getTaskList(this.currentPage);
                          }
                      });
                  } else {
                      return false;
                  }
              });
          }
      },
      watch: {
      },
      mixins: [butVisibleMixin, publicMixin]
  };
</script>

<style lang="scss">
  @import '../../styles/common.scss';
  .task-config {
    margin: 30px auto 0;
    width: 1120px;
    .el-dialog__wrapper {
      top: 50px;
      left: 200px;
    }
  }
</style>
