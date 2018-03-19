<template>
    <div class="phone-manage">
        <div class="query-container" ref="queryContainer" style="height:290px;">
            <el-form :inline="true" style="width:1072px;margin:auto;" label-width="100px" label-position="right" :model="form" ref="searchForm" :rules="formRules">
                <el-form-item  label="移动运营商:">
                    <el-select v-model="form.merchant" clearable size="small" style="width:230px">
                        <el-option v-for="item in merchantMenu" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="预订状态:">
                    <el-select v-model="form.status" clearable size="small" style="width:230px">
                        <el-option v-for="item in stateMenu" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="上架状态:">
                    <el-select v-model="form.phoneUpShelfStatus" clearable size="small" style="width:230px">
                        <el-option v-for="item in phoneStatusMenu" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动名称:" prop="activityName">
                    <el-input v-model="form.activityName" size="small" style="width:230px"></el-input>
                </el-form-item>
                <el-form-item  label="城市:">
                    <el-select v-model="form.cityId" clearable filterable size="small" style="width:230px" placeholder="可输入搜索">
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
                <el-form-item label="手机靓号:" prop="phoneNumbers">
                    <el-input v-model="form.phoneNumbers" size="small" placeholder="多个手机英文逗号分隔" style="width:230px"></el-input>
                </el-form-item>
                <el-form-item label="套餐名称:" prop="phonePlanName">
                    <el-input v-model="form.phonePlanName" size="small" style="width:230px"></el-input>
                </el-form-item>
            </el-form>
            <div class="query-btn">
                <el-button size="small" type="primary" icon="delete" @click="clearForm" v-if="buttonVisible['4010101']">清空</el-button>
                <el-button size="small" type="primary" icon="search" @click="searchData('searchForm')" v-if="buttonVisible['4010102']">查询</el-button>
                <el-button size="small" type="primary" @click="exportFile" v-if="buttonVisible['4010105']"><icon-svg icon-class="down"/>导出</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" style="width:1072px;" justify="start">
                <el-button size="small" type="primary" @click="grounding" v-if="buttonVisible['4010103']&&ifUp">上架</el-button>
                <el-button size="small" type="primary" @click="undercarriage" v-if="buttonVisible['4010104']&&ifDown">下架</el-button>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="移动商" prop="merchantDesc">
                </el-table-column>
                <el-table-column label="城市" prop="cityName">
                </el-table-column>
                <el-table-column label="活动名称" prop="activityName" width=150>
                </el-table-column>
                <el-table-column label="手机靓号" prop="phoneNumber" width=150>
                </el-table-column>
                <el-table-column label="支持套餐" prop="phonePlanName" width=200>
                </el-table-column>
                <el-table-column label="添加时间" prop="createTime" width=200>
                </el-table-column>
                <el-table-column label="预订状态" prop="statusDesc" width=100>
                </el-table-column>
                <el-table-column label="上架状态" prop="phoneUpShelfStatusDesc" width=100>
                </el-table-column>
                <el-table-column label="更新时间" prop="updateTime" width=200>
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[10, 20, 30]" @current-change="currentChange" @size-change="sizeChange"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { queryUnicomPhoneList, getCityList, getMenuByCode, exportUnicomPhoneList, upJia, downJia } from '../../api/unicomPhone';
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
            pageId: '40101',
            form: {
                pageSize: 20,
                pageNo: 1,
                merchant: '',
                status: '',
                phoneUpShelfStatus: '',
                cityId: '',
                activityName: '',
                phoneNumbers: '',
                phonePlanName: ''
            },
            stateMenu: [],
            cityMenu: [],
            merchantMenu: [],
            phoneStatusMenu: [],
            phoneNum: '',
            total: 0,
            tableData: [],
            noTableData: '',
            loading: true,
            multipleSelection: [],
            ids: [],
            permission: true,
            formRules: {
                phoneNumbers: [{ validator: checkPhoneNum, trigger: 'blur' }],
                activityName: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }],
                phonePlanName: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }]
            },
            ifUp: false,
            ifDown: false
        };
    },
    created() {
        this.searchData();
        this.getCityMenu();
        this.getMerchantMenu();
        this.getStatusMenu();
        this.getPhoneStatusMenu();
    },
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        }
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
            const params = { code: '1057' };
            getMenuByCode({ params }).then(res => {
                this.stateMenu = res.result;
            });
        },
        // 获取上架状态下拉菜单
        getPhoneStatusMenu() {
            const params = { code: '1062' };
            getMenuByCode({ params }).then(res => {
                this.phoneStatusMenu = res.result;
            });
        },
        // 表格方法
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.ids = [];
            this.ifDown = false;
            this.ifUp = false;
            for (var i = 0; i < val.length; i++) {
                this.ids.push(val[i].id);
                if (val[i].phoneUpShelfStatus === '1') {
                    this.ifDown = true;
                } else {
                    this.ifUp = true;
                }
            }
            if (this.ifUp && this.ifDown) {
                this.ifDown = false;
                this.ifUp = false;
            }
        },
        currentChange(val) {
            this.form.pageNo = val;
            const params = this.form;
            queryUnicomPhoneList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows;
                }
            });
        },
        sizeChange(val) {
            this.form.pageSize = val;
            const params = this.form;
            queryUnicomPhoneList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows;
                }
            });
        },
        // 提示
        upOrDownConfirm(flag) {
            if (this.multipleSelection.length > 0) {
                this.openConfirm(flag);
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择一个或多个' + (flag === 1 ? '下架的' : '上架的') + '手机号' + (flag === 1 ? '上架' : '下架'),
                    duration: 800
                });
            }
        },
        // 弹出confirm框确认是否修改
        openConfirm(flag) {
            this.$confirm('请确认' + (flag === 0 ? '下架' : '上架') + '吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                const params = { ids: this.ids };
                if (flag === 1) {
                    upJia({ params }).then(res => {
                        this.$notify.success({
                            title: '消息',
                            message: '上架成功',
                            duration: 800
                        });
                        this.searchData();
                    });
                } else {
                    const params = { ids: this.ids };
                    downJia({ params }).then(res => {
                        this.$notify.success({
                            title: '消息',
                            message: '下架成功',
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
        // 上架
        grounding() {
            this.upOrDownConfirm(1);
        },
        // 下架
        undercarriage() {
            this.upOrDownConfirm(0);
        },
        // 清空
        clearForm() {
            this.form = this.$options.data().form;
        },
        // 查询
        searchData(formName) {
            if (formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const params = this.form;
                        queryUnicomPhoneList({ params }).then(res => {
                            if (res.errcode === '0000') {
                                this.tableData = res.result.rows;
                                this.loading = false;
                                this.total = res.result.totalCount;
                            }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            } else {
                const params = this.form;
                queryUnicomPhoneList({ params }).then(res => {
                    if (res.errcode === '0000') {
                        this.tableData = res.result.rows;
                        this.loading = false;
                        this.total = res.result.totalCount;
                    }
                });
            }
        },
        // 导出
        exportFile() {
            const params = { pageNo: this.form.pageNo, pageSize: this.form.pageSize, merchant: this.form.merchant, status: this.form.status, phoneUpShelfStatus: this.form.phoneUpShelfStatus, cityId: this.form.cityId, activityName: this.form.activityName, phoneNumbers: this.form.phoneNumbers, phonePlanName: this.form.phonePlanName };
            const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'post', action: exportUnicomPhoneList() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            const input2 = $('<input>');
            input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
            $('body').append(form);
            form.append(input1);
            form.append(input2);
            form.submit();
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '290px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        }
    }
};
</script>
<style lang="scss">
@import '../../styles/common.scss';
  .phone-manage{
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
        width:350px;
    }
  }
  .el-loading-mask{
    z-index: 90;
  }
  .el-table .cell {
    white-space: nowrap !important;
  } 
</style>
