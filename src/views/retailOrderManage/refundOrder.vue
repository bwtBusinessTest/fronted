<template>
    <div class="refund-order">
        <div class="query-container" ref="queryContainer" style="height:225px;">
            <el-form :inline="true" :model="form" label-width="100px">
                <el-row>
                    <el-form-item label="发行方:">
                        <el-select size="small" v-model="form.lssuer" filterable clearable style="width:210px;">
                            <el-option v-for="item in lssuers" :label="item.caption" :value="item.caption" :key="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单日期:">
                        <el-date-picker size="small" v-model="form.startDate" placeholder="开始日期"></el-date-picker> 至 <el-date-picker size="small" v-model="form.endDate" placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="分销商户:">
                        <el-select size="small" v-model="form.retail" filterable clearable style="width:210px;">
                            <el-option v-for="item in retails" :label="item.name" :value="item.code" :key="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分销单号:">
                        <el-input size="small" v-model="form.retailOrderNum" style="width:410px;"></el-input>
                    </el-form-item>
                </el-row>
                <el-form-item label="手机号:">
                    <el-input size="small" v-model="form.phone" style="width:210px;"></el-input>
                </el-form-item>
                <el-form-item label="商户单号:">
                    <el-input size="small" v-model="form.customerOrderNum" style="width:410px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="query-btn">
                <el-button @click="query" size="small" type="primary" icon="search" v-if="buttonVisible['3030402']">查询</el-button>
                <el-button @click="exportExcel" size="small" type="primary" v-if="buttonVisible['3030405']"><icon-svg icon-class="down"/>Excel导出</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" justify="start">
                <el-col :span="2" v-if="buttonVisible['3030407'] && checkBtnShow"><el-button @click="check" size="small" type="primary" icon="check">审核</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['3030410'] && returnGoodsBtnShow"><el-button @click="confirmReturnGoods" size="small" type="primary"><icon-svg icon-class="goods" />确认退货</el-button></el-col>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="分销商订单" prop="distributorOrderNo" width="120">
                </el-table-column>
                <el-table-column label="用户手机号" prop="userTelphone" width="130">
                </el-table-column>
                <el-table-column label="分销商户" prop="distributorName" width="120">
                </el-table-column>
                <el-table-column label="商户订单号" prop="orderNo" width="170">
                </el-table-column>
                <el-table-column label="退款订单号" prop="backCardOrderNo" width="170">
                </el-table-column>
                <el-table-column label="卡券名称" prop="cardName" width="100">
                </el-table-column>
                <el-table-column label="发行方" prop="publish" width="100">
                </el-table-column>
                <el-table-column label="原数量" prop="cardAmount" width="100">
                </el-table-column>
                <el-table-column label="原金额" prop="totalMoney" width="100">
                </el-table-column>
                <el-table-column label="退货数量" prop="backedAmount" width="100">
                </el-table-column>
                <el-table-column label="退金额(元)" prop="backedMoney" width="120">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime" width="180">
                </el-table-column>
                <el-table-column label="申请人" prop="createUser" width="100">
                </el-table-column>
                <el-table-column label="退货状态" prop="status" width="120">
                </el-table-column>
                <el-table-column label="审核时间" prop="updateTime" width="180">
                </el-table-column>
                <el-table-column label="审核人" prop="updateUser" width="100">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </div>
        <el-dialog title="退货申请审核" @open="openReturnGoodsApplication" :visible.sync="dialogReturnGoodsApplicationVisible" :close-on-click-modal="false">
            <el-form :model="returnGoodsApplicationInfo" label-width="78px" style="width:300px;margin:auto;">
                <el-form-item label="分销商:">
                    <span>{{returnGoodsApplicationInfo.distributorName}}</span>
                </el-form-item>
                <el-form-item label="订单号:">
                   <span>{{returnGoodsApplicationInfo.distributorOrderNo}}</span>
                </el-form-item>
                <el-form-item label="卡券名称:">
                   <span>{{returnGoodsApplicationInfo.cardName}}</span>
                </el-form-item>
                <el-form-item label="购买数量:">
                   <span>{{returnGoodsApplicationInfo.cardAmount}} 件</span>
                </el-form-item>
                <el-form-item label="最大可退:">
                   <span>{{returnGoodsApplicationInfo.maxBackedAmount}} 件</span>
                </el-form-item>
                <el-form-item label="退货数量:">
                   <span style="color:red;">{{returnGoodsApplicationInfo.backedAmount}}</span> 件
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleReturnGoodsApplication(true)">同 意</el-button>
                <el-button type="primary" @click="handleReturnGoodsApplication(false)">不同意</el-button>
                <el-button @click="dialogReturnGoodsApplicationVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getRefundOrders,
    refundOrderDownloadUrl,
    getReturnGoodsApplicationInfo,
    returnGoodsApplicationSubmit,
    confirmReturnGoodsApi
} from '@/api/retailOrderManage';
import $ from 'jquery';
import { getSelectList } from '@/api/userManage';
import { getDistributors } from '@/api/groupOrder';
import { formatDate } from '@/utils';
import { getToken } from '@/utils/auth';
import butVisibleMixin from '../../utils/buttonVisible';
import { mapState } from 'vuex';
const RETURN_GOODS_STATUS = ['', '待审核', '审核通过', '审核未通过', '退货成功', '退货失败'];

export default {
    data() {
        return {
            pageId: '30304',
            form: {
                lssuer: '',
                startDate: '',
                endDate: '',
                retail: '',
                phone: '',
                retailOrderNum: '',
                customerOrderNum: ''
            },
            lssuers: [],
            retails: [],
            tableData: [],
            totalRows: 0,
            pageSize: 20,
            currentPage: 1,
            loading: false,
            noTableData: '',
            multipleSelection: [],
            returnGoodsApplicationInfo: {},
            dialogReturnGoodsApplicationVisible: false,
            queryContainerShrink: false,
            checkBtnShow: false,
            returnGoodsBtnShow: false
        };
    },
    created() {
        this.form.retailOrderNum = this.$route.query.distributorOrderNo;
        this.getLssuers();
        this.getDistributors();
        this.getRefundOrders();
    },
    methods: {
        getLssuers() {
            getSelectList({ params: { code: '1036' }}).then(res => {
                if (res.errcode === '0000') {
                    this.lssuers = res.result;
                }
            });
        },
        getDistributors() {
            getDistributors({}).then(res => {
                if (res.errcode === '0000') {
                    this.retails = res.result;
                }
            });
        },
        getRefundOrders(page) {
            const pageNo = page || 1;
            let ed;
            let sd;
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
            const params = { pageNo: pageNo, pageSize: this.pageSize, publish: this.form.lssuer, beginDate: sd, endDate: ed, distributorInfoCode: this.form.retail, distributorOrderNo: this.form.retailOrderNum, userTelphone: this.form.phone, orderNo: this.form.customerOrderNum };
            getRefundOrders({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.totalRows = res.result.totalCount;
                    this.tableData = res.result.rows.filter(item => {
                        item.status = RETURN_GOODS_STATUS[item.status];
                        return item;
                    });
                }
            });
        },
        query() {
            this.getRefundOrders(this.currentPage);
        },
        exportExcel() {
            let ed;
            let sd;
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
            const params = { pageNo: this.currentPage, pageSize: this.pageSize, publish: this.form.lssuer, distributorInfoCode: this.form.retail, beginDate: sd, endDate: ed, distributorOrderNo: this.form.retailOrderNum, userTelphone: this.form.phone, orderNo: this.form.customerOrderNum };
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'post', action: refundOrderDownloadUrl() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            const input2 = $('<input>');
            input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
            $('body').append(form);
            form.append(input1);
            form.append(input2);
            form.submit();
        },
        check() {
            if (this.multipleSelection.length === 1) {
                getReturnGoodsApplicationInfo({ params: { id: this.multipleSelection[0].id }}).then(res => {
                    if (res.errcode === '0000') {
                        this.returnGoodsApplicationInfo = res.result;
                        window.scrollTo(0, 0);
                        this.dialogReturnGoodsApplicationVisible = true;
                    }
                });
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条用户查看' : '只能选择一条用户查看',
                    duration: 600
                });
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getRefundOrders(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getRefundOrders(this.currentPage);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleReturnGoodsApplication(agree) {
            const params = { isPassed: agree, backCardOrderNo: this.returnGoodsApplicationInfo.backCardOrderNo, processDesc: '', orderId: this.returnGoodsApplicationInfo.id };
            returnGoodsApplicationSubmit({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.$notify({
                        title: '成功',
                        message: '审核成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.dialogReturnGoodsApplicationVisible = false;
                    this.getRefundOrders(this.currentPage);
                } else {
                    this.dialogReturnGoodsApplicationVisible = false;
                }
            }).catch(() => {
                this.dialogReturnGoodsApplicationVisible = false;
            });
        },
        confirmReturnGoods() {
            if (this.multipleSelection.length === 1) {
                if (!this.isCollapse) {
                    setTimeout(() => {
                        this.$nextTick(() => {
                            document.querySelector('.v-modal').style.left = '36px';
                        });
                    }, 100);
                }
                window.scrollTo(0, 0);
                this.$confirm('是否确认退货？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true,
                    closeOnClickModal: false
                }).then(() => {
                    confirmReturnGoodsApi({ params: { distributorBackOrderNo: this.multipleSelection[0].backCardOrderNo }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '退货成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getRefundOrders(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条订单查看' : '只能选择一条订单查看',
                    duration: 600
                });
            }
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '225px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        openReturnGoodsApplication() {
            if (!this.isCollapse) {
                this.$nextTick(() => {
                    document.querySelector('.v-modal').style.left = '36px';
                });
            }
            window.scrollTo(0, 0);
        }
    },
    mixins: [butVisibleMixin],
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        },
        ...mapState({
            isCollapse: state => state.app.sidebar.opened
        })
    },
    watch: {
        multipleSelection(newValue) {
            if (newValue.length > 0 && newValue.every((e) => {
                return e.status === '待审核';
            })) {
                this.checkBtnShow = true;
            } else {
                this.checkBtnShow = false;
            }
            if (newValue.length > 0 && newValue.every((e) => {
                return e.status === '审核通过';
            })) {
                this.returnGoodsBtnShow = true;
            } else {
                this.returnGoodsBtnShow = false;
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
    }
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.refund-order{
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
}
.el-message-box__wrapper{
    top: 50px;
    left: 200px;
}
</style>
