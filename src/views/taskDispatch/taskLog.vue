<template>
    <div class="task-log">
        <div class="query-container" ref="queryContainer" style="height:166px;">
            <el-form :inline="true" :model="form" label-width="100px" style="width:1072px;margin:auto;">
                <el-form-item label="任务类型:">
                    <el-select size="small" v-model="form.taskType" filterable clearable>
                        <el-option v-for="item in taskTypes" :key="item.id" :label="item.caption" :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务执行时间:">
                    <el-date-picker size="small" type="datetime" v-model="form.startDate" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="开始时间"></el-date-picker> 至 <el-date-picker size="small" v-model="form.endDate" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd" placeholder="结束时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="任务名称:">
                    <el-input size="small" v-model="form.taskName" style="width: 194px;"></el-input>
                </el-form-item>
                <el-form-item label="任务ID:">
                    <el-input size="small" v-model="form.taskId" style="width: 194px;"></el-input>
                </el-form-item>
                <el-form-item label="任务执行结果:">
                    <el-select size="small" v-model="form.taskResult">
                        <el-option v-for="item in taskResults" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="query-btn">
                <el-button @click="clearQueryParams" size="small" type="primary" icon="delete">清空</el-button>
                <el-button @click="queryTaskList" size="small" type="primary" icon="search">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea(166)">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" justify="start">
                <el-col :span="2" v-if="btnShow"><el-button size="small" type="primary" @click="againExecute">重新执行</el-button></el-col>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="任务日志ID" prop="id" width="120">
                </el-table-column>
                <el-table-column label="任务ID" prop="taskId" width="100">
                </el-table-column>
                <el-table-column label="任务名称" prop="taskName" width="180">
                </el-table-column>
                <el-table-column label="任务类型" prop="taskTypeDesc" width="100">
                </el-table-column>
                <el-table-column label="接口地址" prop="execApi" width="180">
                </el-table-column>
                <el-table-column label="任务参数" prop="taskParam" width="180">
                </el-table-column>
                <el-table-column label="执行结果" prop="statusDesc" width="100">
                </el-table-column>
                <el-table-column label="开始时间" prop="execStartTime" width="180">
                </el-table-column>
                <el-table-column label="结束时间" prop="execEndTime" width="180">
                </el-table-column>
                <el-table-column label="任务耗时" prop="timeConsumed" width="100">
                </el-table-column>
                <el-table-column label="失败原因" prop="failReason" width="100">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalTasks" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </div>
        <el-dialog title="重新执行" @open="openNewAddModal" :visible.sync="dialogAgainExecuteVisible" :close-on-click-modal="false">
            <el-form :model="againExecuteInfo" label-width="78px" ref="newAddUser" style="width:540px;margin:auto;" >
                <el-form-item label="任务名称:">
                    <el-input v-model="againExecuteInfo.taskName" disabled></el-input>
                </el-form-item>
                <el-form-item label="任务接口:">
                    <el-input v-model="againExecuteInfo.execApi" disabled></el-input>
                </el-form-item>
                <el-form-item label="参数说明:">
                    <el-input v-model="againExecuteInfo.taskParamDesc" disabled></el-input>
                </el-form-item>
                <el-form-item label="执行参数:">
                    <el-input type="textarea" :rows="10" v-model="againExecuteInfo.taskParam"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleAgainExecute">确 定</el-button>
                <el-button @click="dialogAgainExecuteVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getSelectList } from '@/api/userManage';
import { formatLongDate } from '@/utils';
import {
    getTaskLogLists,
    againExecuteApi,
    confirmExecuteApi
} from '@/api/taskLog';
import publicMixin from '@/utils/publicMethod';
import butVisibleMixin from '@/utils/buttonVisible';

export default {
    name: 'taskLog',
    data() {
        return {
            form: {
                taskType: '',
                taskName: '',
                taskId: '',
                startDate: '',
                endDate: '',
                taskResult: ''
            },
            taskTypes: [],
            taskResults: [],
            tableData: [],
            loading: false,
            noTableData: '',
            totalTasks: 0,
            pageSize: 10,
            currentPage: 1,
            multipleSelection: [],
            dialogAgainExecuteVisible: false,
            againExecuteInfo: {},
            beCompareExecuteParams: {},
            btnShow: true,
            queryContainerShrink: false
        };
    },
    created() {
        this.initQueryParam();
        this.getTaskTypeLists();
        this.getTaskResults();
        this.getTaskLists();
    },
    methods: {
        initQueryParam() {
            if (this.$route.query.taskId) {
                this.form.taskId = this.$route.query.taskId;
            }
        },
        getTaskTypeLists() {
            getSelectList({ params: { code: '1037' }}).then(res => {
                if (res.errcode === '0000') {
                    this.taskTypes = res.result;
                }
            });
        },
        getTaskResults() {
            getSelectList({ params: { code: '1038' }}).then(res => {
                if (res.errcode === '0000') {
                    this.taskResults = res.result;
                }
            });
        },
        getTaskLists(page) {
            const pageNo = page || 1;
            let sd;
            let ed;
            if (this.form.startDate) {
                sd = formatLongDate(this.form.startDate);
            } else {
                sd = '';
            }
            if (this.form.endDate) {
                ed = formatLongDate(this.form.endDate);
            } else {
                ed = '';
            }

            const params = { pageNo: pageNo, pageSize: this.pageSize, taskId: this.form.taskId, taskType: this.form.taskType, taskName: this.form.taskName, execStartTime: sd, execEndTime: ed, status: this.taskResult };
            getTaskLogLists({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows;
                    this.totalTasks = res.result.totalCount;
                }
            });
        },
        clearQueryParams() {
            for (const i in this.form) {
                this.form[i] = '';
            }
        },
        queryTaskList() {
            this.getTaskLists(this.currentPage);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTaskLists(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTaskLists(this.currentPage);
        },
        againExecute() {
            if (this.multipleSelection.length === 1) {
                againExecuteApi({ params: this.multipleSelection[0].taskId }).then(res => {
                    if (res.errcode === '0000') {
                        this.againExecuteInfo = res.result;
                        this.beCompareExecuteParams = JSON.parse(res.result.taskParam);
                        this.dialogAgainExecuteVisible = true;
                    }
                });
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条信息查看' : '只能选择一条信息查看',
                    duration: 600
                });
            }
        },
        handleAgainExecute() {
            const arr1 = Object.keys(this.beCompareExecuteParams);
            const arr2 = Object.keys(JSON.parse(this.againExecuteInfo.taskParam));
            let flag = false;
            arr1.forEach((i) => {
                if (!arr2.includes(i)) {
                    this.$notify.warning({
                        title: '消息',
                        message: '执行参数不符合要求，请修改',
                        duration: 600
                    });
                    flag = true;
                    return;
                }
            });
            if (flag) return;
            arr2.forEach((i) => {
                if (!arr1.includes(i)) {
                    this.$notify.warning({
                        title: '消息',
                        message: '执行参数不符合要求，请修改',
                        duration: 600
                    });
                    flag = true;
                    return;
                }
            });
            if (flag) return;
            const params = Object.assign({ taskId: this.againExecuteInfo.id }, JSON.parse(this.againExecuteInfo.taskParam));
            confirmExecuteApi({ params }, this.againExecuteInfo.execApi).then(res => {
                if (res.errcode === '0000') {
                    this.getTaskLists();
                }
            });
        }
    },
    watch: {
        multipleSelection(newValue) {
            if (newValue.some((el) => {
                return el.status === '0' && el.execApi !== '';
            })) {
                this.btnShow = true;
            } else {
                this.btnShow = false;
            }
        }
    },
    mixins: [butVisibleMixin, publicMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.task-log{
    margin: 30px auto 0;
    width: 1120px;
    .el-dialog__wrapper{
        top: 50px;
        left: 200px;
    }
}
</style>
