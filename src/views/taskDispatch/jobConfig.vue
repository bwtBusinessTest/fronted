<template>
  <div class="job-config">
    <div class="query-container" ref="queryContainer" style="height:166px;">
      <el-form :inline="true" :model="form" label-width="100px" style="width:1072px;margin:auto;">
        <el-form-item label="作业名称:">
          <el-input size="small" v-model="form.jobName" style="width: 194px;"></el-input>
        </el-form-item>
        <el-form-item label="服务类型:">
          <el-select size="small" v-model="form.serviceType" filterable clearable>
            <el-option v-for="item in taskTypes" :key="item.value" :label="item.caption" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="query-btn">
        <el-button v-if="buttonVisible['2140301']" @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button>
        <el-button v-if="buttonVisible['2140302']" @click="queryJobList" size="small" type="primary" icon="search">查询</el-button>
      </div>
      <div class="draggable" @click="shrinkQueryArea(166)">
        <icon-svg icon-class="hamburger"/>
      </div>
    </div>
    <div class="manage-container">
      <el-row type="flex" justify="start">
        <el-col :span="2" v-if="buttonVisible['2140303']" >
          <el-button size="small" type="primary" @click="addJob">新增</el-button>
        </el-col>
        <el-col :span="2" v-if="buttonVisible['2140304']" >
          <el-button size="small" type="primary" @click="deleteJob">删除</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable"
                v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height="500">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="作业ID" align="center" prop="jobId" width="120">
        </el-table-column>
        <el-table-column label="作业名称" align="center" prop="jobName" width="200">
        </el-table-column>
        <el-table-column label="作业描述" align="center" prop="jobDesc" width="330">
        </el-table-column>
        <el-table-column label="服务类型" align="center" prop="serviceTypeDesc" width="100">
        </el-table-column>
        <el-table-column label="触发器表达式" align="center" prop="cronExpr" width="120">
        </el-table-column>
        <el-table-column label="作业参数" align="center" prop="jobDataStr" width="300">
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalJob" :page-size="pageSize"
                       :page-sizes="[20, 50, 100]" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="新增" @open="openNewAddModal" @close="clearNewAdd" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
      <el-form :model="addJobInfo" :rules="addJobRules" label-width="100px" ref="addJob" style="width:540px;margin:auto;">
        <el-form-item label="作业名称:" prop="jobName">
          <el-input v-model="addJobInfo.jobName"></el-input>
        </el-form-item>
        <el-form-item label="作业描述:" prop="jobDesc">
          <el-input type="textarea" :rows="3" v-model="addJobInfo.jobDesc"></el-input>
        </el-form-item>
        <el-form-item label="服务类型:" prop="serviceType">
          <el-select size="small" v-model="addJobInfo.serviceType"  filterable clearable @change="changeCurrentServiceType">
            <el-option v-for="item in taskTypes" :key="item.value" :label="item.caption" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务:" prop="serviceId">
        <el-select size="small" v-model="addJobInfo.serviceId" filterable clearable @change="changeCurrentServiceId">
          <el-option v-for="item in taskList" :key="item.id" :label="item.taskName" :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="服务描述:" >
          <el-input type="textarea" :rows="3" v-model="addJobInfo.serviceDesc" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="执行参数:">
          <el-input v-model="addJobInfo.serviceParam" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="参数说明:" >
          <el-input type="textarea" :rows="3" v-model="addJobInfo.serviceParamDesc" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Cron表达式:" prop="cronExpr" >
          <el-input v-model="addJobInfo.cronExpr"></el-input>
        </el-form-item>
        <el-form-item label="作业参数:" prop="jobParam">
          <el-input v-model="addJobInfo.jobParam" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddJob">确 定</el-button>
        <el-button @click="dialogAddVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除" :visible.sync="dialogRemoveVisible" :close-on-click-modal="false" class="reset-dialog-width"
               @open="openNewAddModal">
      <div class="el-message-box__status el-icon-warning"></div>
      <p style="padding-left:40px;">请确认是否删除作业？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRemoveJob">确 定</el-button>
        <el-button @click="dialogRemoveVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getSelectList } from '@/api/userManage';
  // import { formatLongDate } from '@/utils';
  import {
    getJobByName,
    getTaskListByType,
    getJobList,
    addJob,
    removeJob
  } from '@/api/jobConfig';
  import publicMixin from '@/utils/publicMethod';
  import butVisibleMixin from '@/utils/buttonVisible';

  export default {
      name: 'jobConfig',
      data() {
          var validateJobName = (rule, value, callback) => {
              if (value) {
                  if (value.indexOf('-') > 0) {
                      callback('-字符为系统占用，作业名称不能包含-字符');
                  }
                  getJobByName({ params: value.trim() }).then(res => {
                      if (res.result.isExist) {
                          callback('作业名称已存在');
                      } else {
                          callback();
                      }
                  });
              }
          };
          return {
              pageId: '21403',
              form: {
                  jobName: '',
                  serviceType: ''
              },
              taskTypes: [],
              taskList: [],
              tableData: [],
              loading: false,
              noTableData: '',
              totalJob: 0,
              pageSize: 20,
              currentPage: 1,
              multipleSelection: [],
              dialogAddVisible: false,
              dialogRemoveVisible: false,
              addJobInfo: {
                  jobName: '',
                  jobDesc: '',
                  serviceType: '',
                  serviceId: '',
                  serviceDesc: '',
                  serviceParam: '',
                  serviceParamDesc: '',
                  cronExpr: '',
                  jobParam: ''
              },
              addJobRules: {
                  jobName: [{ validator: validateJobName, trigger: 'blur' }, { required: true, message: '请输入作业名称', trigger: 'blur' }, { max: 50, message: '最长50个字符', trigger: 'blur' }],
                  jobDesc: [{ max: 100, message: '最长100个字符', trigger: 'blur' }],
                  serviceType: [{ required: true, message: '请选择服务类型', trigger: 'blur' }],
                  serviceId: [{ required: true, message: '请选择服务', trigger: 'blur' }],
                  cronExpr: [{ required: true, max: 20, message: '最长20个字符', trigger: 'blur' }],
                  jobParam: [{ max: 500, message: '最长500个字符', trigger: 'blur' }]
              },
              queryContainerShrink: false
          };
      },
      created() {
          this.getTaskTypeList();
          this.getJobList();
      },
      methods: {
          getTaskTypeList() {
              getSelectList({ params: { code: '1037' }}).then(res => {
                  if (res.errcode === '0000') {
                      this.taskTypes = res.result;
                  }
              });
          },
          changeCurrentServiceType() {
              if (this.addJobInfo.serviceType !== '') {
                  const params = { taskType: this.addJobInfo.serviceType };
                  getTaskListByType({ params }).then(res => {
                      if (res.errcode === '0000') {
                          this.taskList = res.result;
                          this.addJobInfo.serviceId = '';
                          this.addJobInfo.serviceDesc = '';
                          this.addJobInfo.serviceParam = '';
                          this.addJobInfo.serviceParamDesc = '';
                      }
                  });
              } else {
                  this.taskList = [];
              }
          },
          changeCurrentServiceId() {
              if (this.addJobInfo.serviceId !== '') {
                  var task = this.taskList.find((value, index, arr) => {
                      return value.id === this.addJobInfo.serviceId;
                  });
                  if (task !== undefined) {
                      this.addJobInfo.serviceDesc = task.taskDesc;
                      this.addJobInfo.serviceParam = task.taskParam;
                      this.addJobInfo.serviceParamDesc = task.taskParamDesc;
                  }
              } else {
                  this.addJobInfo.serviceDesc = '';
                  this.addJobInfo.serviceParam = '';
                  this.addJobInfo.serviceParamDesc = '';
              }
          },
          getJobList(page) {
              const pageNo = page || 1;
              const params = {
                  pageNo: pageNo,
                  pageSize: this.pageSize,
                  serviceType: this.form.serviceType || null,
                  jobName: this.form.jobName || null
              };
              getJobList({ params }).then(res => {
                  if (res.errcode === '0000') {
                      this.tableData = res.result.rows;
                      this.totalJob = res.result.totalCount;
                  }
              });
          },
          clearQueryParams() {
              for (const i in this.form) {
                  this.form[i] = '';
              }
          },
          queryJobList() {
              this.getJobList(this.currentPage);
          },
          handleSelectionChange(val) {
              this.multipleSelection = val;
          },
          handleCurrentChange(val) {
              this.currentPage = val;
              this.getJobList(this.currentPage);
          },
          handleSizeChange(val) {
              this.pageSize = val;
              this.getJobList(this.currentPage);
          },
          addJob() {
              this.dialogAddVisible = true;
          },
          clearNewAdd() {
              for (var key in this.addJobInfo) {
                  this.addJobInfo[key] = '';
              }
              this.$refs.addJob.resetFields();
          },
          handleAddJob() {
              this.$refs.addJob.validate((valid) => {
                  if (valid) {
                      const params = {
                          jobName: this.addJobInfo.jobName,
                          jobDesc: this.addJobInfo.jobDesc || null,
                          serviceType: this.addJobInfo.serviceType || null,
                          serviceId: this.addJobInfo.serviceId || null,
                          jobParam: this.addJobInfo.jobParam || null,
                          cronExpr: this.addJobInfo.cronExpr
                      };
                      addJob({ params }).then(res => {
                          if (res.errcode === '0000') {
                              this.$notify({
                                  title: '成功',
                                  message: '添加作业成功',
                                  type: 'success',
                                  duration: 1000
                              });
                              this.dialogAddVisible = false;
                              this.getJobList();
                          }
                      });
                  } else {
                      return false;
                  }
              });
          },
          deleteJob() {
              if (this.multipleSelection.length === 1) {
                  this.dialogRemoveVisible = true;
              } else {
                  this.$notify.warning({
                      title: '消息',
                      message: this.multipleSelection.length === 0 ? '请选择一条记录' : '只能选择一条记录',
                      duration: 600
                  });
              }
          },
          handleRemoveJob() {
              removeJob({ params: { jobName: this.multipleSelection[0].jobName + '-' + this.multipleSelection[0].jobId, jobGroupName: this.multipleSelection[0].jobGroupName }}).then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '删除作业成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.dialogRemoveVisible = false;
                      this.getJobList();
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

  .job-config {
    margin: 30px auto 0;
    width: 1120px;
    .el-dialog__wrapper {
      top: 50px;
      left: 200px;
    }
  }
</style>
