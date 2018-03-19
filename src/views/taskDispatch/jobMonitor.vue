<template>
  <div class="job-monitor">
    <div class="query-container" ref="queryContainer" style="height:166px;">
      <el-form :inline="true" :model="form" label-width="100px" style="width:1072px;margin:auto;">
        <el-form-item label="调度器状态:">
          <span :class="{ 'status-a' : isStart, 'status-b' : isStop, 'status-': isUnknown }" style="width: 194px;">{{scheduleStatus}}</span >
        </el-form-item>
        <el-form-item label="作业名称:">
          <el-input size="small" class="" v-model="form.jobName" style="width: 194px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="query-btn">
        <el-button v-if="buttonVisible['2140401']" @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button>
        <el-button v-if="buttonVisible['2140402']" @click="queryJobTriggerList" size="small" type="primary" icon="search">查询</el-button>
        <el-button v-if="buttonVisible['2140404']" @click="startScheduler" size="small" type="primary" icon="delete">启动调度器</el-button>
        <el-button v-if="buttonVisible['2140405']" @click="stopScheduler" size="small" type="primary" icon="delete">暂停调度器</el-button>
      </div>
      <div class="draggable" @click="shrinkQueryArea(166)">
        <icon-svg icon-class="hamburger"/>
      </div>
    </div>
    <div class="manage-container">
      <el-row type="flex" justify="start">
        <el-col :span="2" v-if="buttonVisible['2140406']">
          <el-button size="small" type="primary" @click="execJob">立即执行一次</el-button>
        </el-col>
        <el-col :span="2" v-if="buttonVisible['2140407']">
          <el-button size="small" type="primary" @click="restartJob">重启作业</el-button>
        </el-col>
        <el-col :span="2" v-if="buttonVisible['2140408']">
          <el-button size="small" type="primary" @click="stopJob">停止作业</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable"
                v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="作业名称" align="center" prop="jobName" width="150">
        </el-table-column>
        <el-table-column label="作业描述" align="center" prop="jobDesc" width="180">
        </el-table-column>
        <el-table-column label="服务类型" align="center" prop="serviceTypeDesc" width="100">
        </el-table-column>
        <el-table-column label="触发器表达式" align="center" prop="cronExpr" width="150">
        </el-table-column>
        <el-table-column label="触发器状态" align="center" prop="triggerStatus" width="100">
        </el-table-column>
        <el-table-column label="上次触发时间" align="center" prop="prevFireTimeStr" width="170">
        </el-table-column>
        <el-table-column label="下次触发时间" align="center" prop="nextFireTimeStr" width="170">
        </el-table-column>
        <el-table-column label="日志" align="center" width="80">
          <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <span class="operate"> <a @click="$router.push('/system/taskDispatch/taskLog?taskId='+scope.row.jobGroupName)">查看日志</a></span>
              </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalJob" :page-size="pageSize"
                       :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"></el-pagination>
      </div>
    </div>
    <el-dialog title="暂停调度器" :visible.sync="dialogStopSchedulerVisible" :close-on-click-modal="false" class="reset-dialog-width" @open="openNewAddModal">
      <div class="el-message-box__status el-icon-warning"></div><p style="padding-left:40px;">请确认是否暂停调度器，暂停后，所有作业将停止运行？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleStopScheduler">确 定</el-button>
        <el-button @click="dialogStopSchedulerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="立即执行一次" :visible.sync="dialogExecJobVisible" :close-on-click-modal="false" class="reset-dialog-width" @open="openNewAddModal">
      <div class="el-message-box__status el-icon-warning"></div><p style="padding-left:40px;">请确认是否执行？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleExecJob">确 定</el-button>
        <el-button @click="dialogExecJobVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重启作业" :visible.sync="dialogRestartJobVisible" :close-on-click-modal="false" class="reset-dialog-width" @open="openNewAddModal">
      <div class="el-message-box__status el-icon-warning"></div><p style="padding-left:40px;">请确认是否重启作业？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleRestartJob">确 定</el-button>
        <el-button @click="dialogRestartJobVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="停止" :visible.sync="dialogStopJobVisible" :close-on-click-modal="false" class="reset-dialog-width" @open="openNewAddModal">
      <div class="el-message-box__status el-icon-warning"></div><p style="padding-left:40px;">请确认是否停止作业？</p>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleStopJob">确 定</el-button>
        <el-button @click="dialogStopJobVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  // import { getSelectList } from '@/api/userManage';
  // import { formatLongDate } from '@/utils';
  import {
    getSchedulerStatus,
    startScheduler,
    stopScheduler,
    getJobTriggerList,
    execJob,
    restartJob,
    stopJob
  } from '@/api/jobMonitor';
  import publicMixin from '@/utils/publicMethod';
  import butVisibleMixin from '@/utils/buttonVisible';

  export default {
      name: 'jobMonitor',
      data() {
          return {
              pageId: '21404',
              form: {
                  jobName: '',
                  serviceType: ''
              },
              scheduleStatus: '未知',
              isStart: false,
              isStop: false,
              isUnknown: true,
              taskTypes: [],
              tableData: [],
              loading: false,
              noTableData: '',
              totalJob: 0,
              pageSize: 10,
              currentPage: 1,
              multipleSelection: [],
              dialogStopSchedulerVisible: false,
              dialogExecJobVisible: false,
              dialogRestartJobVisible: false,
              dialogStopJobVisible: false,
              queryContainerShrink: false,
              timerId: ''
          };
      },
      created() {
          this.getSchedulerStatus();
          this.getJobTriggerList();
          this.initTimer();
      },
      methods: {
          initTimer() {
              if (this.timerId) {
                  clearInterval(this.timerId);
              }
              this.timerId = setInterval(function() {
                  getSchedulerStatus().then(res => {
                      if (res.errcode === '0000') {
                          this.scheduleStatus = res.result.status;
                          if (this.scheduleStatus === '正在运行') {
                              this.isStart = true;
                              this.isStop = false;
                              this.isUnknown = false;
                          } else if (this.scheduleStatus === '停止') {
                              this.isStart = false;
                              this.isStop = true;
                              this.isUnknown = false;
                          } else {
                              this.isStart = false;
                              this.isStop = false;
                              this.isUnknown = true;
                          }
                      }
                  });
              }, 60000);
          },
          getSchedulerStatus() {
              getSchedulerStatus().then(res => {
                  if (res.errcode === '0000') {
                      this.scheduleStatus = res.result.status;
                      if (this.scheduleStatus === '正在运行') {
                          this.isStart = true;
                          this.isStop = false;
                          this.isUnknown = false;
                      } else if (this.scheduleStatus === '停止') {
                          this.isStart = false;
                          this.isStop = true;
                          this.isUnknown = false;
                      } else {
                          this.isStart = false;
                          this.isStop = false;
                          this.isUnknown = true;
                      }
                  }
              });
          },
          getJobTriggerList(page) {
              const pageNo = page || 1;
              const params = {
                  pageNo: pageNo,
                  pageSize: this.pageSize,
                  jobName: this.form.jobName || null
              };
              getJobTriggerList({ params }).then(res => {
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
          queryJobTriggerList() {
              this.getJobTriggerList(this.currentPage);
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
          startScheduler() {
              startScheduler().then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '调度器启动成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.getSchedulerStatus();
                      this.getJobTriggerList();
                  }
              });
          },
          stopScheduler() {
              this.dialogStopSchedulerVisible = true;
          },
          handleStopScheduler() {
              stopScheduler().then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '暂停调度器成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.dialogStopSchedulerVisible = false;
                      this.getSchedulerStatus();
                      this.getJobTriggerList();
                  }
              });
          },
          execJob() {
              if (this.multipleSelection.length === 1) {
                  this.dialogExecJobVisible = true;
              } else {
                  this.$notify.warning({
                      title: '消息',
                      message: this.multipleSelection.length === 0 ? '请选择一条记录' : '只能选择一条记录',
                      duration: 600
                  });
              }
          },
          handleExecJob() {
              const params = {
                  jobName: this.multipleSelection[0].jobName + '-' + this.multipleSelection[0].jobId,
                  jobGroupName: this.multipleSelection[0].jobGroupName
              };
              execJob({ params }).then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '执行作业成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.dialogExecJobVisible = false;
                      this.getJobTriggerList();
                  }
              });
          },
          restartJob() {
              if (this.multipleSelection.length === 1) {
                  this.dialogRestartJobVisible = true;
              } else {
                  this.$notify.warning({
                      title: '消息',
                      message: this.multipleSelection.length === 0 ? '请选择一条记录' : '只能选择一条记录',
                      duration: 600
                  });
              }
          },
          handleRestartJob() {
              const params = {
                  jobName: this.multipleSelection[0].jobName + '-' + this.multipleSelection[0].jobId,
                  jobGroupName: this.multipleSelection[0].jobGroupName
              };
              restartJob({ params }).then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '重启作业成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.dialogRestartJobVisible = false;
                      this.getJobTriggerList();
                  }
              });
          },
          stopJob() {
              if (this.multipleSelection.length === 1) {
                  this.dialogStopJobVisible = true;
              } else {
                  this.$notify.warning({
                      title: '消息',
                      message: this.multipleSelection.length === 0 ? '请选择一条记录' : '只能选择一条记录',
                      duration: 600
                  });
              }
          },
          handleStopJob() {
              const params = {
                  jobName: this.multipleSelection[0].jobName + '-' + this.multipleSelection[0].jobId,
                  jobGroupName: this.multipleSelection[0].jobGroupName
              };
              stopJob({ params }).then(res => {
                  if (res.errcode === '0000') {
                      this.$notify({
                          title: '成功',
                          message: '停止作业成功',
                          type: 'success',
                          duration: 1000
                      });
                      this.dialogStopJobVisible = false;
                      this.getJobTriggerList();
                  }
              });
          } },
      watch: {
      },
      mixins: [butVisibleMixin, publicMixin]
  };
</script>

<style lang="scss">
  @import '../../styles/common.scss';

  .job-monitor {
    margin: 30px auto 0;
    width: 1120px;
    .el-dialog__wrapper {
      top: 50px;
      left: 200px;
    }
  }
  .operate{
    color: #409EFF;
    font-size: 12px;
    cursor: pointer;
    padding: 0 3px;
  }

  .status-a{
    color: #11b95c;
  }
  .status-b{
    color: red;
  }
  .status-c{
    color: #409EFF;
  }
</style>
