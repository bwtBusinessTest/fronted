<template>
    <div class="group-order">
        <div class="query-container" ref="queryContainer" style="height:166px;">
            <el-form :inline="true" :model="form" label-width="100px" ref="groupOrderFrom">
                <el-row>
                    <el-form-item label="分销商:">
                        <el-select size="small" v-model="form.retail" filterable clearable>
                            <el-option v-for="item in retails" :label="item.name" :value="item.code" :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单日期:">
                        <el-date-picker size="small" v-model="form.startDate" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker> 至 <el-date-picker size="small" v-model="form.endDate" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="团购单号:">
                        <el-input size="small" v-model="form.orderNum" style="width:194px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-select size="small" v-model="form.status" filterable clearable>
                            <el-option v-for="item in retailStatus" :label="item.caption" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button @click="clear" size="small" type="primary" icon="delete" v-if="buttonVisible['3020101']"></icon>清空</el-button>
                <el-button @click="query" size="small" type="primary" icon="search" v-if="buttonVisible['3020102']">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" justify="start">
                <el-col :span="2" v-if="buttonVisible['3020103']"><el-button @click="newAdd" size="small" type="primary" icon="plus">新增</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3020109']"><el-button @click="download" size="small" type="primary"><icon-svg icon-class="down" />下载</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3020110']"><el-button @click="checkDetail" size="small" type="primary" icon="check">查看明细</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3020116'] && orderCheckBtnShow"><el-button @click="orderVerify" size="small" type="primary" icon="edit">订单审核</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3020117'] && confirChargeBtnShow"><el-button @click="confirmCharge" size="small" type="primary" icon="setting" >确认充值</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3020118'] && orderCancelBtnShow"><el-button @click="orderCancel" size="small" type="primary"><icon-svg icon-class="cancel"/>订单撤销</el-button></el-col>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" @select-all="handleSelectAll" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)" :empty-text="noTableData" :height="tableHeight">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="分销商" prop="distributorName" width="100">
                </el-table-column>
                <el-table-column label="团购单号" prop="groupOrderNo" width="110" align="center">
                </el-table-column>
                <el-table-column label="订单名称" prop="groupOrderName" width="160" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="应/实发量(笔)" prop="count" width="130" align="center">
                </el-table-column>
                <el-table-column label="应/实发额(元)" prop="money" width="130" align="center">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime" width="170">
                </el-table-column>
                <el-table-column label="申请人" prop="createUserName" width="100">
                </el-table-column>
                <el-table-column label="状态" prop="statusDesc" width="100">
                </el-table-column>
                <el-table-column label="状态更新" prop="updateTime" width="170">
                </el-table-column>
                <el-table-column label="处理信息" prop="processReason" width="100">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </div>
        <el-dialog title="新增团购订单" @close="clearNewAdd" @open="openNewAddModal" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false" :before-close="handleBeforeClose">
            <el-form :model="groupOrder" label-width="78px" ref="newAddGroupOrder" :rules="groupOrderRules">
                <el-form-item label="分销商:" prop="retail">
                    <el-select size="small" v-model="groupOrder.retail" filterable clearable>
                        <el-option v-for="item in retails" :label="item.name" :value="item.code" :key="item.code">
                            </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值文件:">
                    <el-upload
                        type="file"
                        class="upload-demo"
                        ref="uploadBtn"
                        :headers="uploadHeaders"
                        :action="uploadUrl"
                        :data="uploadData"
                        name="detailFile"
                        :show-file-list="false"
                        :before-upload="beforeUpload"
                        :on-change="handleChange"
                        :file-list="fileList3"
                        :on-progress="handleProcess"
                        :on-success="handleSuccess"
                        :on-error="handleError">
                        <el-button size="small" type="primary" :loading="btnLoading">点击上传</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="模版下载:">
                    <el-button @click="downloadTemplate" size="small" type="primary">点击下载</el-button>
                </el-form-item>
            </el-form>
            <ul>
                <li v-if="fileList3.length > 0 && uploadSuccess" class="upload-process">
                    {{fileList3[0].name}}
                    <el-progress :percentage="uploadProcessValue"></el-progress>
                    <span @click="clearFileList">x</span>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="dialogNewAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogNewAddVisible = false">确 定</el-button> -->
            </div>
        </el-dialog>
        <el-dialog :title="IRTitle" @open="openNewAddModal" :visible.sync="dialogAddPreviewVisible" :close-on-click-modal="false" class="large-dialog">
            <div class="preview-container">
                <el-form :inline="true" :model="importResultData" label-width="100px">
                    <el-row>
                        <el-form-item label="分销商:" style="margin-bottom:0;width:200px;">
                            <span>{{importResultData.distributorName}}</span>
                        </el-form-item>
                        <el-form-item label="订单名称:" style="margin-bottom:0;">
                            <span>{{importResultData.orderName}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="导入成功:" style="margin-bottom:0;width:200px;">
                            <span>{{importResultData.successCount}}</span>
                        </el-form-item>
                        <el-form-item label="导入失败:" style="margin-bottom:0;">
                            <span>{{importResultData.failCount}}</span>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="合计金额:">
                            <span>{{importResultData.totalBalance}}</span>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div class="table-container">
                    <el-row v-if="IRBtnShow">
                        <el-button size="small" type="primary" icon="setting" @click="IRApplication">确认申请</el-button>
                        <el-button size="small" type="primary" icon="setting" @click="againImport">重新导入</el-button>
                        <el-button size="small" type="primary" @click="IRDownload">
                            下载结果
                            <!-- <a :href="IRDownload()" download><icon-svg icon-class="down"/>下载结果</a> -->
                        </el-button>
                    </el-row>
                    <el-table :data="IRtableData" border ref="multipleTable2" height="300">
                        <el-table-column label="序号" prop="sno" width="80">
                        </el-table-column>
                        <el-table-column label="用户手机号" prop="userTelphone" width="130">
                        </el-table-column>
                        <el-table-column label="用户ID" prop="userId" width="80">
                        </el-table-column>
                        <el-table-column label="卡券ID" prop="cardId" width="80">
                        </el-table-column>
                        <el-table-column label="卡券名称" prop="cardName" width="100">
                        </el-table-column>
                        <el-table-column label="数量" prop="grantAmount" width="80">
                        </el-table-column>
                        <el-table-column label="结算金额(元)" prop="grantBalance" width="120">
                        </el-table-column>
                        <el-table-column label="导入状态" prop="statusDesc" width="100">
                        </el-table-column>
                        <el-table-column label="导入提示" prop="failReason" width="108">
                        </el-table-column>
                    </el-table>
                    <div class="page-container">
                        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="IRTotalrows" :page-size="IRPageSize" :page-sizes="[10, 20, 30]" @current-change="IRhandleCurrentChange" @size-change="IRhandleSizeChange"></el-pagination>
                    </div>
                </div>
            </div>

        </el-dialog>
        <el-dialog title="订单审核" @open="openNewAddModal" :visible.sync="dialogOrderVerifyVisible" :close-on-click-modal="false">
            <el-form :inline="true" :model="verifyInfo" label-width="78px" ref="newAddGroupOrder" style="width:580px;margin:auto;">
                <el-form-item label="订单号:">
                    <span style="width:400px;display:inline-block;">{{ verifyInfo.groupOrderNo }}</span>
                </el-form-item>
                <el-form-item label="分销商:">
                    <span style="width:260px;display:inline-block;">{{ verifyInfo.distributorName }}</span>
                </el-form-item>
                <el-form-item label="订单名称:">
                    <span style="width:134px;display:inline-block;">{{ verifyInfo.groupOrderName }}</span>
                </el-form-item>
                <el-form-item label="充值笔数:">
                    <span style="width:260px;display:inline-block;">{{ verifyInfo.totalChargeCount }}笔</span>
                </el-form-item>
                <el-form-item label="合计金额:">
                    <span>{{ verifyInfo.totalChargeBalance }}元</span>
                </el-form-item>
                <el-form-item label="审核备注:">
                    <el-input type="textarea" :rows="4" v-model="verifyInfo.remark" style="width:480px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="orderCheck(true)">同意</el-button>
                <el-button type="primary" @click="orderCheck(false)">不同意</el-button>
                <el-button @click="dialogOrderVerifyVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import $ from 'jquery';
import { getDistributors,
        getUploadProcess,
        getImportResult,
        IRApplication,
        getGroupOrders,
        checkOrder,
        orderCancel,
        orderCharge,
        groupOrderDownloadUrl,
        IRDownloadUrl,
        groupOrderUploadUrl,
        downloadTemplateUrl,
        getStatusLists,
        cancelImport,
        getImportStatus
} from '../../api/groupOrder';
import { getToken } from '@/utils/auth';
import { formatDate } from '@/utils';
import { mapState } from 'vuex';
import butVisibleMixin from '../../utils/buttonVisible';

export default {
    data() {
        return {
            pageId: '30201',
            form: {
                retail: '',
                startDate: '',
                endDate: '',
                orderNum: '',
                status: ''
            },
            retails: [],
            retailStatus: [],
            noTableData: '',
            loading: false,
            tableData: [],
            currentPage: 1,
            pageSize: 20,
            totalRows: 0,
            multipleSelection: [],
            dialogNewAddVisible: false,
            dialogOrderVerifyVisible: false,
            dialogAddPreviewVisible: false,
            groupOrder: {
                retail: ''
            },
            fileList3: [],
            verifyInfo: {},
            groupOrderNo: '',
            uploadProcessValue: 0,
            uploadHeaders: { Authorization: getToken() },
            importResultData: {},
            IRtableData: [],
            IRTotalrows: 0,
            IRPageSize: 10,
            IRCurrentPage: 1,
            IROrderNo: '',
            refresh: 'refresh',
            uploadUrl: groupOrderUploadUrl(),
            orderCancelBtnShow: false,
            confirChargeBtnShow: false,
            orderCheckBtnShow: false,
            uploadSuccess: false,
            btnLoading: false,
            queryContainerShrink: false,
            IRBtnShow: true,
            IRTitle: '新增确认预览',
            groupOrderRules: {
                retail: [{ required: true, message: '请选择分销商', trigger: 'change' }]
            },
            manualCancelUpload: false
        };
    },
    created() {
        this.getDistributors();
        this.getStatus();
        this.getGroupOrders();
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.userInfo,
            isCollapse: state => state.app.sidebar.opened
        }),
        uploadData() {
            return { distributorCode: this.groupOrder.retail, groupOrderNo: this.groupOrderNo };
        },
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 400;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        }
    },
    methods: {
        getDistributors() {
            getDistributors({}).then(res => {
                if (res.errcode === '0000') {
                    this.retails = res.result;
                }
            });
        },
        getStatus() {
            getStatusLists().then(res => {
                if (res.errcode === '0000') {
                    this.retailStatus = res.result;
                }
            });
        },
        getGroupOrders(page) {
            const pageNo = page || 1;
            let sd;
            let ed;
            if (this.form.startDate) {
                sd = formatDate(this.form.startDate);
            } else {
                sd = '';
            }
            if (this.form.endDate) {
                ed = formatDate(this.form.endDate);
            } else {
                ed = '';
            }
            const params = { pageNo: pageNo, pageSize: this.pageSize, distributorCode: this.form.retail, groupOrderNo: this.form.orderNum, beginApplyDate: sd, endApplyDate: ed, status: this.form.status };
            this.loading = true;
            getGroupOrders({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.totalRows = res.result.orders.totalCount;
                    this.tableData = res.result.orders.rows.filter(item => {
                        item.count = `${item.totalChargeCount}/${item.factChargeCount}`;
                        item.money = `${item.totalChargeBalance}/${item.factChargeBalance}`;
                        return item;
                    });
                    this.loading = false;
                }
            });
        },
        clear() {
            // this.$refs.groupOrderFrom.resetFields();
            this.form.retail = '';
            this.form.startDate = '';
            this.form.endDate = '';
            this.form.orderNum = '';
            this.form.status = '';
        },
        query() {
            this.getGroupOrders(this.currentPage);
        },
        newAdd() {
            this.groupOrderNo = '';
            this.dialogNewAddVisible = true;
        },
        againImport() {
            this.dialogAddPreviewVisible = false;
            getImportStatus({ params: this.groupOrderNo }).then(res => {
                if (res.errcode === '0000') {
                    if (res.hashMap.status === '3') {
                        this.dialogNewAddVisible = true;
                    } else {
                        this.$notify.warning({
                            title: '消息',
                            message: '上次导入未完成，请稍后重试',
                            duration: 600
                        });
                    }
                }
            });
        },
        download() {
            let sd;
            let ed;
            if (this.form.startDate) {
                sd = formatDate(this.form.startDate);
            } else {
                sd = '';
            }
            if (this.form.endDate) {
                ed = formatDate(this.form.endDate);
            } else {
                ed = '';
            }
            const params = { pageNo: this.currentPage, pageSize: this.pageSize, distributorCode: this.form.retail, beginApplyDate: sd, endApplyDate: ed, groupOrderNo: this.form.orderNum, status: this.form.status };
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'post', action: groupOrderDownloadUrl() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            const input2 = $('<input>');
            input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
            $('body').append(form);
            form.append(input1);
            form.append(input2);
            form.submit();
        },
        IRDownload() {
            const url = IRDownloadUrl({ params: this.groupOrderNo });
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'get', action: url });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            $('body').append(form);
            form.append(input1);
            form.submit();
        },
        checkDetail() {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].status === '1' || this.multipleSelection[0].status === '2') {
                    this.groupOrderNo = this.multipleSelection[0].groupOrderNo;
                    this.getImportResult();
                    this.dialogAddPreviewVisible = true;
                } else {
                    this.$router.push({ path: '/cardVoucher/cardGBManage/orderDetail', query: { groupOrderNo: this.multipleSelection[0].groupOrderNo }});
                }
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条订单查看' : '只能选择一条订单查看',
                    duration: 600
                });
            }
        },
        orderVerify() {
            if (this.multipleSelection.length === 1) {
                this.verifyInfo = this.multipleSelection[0];
                if (this.verifyInfo.status === '3') {
                    this.verifyInfo.remark = '';
                    this.dialogOrderVerifyVisible = true;
                } else {
                    this.$notify.warning({
                        title: '消息',
                        message: '请先确认申请',
                        duration: 600
                    });
                }
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条订单查看' : '只能选择一条订单查看',
                    duration: 600
                });
            }
        },
        confirmCharge() {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].status === '4') {
                    this.$confirm('是否确认充值？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        orderCharge({ params: this.multipleSelection[0].id }).then(res => {
                            if (res.errcode === '0000') {
                                this.$notify({
                                    title: '成功',
                                    message: '充值成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.getGroupOrders();
                            }
                        });
                    }).catch(() => {});
                } else {
                    this.$notify.warning({
                        title: '消息',
                        message: '无操作权限',
                        duration: 600
                    });
                }
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条订单查看' : '只能选择一条订单查看',
                    duration: 600
                });
            }
        },
        orderCancel() {
            if (this.multipleSelection.length === 1) {
                if (this.multipleSelection[0].status === '1' && this.userInfo.id === this.multipleSelection[0].createUserId) {
                    if (!this.isCollapse) {
                        setTimeout(() => {
                            this.$nextTick(() => {
                                document.querySelector('.v-modal').style.left = '36px';
                            });
                        }, 100);
                    }
                    window.scrollTo(0, 0);
                    this.$confirm('是否确认撤销？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {
                        orderCancel({ params: this.multipleSelection[0].id }).then(res => {
                            if (res.errcode === '0000') {
                                this.$notify({
                                    title: '成功',
                                    message: '撤销成功',
                                    type: 'success',
                                    duration: 1000
                                });
                                this.getGroupOrders();
                            }
                        });
                    }).catch(() => {});
                } else {
                    this.$notify.warning({
                        title: '消息',
                        message: '无操作权限',
                        duration: 600
                    });
                }
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条用户查看' : '只能选择一条用户查看',
                    duration: 600
                });
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.multipleSelection.slice(0, this.multipleSelection.length - 1).forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row);
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getGroupOrders(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getGroupOrders(this.currentPage);
        },
        clearNewAdd() {
            this.groupOrder.retail = '';
            this.fileList3 = [];
            this.uploadProcessValue = 0;
            this.btnLoading = false;
            this.$refs.newAddGroupOrder.resetFields();
        },
        beforeUpload(file) {
            let off = false;
            this.$refs.newAddGroupOrder.validate((valid) => {
                if (!valid) {
                    off = true;
                }
            });
            if (off) return false;
        },
        handleChange(file, fileList) {
            this.fileList3 = fileList.slice(-3);
        },
        handleProcess(event, file, fileList) {
            this.btnLoading = true;
        },
        handleSuccess(response, file, fileList) {
            if (response.errcode === '0000') {
                setTimeout(() => {
                    this.btnLoading = false;
                    this.uploadSuccess = true;
                }, 3000);
                this.groupOrderNo = response.hashMap.groupOrderNo;
                this.timer = setInterval(() => {
                    getUploadProcess({ params: this.groupOrderNo }).then(res => {
                        if (res.errcode === '0000') {
                            if (res.hashMap.rate) {
                                this.uploadProcessValue = Number(res.hashMap.rate);
                            } else {
                                clearInterval(this.timer);
                                this.$message({
                                    message: '导入失败',
                                    type: 'error',
                                    duration: 3 * 1000
                                });
                            }
                        }
                    });
                }, 3000);
            } else {
                this.btnLoading = false;
                this.$message({
                    message: response.errmsg,
                    type: 'error',
                    duration: 3 * 1000
                });
            }
        },
        handleError(err, file, fileList) {
            if (err) {
                console.log(err);
            }
        },
        orderCheck(agree) {
            const params = { orderId: this.verifyInfo.id, processDesc: this.verifyInfo.remark, isPassed: agree };
            checkOrder({ params }).then((res) => {
                if (res.errcode === '0000') {
                    this.$notify({
                        title: '成功',
                        message: '审核成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.dialogOrderVerifyVisible = false;
                    this.getGroupOrders(this.currentPage);
                }
            });
        },
        getImportResult(currentPage) {
            const pageNo = currentPage || 1;
            const params = { pageNo: pageNo, pageSize: this.IRPageSize, groupOrderNo: this.groupOrderNo };
            getImportResult({ params }).then(res => {
                this.importResultData = res.result.order;
                this.IRtableData = res.result.orderDetail.rows;
                this.IRTotalrows = res.result.orderDetail.totalCount;
                this.IROrderNo = res.result.order.orderNo;
                this.dialogNewAddVisible = false;
                this.dialogAddPreviewVisible = true;
            });
        },
        IRhandleCurrentChange(val) {
            this.IRCurrentPage = val;
            this.getImportResult(this.IRCurrentPage);
        },
        IRhandleSizeChange(val) {
            this.IRPageSize = val;
            this.getImportResult(this.IRCurrentPage);
        },
        IRApplication() {
            this.$confirm('是否确认申请？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                IRApplication({ params: this.IROrderNo }).then((res) => {
                    if (res.errcode === '0000') {
                        this.$notify({
                            title: '成功',
                            message: '申请成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.dialogAddPreviewVisible = false;
                        this.getGroupOrders(this.currentPage);
                    }
                }).catch(() => {
                    // this.dialogAddPreviewVisible = false;
                });
            }).catch(() => {});
        },
        handleSelectAll() {
            this.$refs.multipleTable.clearSelection();
        },
        downloadTemplate() {
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'get', action: downloadTemplateUrl() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            $('body').append(form);
            form.append(input1);
            form.submit();
        },
        clearFileList() {
            this.fileList3 = [];
            this.$refs.uploadBtn.clearFiles();
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '166px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        openNewAddModal() {
            window.scrollTo(0, 0);
            if (!this.isCollapse) {
                this.$nextTick(() => {
                    document.querySelector('.v-modal').style.left = '36px';
                });
            }
        },
        handleBeforeClose(done) {
            if (this.uploadProcessValue > 0 && this.uploadProcessValue < 100) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        cancelImport({ params: this.groupOrderNo }).then(res => {
                            if (res.errcode === '0000') {
                                this.manualCancelUpload = true;
                                done();
                            }
                        });
                    })
                    .catch(_ => {});
            } else {
                this.manualCancelUpload = false;
                done();
            }
        }
    },
    watch: {
        uploadProcessValue(newValue) {
            if (newValue >= 100) {
                clearInterval(this.timer);
                this.getImportResult();
                this.getGroupOrders();
            }
        },
        multipleSelection(newValue) {
            if (newValue[0] && newValue[0].status === '1' && this.userInfo.id === newValue[0].createUserId) {
                this.orderCancelBtnShow = true;
            } else {
                this.orderCancelBtnShow = false;
            }
            if (newValue[0] && newValue[0].status === '4') {
                this.confirChargeBtnShow = true;
            } else {
                this.confirChargeBtnShow = false;
            }
            if (newValue[0] && newValue[0].status === '3') {
                this.orderCheckBtnShow = true;
            } else {
                this.orderCheckBtnShow = false;
            }
            if (newValue[0] && newValue[0].status === '2') {
                this.IRBtnShow = false;
                this.IRTitle = '导入结果';
            } else {
                this.IRBtnShow = true;
                this.IRTitle = '新增确认预览';
            }
        },
        isCollapse(newValue) {
            if (document.querySelector('.v-modal')) {
                if (newValue) {
                    document.querySelector('.v-modal').style.left = '200px';
                } else {
                    document.querySelector('.v-modal').style.left = '36px';
                }
            }
        }
    },
    mixins: [butVisibleMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.group-order{
    margin: 30px auto 0;
    width: 1120px;
    .manage-container{
        .el-col{
            margin-right: 30px;
        }
    }
    .large-dialog{
            .el-dialog{
                width: 900px;
            }
    }
    li.upload-process {
        list-style: none;
        display: flex;
        > div{
            width: 300px;
        }
        > span {
            color: red;
            display: none;
        }
        &:hover{
            > span{
                display: block;
            }
        }
    }
    .el-dialog__wrapper{
        top: 50px;
        left: 200px;
    }
}
</style>
