<template>
    <div class="advertise-publish">
        <div class="query-container" ref="queryContainer" style="height:247px;">
            <el-form :inline="true" :model="form" label-width="100px" ref="adPublishTitle">
                <el-row>
                    <el-form-item label="广告名称:">
                        <el-input size="small" v-model="form.adName" style="width:194px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-select size="small" v-model="form.status" filterable clearable>
                            <el-option v-for="item in adStatus" :label="item.caption" :value="item.value" :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="广告主:">
                        <el-select size="small" v-model="form.adOwner" filterable clearable>
                            <el-option v-for="advertiser in advertisers" :label="advertiser.advertiserName" :value="advertiser.id" :key="advertiser.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布日期:">
                        <el-date-picker
                          v-model="form.dateRangeVal"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          size="small">
                        </el-date-picker>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="广告归属:">
                        <el-select size="small" v-model="form.belong" filterable>
                        <el-option-group
                            v-for="group in cityMenu"
                            :key="group.label"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.code">
                              </el-option>
                        </el-option-group>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="广告类型:">
                        <el-select size="small" v-model="form.adType" filterable clearable>
                            <el-option v-for="type in adTypes" :label="type.caption" :value="type.value" :key="type.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="物料ID:">
                        <el-input size="small" v-model="form.materialId" style="width:194px;"></el-input>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button v-if="buttonVisible['5020301']" @click="clear" size="small" type="primary" icon="el-icon-delete"></icon>清空</el-button>
                <el-button v-if="buttonVisible['5020302']" @click="query" size="small" type="primary" icon="el-icon-search">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" justify="start">
                <el-col :span="2" v-if="buttonVisible['5020303']"><el-button @click="addAdvertise" size="small" type="primary" icon="el-icon-plus">添加广告</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['5020304'] && showPutawayBtnByStatus"><el-button @click="putawayApplication" size="small" type="primary" icon="el-icon-upload2">上架申请</el-button></el-col>
                <el-col :span="2" v-if="buttonVisible['5020305'] && showUndercarriageBtnByStatus"><el-button @click="undercarriage" size="small" type="primary" icon="el-icon-download">下架</el-button></el-col>
            </el-row>
            <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" height="700" @cell-click="handleTableImgClick">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <span class="operate" @click="operate(6, scope.row)">详情</span>
                            <span class="operate" v-if="buttonVisible['5020305'] && (scope.row.status === '1' || scope.row.status === '3' || scope.row.status === '6') && ((cityMenu.length > 1 && scope.row.cityId === 0) || cityMenu.length === 1)" @click="operate(1, scope.row)">修改</span>
                            <span class="operate" v-if="buttonVisible['5020308'] && scope.row.status === '2'" @click="operate(2, scope.row)">审核</span>
                            <span class="operate" v-if="buttonVisible['5020305'] && (scope.row.status == '4' || scope.row.status === '5')" @click="operate(3, scope.row)">下架</span>
                            <span class="operate" v-if="(scope.row.status === '1' || scope.row.status === '3' || scope.row.status === '6') && ((cityMenu.length > 1 && scope.row.cityId === 0) || cityMenu.length === 1)" @click="operate(4, scope.row)">上架申请</span>
                            <span class="operate" v-if="buttonVisible['5020307'] && scope.row.status === '2'" @click="operate(5, scope.row)">撤回申请</span>
                            <div slot="reference" class="name-wrapper">
                                <span class="operate">操作</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="广告ID" prop="adId" width="180" align="center">
                </el-table-column>
                <el-table-column label="广告主" prop="adAdvertiserName" width="160" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="广告名称" width="130" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.displayType === 1" style="color:red;">[强显]</span><span>{{scope.row.adName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="广告类型" prop="adTypeDes" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告图片" width="130" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <p>物料名称: {{ scope.row.materielName }}</p>
                            <div slot="reference" class="name-wrapper">
                                <img :src="scope.row.resourceUploadPatch" style="width:100%;height:55px;">
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="广告归属" prop="cityName" width="130" align="center">
                </el-table-column>
                <el-table-column label="状态" prop="statusDesc" width="170">
                </el-table-column>
                <el-table-column label="生效时间" prop="adBeginDate" width="180" sortable>
                </el-table-column>
                <el-table-column label="失效时间" prop="adEndDate" width="180">
                </el-table-column>
                <el-table-column label="广告备注" prop="remark" width="170">
                </el-table-column>
                <el-table-column label="发布人" prop="addAdUserName" width="100">
                </el-table-column>
                <el-table-column label="发布时间" prop="addAdTime" width="180">
                </el-table-column>
                <el-table-column label="修改时间" prop="updateTime" width="180">
                </el-table-column>
                <el-table-column label="审核人" prop="checkerName" width="100">
                </el-table-column>
                <el-table-column label="审核时间" prop="checkTime" width="180">
                </el-table-column>
                <el-table-column label="审核备注" prop="checkRemark" width="100">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[20, 50, 100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </div>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="showImgUrl"></preview-pic>
    </div>
</template>

<script>
import { formatDate } from '@/utils/index';
import { getSelectList } from '@/api/userManage';
import {
    getAdLists,
    getAdvertiser,
    adUndercarriage,
    adUpcarriageApply,
    adWithdraw,
    getCityListByUser
} from '@/api/adPublish';
import buttonVisible from '@/utils/buttonVisible';
import previewPic from '@/components/previewPic';
import { mapState, mapMutations } from 'vuex';
const STATUS = ['', '编辑中', '待审核', '审核未通过', '待生效', '生效中', '已下架'];

export default {
    name: 'advertisePublish',
    data() {
        return {
            pageId: '50203',
            adStatus: [],
            adTypes: [],
            cityMenu: [],
            advertisers: [],
            form: {
                adName: '',
                status: '',
                adOwner: '',
                dateRangeVal: '',
                belong: '',
                adType: '',
                materialId: 222
            },
            queryContainerShrink: false,
            tableData: [],
            multipleSelection: [],
            loading: false,
            noTableData: '',
            pageSize: 20,
            totalRows: 0,
            currentPage: 1,
            showPutawayBtnByStatus: true,
            showUndercarriageBtnByStatus: true,
            dialogPreviewPicVisible: false,
            showImgUrl: ''
        };
    },
    created() {
        if (Object.keys(this.queryData).length !== 0) {
            this.form = { ...this.queryData };
        }
        this.form.materialId = this.$route.query.materialId;
        this.getAdStatusList();
        this.getAdTypeList();
        this.getCityMenu();
        this.getAdvertiser();
        // this.getAdLists();
    },
    methods: {
        clear() {
            Object.keys(this.form).map(key => {
                if (key !== 'belong') {
                    this.form[key] = '';
                }
            });
        },
        query() {
            this.getAdLists();
        },
        addAdvertise() {
            this.$router.push('/advertise/businessManage/addAdvertise');
        },
        putawayApplication() {
            if (this.multipleSelection.length) {
                this.$confirm('是否确定上架申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    const tempArr = [];
                    this.multipleSelection.forEach(i => {
                        tempArr.push(i.adId);
                    });
                    adUpcarriageApply({ params: { idList: tempArr }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '上架申请成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getAdLists(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else {
                this.$notify({
                    title: '提示',
                    message: '请选择数据',
                    type: 'warning',
                    duration: 1000
                });
            }
        },
        undercarriage() {
            if (this.multipleSelection.length) {
                this.$confirm('是否确定下架？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    const tempArr = [];
                    this.multipleSelection.forEach(i => {
                        tempArr.push(i.adId);
                    });
                    adUndercarriage({ params: { idList: tempArr }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '下架成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getAdLists(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else {
                this.$notify({
                    title: '提示',
                    message: '请选择数据',
                    type: 'warning',
                    duration: 1000
                });
            }
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '247px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        operate(type, row) {
            if (type === 1) {
                this.$router.push({ path: '/advertise/businessManage/modifyAdvertise', query: { adId: row.adId }});
            } else if (type === 2) {
                this.$router.push({ path: '/advertise/businessManage/applyReview', query: { adId: row.adId }});
            } else if (type === 3) {
                this.$confirm('是否确定下架？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    adUndercarriage({ params: { idList: [row.adId] }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '下架成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getAdLists(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else if (type === 4) {
                this.$confirm('是否确定上架申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    adUpcarriageApply({ params: { idList: [row.adId] }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '上架申请成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getAdLists(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else if (type === 5) {
                this.$confirm('是否确定撤回？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    adWithdraw({ params: { adId: row.adId }}).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify({
                                title: '成功',
                                message: '撤回成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.getAdLists(this.currentPage);
                        }
                    });
                }).catch(() => {});
            } else if (type === 6) {
                this.$router.push({ path: '/advertise/businessManage/adDetail', query: { adId: row.adId }});
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdLists(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAdLists(this.currentPage);
        },
        getAdLists(page) {
            const pageNo = page || 1;
            let startDate;
            let endDate;
            if (this.form.dateRangeVal) {
                startDate = formatDate(this.form.dateRangeVal[0]);
                endDate = formatDate(this.form.dateRangeVal[1]);
            } else {
                startDate = '';
                endDate = '';
            }
            const params = { pageNo: pageNo, pageSize: this.pageSize, adName: this.form.adName, status: this.form.status, adAdvertiserId: this.form.adOwner, startDate: startDate, endDate: endDate, cityId: this.form.belong, adType: this.form.adType, adMaterielId: this.form.materialId };
            this.loading = true;
            getAdLists({ params }).then(res => {
                this.tableData = res.result.rows.filter(item => {
                    item.statusDesc = STATUS[item.status];
                    return item;
                });
                this.totalRows = res.result.totalCount;
                this.loading = false;
            });
        },
        getAdStatusList() {
            const params = { code: '1049' };
            getSelectList({ params }).then(res => {
                this.adStatus = res.result;
            });
        },
        getAdTypeList() {
            const params = { code: '1067' };
            getSelectList({ params }).then(res => {
                this.adTypes = res.result;
                this.adTypes.unshift({ caption: '全部', value: '' });
            });
        },
        getCityMenu() {
            const params = { level: '2' };
            getCityListByUser({ params }).then(res => {
                this.cityMenu = res.result;
                if (this.cityMenu.length > 1) {
                    this.form.belong = '0';
                } else {
                    this.form.belong = res.result[0].children[0].code;
                }
                this.getAdLists();
            });
        },
        getAdvertiser() {
            getAdvertiser({ params: {}}).then(res => {
                this.advertisers = res.result;
            });
        },
        handleTableImgClick(row, column, cell, event) {
            if (column.label === '广告图片') {
                this.showImgUrl = row.resourceUploadPatch;
                this.dialogPreviewPicVisible = true;
            }
        },
        ...mapMutations({
            recordAdPublishQuery: 'RECORD_AD_PUBLISH_QUERY_DATA'
        })
    },
    watch: {
        multipleSelection(newVal) {
            if (newVal.every(i => {
                return i.status === '1' || i.status === '3' || i.status === '6';
            })) {
                this.showPutawayBtnByStatus = true;
            } else {
                this.showPutawayBtnByStatus = false;
            }
            if (newVal.every(i => {
                return i.status === '4' || i.status === '5';
            })) {
                this.showUndercarriageBtnByStatus = true;
            } else {
                this.showUndercarriageBtnByStatus = false;
            }
        }
    },
    computed: {
        ...mapState({
            queryData: state => state.app.adPublishQueryData
        })
    },
    components: {
        previewPic
    },
    beforeRouteLeave(to, from, next) {
        this.recordAdPublishQuery(this.form);
        next();
    },
    mixins: [buttonVisible]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.advertise-publish{
    margin: 30px auto 0;
    width: 1120px;
    .manage-container{
        .el-col{
            margin-right: 30px;
        }
    }
}
.operate{
    color: #409EFF;
    font-size: 12px;
    cursor: pointer;
    padding: 0 6px;
}
.el-popover{
    min-width: 50px;
}
.v-modal{
    top: 0;
}
</style>
