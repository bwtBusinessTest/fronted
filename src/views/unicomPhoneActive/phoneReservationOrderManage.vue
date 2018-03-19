<template>
    <div class="phone-order">
        <div class="query-container" ref="queryContainer" style="height:290px;">
            <el-form :inline="true" style="width:1072px;margin:auto;" label-width="100px" label-position="right" :model="form" ref="searchForm" :rules="formRules">
                <el-form-item label="手机靓号:" prop="phoneNumbers">
                    <el-input v-model="form.phoneNumbers" size="small" placeholder="多个手机号用英文逗号分隔" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item  label="状态:">
                    <el-select v-model="form.status" clearable size="small" style="width:250px">
                        <el-option v-for="item in stateMenu" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间:">
                    <el-date-picker v-model="form.startDate" size="small" placeholder="开始日期" style="width:118px"></el-date-picker> 至 <el-date-picker size="small" v-model="form.endDate" placeholder="结束日期" style="width:118px"></el-date-picker>
                </el-form-item>
                <el-form-item label="申请人手机号:" prop="applicantUserPhone">
                    <el-input v-model="form.applicantUserPhone" size="small" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item  label="移动运营商:">
                    <el-select v-model="form.merchant" clearable size="small" style="width:250px">
                        <el-option v-for="item in merchantMenu" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="城市:">
                    <el-select v-model="form.cityId" clearable filterable size="small" style="width:250px">
                        <el-option-group
                            v-for="group in cityMenu"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称:" prop="activityName">
                    <el-input v-model="form.activityName" size="small" style="width:250px"></el-input>
                </el-form-item>
                <el-form-item label="套餐名称:" prop="phonePlanName">
                    <el-input v-model="form.phonePlanName" size="small" style="width:250px"></el-input>
                </el-form-item>
            </el-form>
            <div class="query-btn">
                <el-button  size="small" type="primary" icon="delete" @click="clearForm" v-if="buttonVisible['4010201']">清空</el-button>
                <el-button  size="small" type="primary" icon="search" @click="searchData('searchForm')" v-if="buttonVisible['4010202']">查询</el-button>
                <el-button  size="small" type="primary" icon="download" @click="exportFile" v-if="buttonVisible['4010205']">导出</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" style="width:1072px;" justify="start" v-if="permisson">
                <el-button @click="cancleOrConfirm(0)" size="small" type="primary" icon="close" v-if="buttonVisible['4010203']">取消预定</el-button>
                <el-button @click="cancleOrConfirm(1)" size="small" type="primary" icon="check" v-if="buttonVisible['4010204']">确认售出</el-button>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height=390>
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="订单号" prop="orderNo" width="120">
                </el-table-column>
                <el-table-column label="移动商" prop="merchantDesc" width="120">
                </el-table-column>
                <el-table-column label="城市" prop="cityName" width="120">
                </el-table-column>
                <el-table-column label="活动名称" prop="activityName" width="200">
                </el-table-column>
                <el-table-column label="手机靓号" prop="phoneNumber" width="150">
                </el-table-column>
                <el-table-column label="套餐名称" prop="phonePlanName" width="120">
                </el-table-column>
                <el-table-column label="状态" prop="statusDesc" width="120">
                </el-table-column>
                <el-table-column label="申请人" prop="applicantUserName" width="120">
                </el-table-column>
                <el-table-column label="申请人手机号" prop="applicantUserPhone" width="130">
                </el-table-column>
                <el-table-column label="申请时间" prop="createTime" width="180">
                </el-table-column>
                <el-table-column label="操作员" prop="updateUserName" width="120">
                </el-table-column>
                <el-table-column label="处理时间" prop="updateTime" width="180">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[10, 20, 30]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { queryUnicomPhoneOrderList, exportPhoneOrderList, cancleReservation, confirmSale, getCityList, getMenuByCode } from '../../api/unicomPhoneOrder';
import { formatDate } from '@/utils';
import { getToken } from '@/utils/auth';
var $ = require('jquery');
import butVisibleMixin from '../../utils/buttonVisible';
export default {
    mixins: [butVisibleMixin],
    data() {
        // 校验手机号逗号分隔
        var checkPhoneNum = (rule, value, callback) => {
            const reg = /^(\d{11}(,\d{11})*)$/;
            if (reg.test(value) || value === '') {
                return callback();
            } else {
                return callback(new Error('请确认手机号格式并多个手机号用逗号分隔'));
            }
        };
        // 校验不能含有特殊字符
        var checkSpecialCode = (rule, value, callback) => {
            const reg = /[\!@#\$%\^&\*]+/g;
            if (reg.test(value)) {
                return callback(new Error('不能含有特殊字符'));
            } else {
                return callback();
            }
        };
        return {
            pageId: '40102',
            form: {
                pageSize: 20,
                pageNo: 1,
                phoneNumbers: '',
                status: '',
                startDate: '',
                endDate: '',
                applicantUserPhone: '',
                merchant: '',
                cityId: '',
                activityName: '',
                phonePlanName: ''
            },
            formRules: {
                phoneNumbers: [{ validator: checkPhoneNum, trigger: 'blur' }],
                applicantUserPhone: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }],
                activityName: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }],
                phonePlanName: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }]
            },
            stateMenu: [],
            cityMenu: [],
            merchantMenu: [],
            total: 0,
            tableData: [],
            noTableData: '',
            loading: true,
            orderNoList: [],
            multipleSelection: [],
            queryContainerShrink: false,
            permisson: false
        };
    },
    created() {
        this.searchData();
        this.getCityMenu();
        this.getMerchantMenu();
        this.getStatusMenu();
    },
    methods: {
        // 获取城市数据字典
        getCityMenu() {
            const params = { level: '2' };
            getCityList({ params }).then(res => {
                this.cityMenu = res.result;
            });
        },
        // 获取移动运营商下拉菜单
        getMerchantMenu() {
            const params = { code: '1055' };
            getMenuByCode({ params }).then(res => {
                this.merchantMenu = res.result;
            });
        },
        // 获取状态下拉菜单
        getStatusMenu() {
            const params = { code: '1058' };
            getMenuByCode({ params }).then(res => {
                this.stateMenu = res.result;
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.orderNoList = [];
            this.permisson = true;
            for (var i = 0; i < val.length; i++) {
                this.orderNoList.push(val[i].orderNo);
                if (val[i].status === '1') {
                    this.permisson = this.permisson && true;
                } else {
                    this.permisson = this.permisson && false;
                }
            }
            if (val.length === 0) {
                this.permisson = false;
            }
        },
        currentChange(val) {
            this.form.pageNo = val;
            this.searchData();
        },
        sizeChange(val) {
            this.form.pageSize = val;
            this.searchData();
        },
        cancleOrConfirm(flag) {
            if (this.multipleSelection.length > 0 && this.permisson === true) {
                this.openConfirm(flag);
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择一条或多条已预订的订单进行' + (flag === 1 ? '确认售出' : '取消预定'),
                    duration: 800
                });
            }
        },
        // 弹出confirm框确认是否修改
        openConfirm(flag) {
            this.$confirm('请确认' + (flag === 0 ? '取消预定' : '确认售出') + '吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                const params = { orderNoList: this.orderNoList };
                if (flag === 1) {
                    confirmSale({ params }).then(res => {
                        this.$notify.success({
                            title: '消息',
                            message: '确认售出成功',
                            duration: 800
                        });
                        this.searchData();
                    });
                } else {
                    const params = { orderNoList: this.orderNoList };
                    cancleReservation({ params }).then(res => {
                        this.$notify.success({
                            title: '消息',
                            message: '取消预定成功',
                            duration: 800
                        });
                        this.searchData();
                    });
                }
            }).catch(() => {});
            var self = this;
            setTimeout(function() {
                self.openComfirmCallback();
            }, 100);
        },
        // 打开confirm后回掉
        openComfirmCallback() {
            if (!this.isCollapse) {
                this.$nextTick(() => {
                    document.querySelector('.v-modal').style.left = '36px';
                });
            }
            if (document.querySelector('.v-modal')) {
                this.scrollHeight = $(document).scrollTop();
                if (this.scrollHeight >= 0 && this.scrollHeight < 50) {
                    document.querySelector('.v-modal').style.top = (50 - this.scrollHeight) + 'px';
                } else {
                    document.querySelector('.v-modal').style.top = 0 + 'px';
                }
            }
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '290px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        // 清空
        clearForm() {
            this.form = this.$options.data().form;
        },
        // 查询
        searchData(formName) {
            var sd, ed;
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
            if (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = { pageNo: this.form.pageNo, pageSize: this.form.pageSize,
                            phoneNumbers: this.form.phoneNumbers, status: this.form.status,
                            startDate: sd, endDate: ed, applicantUserPhone: this.form.applicantUserPhone,
                            merchant: this.form.merchant, cityId: this.form.cityId, activityName: this.form.activityName,
                            phonePlanName: this.form.phonePlanName };
                        queryUnicomPhoneOrderList({ params }).then(res => {
                            if (res.errcode === '0000') {
                                this.tableData = res.result.rows;
                                this.total = res.result.totalCount;
                                this.loading = false;
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            } else {
                const params = { pageNo: this.form.pageNo, pageSize: this.form.pageSize,
                    phoneNumbers: this.form.phoneNumbers, status: this.form.status,
                    startDate: sd, endDate: ed, applicantUserPhone: this.form.applicantUserPhone,
                    merchant: this.form.merchant, cityId: this.form.cityId, activityName: this.form.activityName,
                    phonePlanName: this.form.phonePlanName };
                queryUnicomPhoneOrderList({ params }).then(res => {
                    if (res.errcode === '0000') {
                        this.tableData = res.result.rows;
                        this.total = res.result.totalCount;
                        this.loading = false;
                    }
                });
            }
        },
        // 导出
        exportFile() {
            var sd, ed;
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
            const params = { pageNo: this.form.pageNo, pageSize: this.form.pageSize, phoneNumbers: this.form.phoneNumbers, status: this.form.status, startDate: sd, endDate: ed, applicantUserPhone: this.form.applicantUserPhone, merchant: this.form.merchant, cityId: this.form.cityId, activityName: this.form.activityName, phonePlanName: this.form.phonePlanName };
            console.log(params);
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'post', action: exportPhoneOrderList() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            const input2 = $('<input>');
            input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
            $('body').append(form);
            form.append(input1);
            form.append(input2);
            form.submit();
        }
    }
};
</script>
<style lang="scss">
@import '../../styles/common.scss';
  .phone-order{
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
    .el-form-item{
        width:370px;
    }
  }
  .el-loading-mask{
    z-index: 90;
  }
  .el-table .cell {
    white-space: nowrap !important;
  }
</style>

