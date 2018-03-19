<template>
    <div class="modify-advertise">
        <div class="manage-container">
            <div class="ad-title">
                <el-form :model="titleData" label-width="90px" ref="titleData">
                    <el-form-item label="广告ID:">
                        <span>{{titleData.adId}}</span>
                    </el-form-item>
                    <el-form-item label="广告归属:">
                        <span>{{titleData.adBelong}}</span>
                    </el-form-item>
                    <el-form-item label="广告名称:" prop="adName" :rules="[{ required: true, message: '请输入广告名称', trigger: 'blur' }]">
                        <el-input size="small" v-model="titleData.adName" style="width:194px;"></el-input>
                    </el-form-item>
                    <el-form-item label="广告主:" prop="owner" :rules="[{ required: true, message: '请输入广告主', trigger: 'blur' }]">
                        <el-select size="small" v-model="titleData.owner" filterable clearable>
                            <el-option v-for="advertiser in advertisers" :label="advertiser.advertiserName" :value="advertiser.id" :key="advertiser.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告类型:">
                        <el-radio-group v-model="titleData.adTypeNum">
                            <el-radio v-for="adType in adTypes" :label="adType.value" :key="adType.value">{{adType.caption}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="展现设置:" v-if="titleData.adTypeNum === '3'">
                       <el-checkbox v-model="titleData.showSet">强制显示</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <div class="ad-material-ad">
                <div class="material-title">
                  <h3>广告物料</h3>
                  <div style="margin-top:14px;">
                      <el-button size="small" type="primary" @click="dialogMaterialChooseVisible = true">选择/修改</el-button>
                  </div>
                </div>
                <div>
                    <el-form :model="materialData" label-width="90px">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item label="物料ID:">
                                    <span>{{materialData.id}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="物料名称:">
                                    <span>{{materialData.name}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="物料尺寸:">
                            <span>{{materialData.size}}</span>
                        </el-form-item>
                        <el-form-item label="物料显示:">
                            <img :src="materialData.url" style="width:100px;" @click="handleClickPic">
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="put-set">
                <h3>投放设置</h3>
                <el-form :model="putData" label-width="90px" ref="putData">
                    <el-form-item label="生效时间:" prop="dateRangeVal" :rules="[{ required: true, message: '请选择生效时间', trigger: 'change' }]">
                        <el-date-picker
                          size="small"
                          v-model="putData.dateRangeVal"
                          type="datetimerange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="ad-position">
                    <div>
                        <span>投放位设置:</span>
                    </div>
                    <div>
                        <el-button size="small" type="primary" @click="cancelAdd">删除</el-button>
                        <el-button size="small" type="primary" @click="dialogAdPositionSelectVisible = true">添加/修改</el-button>
                    </div>
                </div>
                <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" @cell-dblclick="editCell" :height="tableHeight" :cell-style="cellStyle">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="广告位ID" prop="adSenseId" width="110" align="center">
                </el-table-column>
                <el-table-column label="城市" prop="cityName" width="160" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="广告位名称" prop="adSenseName" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告类型" prop="adSenseTypeDesc" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告位尺寸" prop="adPositionSize" width="170">
                </el-table-column>
                <el-table-column label="权重值" prop="weightValue" width="100">
                    <template slot-scope="scope">
                        <div v-show="!scope.row.edit"><label style="display:inline-block;width:80%;text-align:center;" v-text="scope.row.weightValue" ></label><i class="el-icon-edit" @click="editWeightVal(scope.row)"></i></div>
                        <restrictInput v-show="scope.row.edit" v-model="scope.row.weightValue" :max="10" :min="1" width="79px" v-focus="scope.row.weightValue" @handleBlur="handleBlur(scope.row)"></restrictInput>
                    </template>
                </el-table-column>
                <el-table-column label="排序值" prop="sortNo" width="100">
                    <template slot-scope="scope">
                        <div v-show="!scope.row.orderValEdit"><label style="display:inline-block;width:80%;text-align:center;" v-text="scope.row.sortNo" ></label><i class="el-icon-edit" @click="editOrderVal(scope.row)"></i></div>
                        <restrictInput v-show="scope.row.orderValEdit" v-model="scope.row.sortNo" :max="10" :min="1" width="79px" v-focus="scope.row.orderValEdit" @handleBlur="handleBlur(scope.row)"></restrictInput>
                    </template>
                </el-table-column>
                <el-table-column label="适配度" prop="fitness" width="170">
                </el-table-column>
                <el-table-column label="投放／阈值／轮播" prop="put" width="160">
                </el-table-column>
            </el-table>
            <!-- <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div> -->
            </div>
            <div class="footer">
                <el-button type="primary" size="small" style="width:120px;" @click="save">保存</el-button>
                <el-button type="primary" size="small" style="width:120px;" @click="saveAndApplyShelve">保存并申请上架</el-button>
                <el-button type="primary" size="small" style="width:120px;" @click="$router.push('/advertise/businessManage/adPublish')">取消</el-button>
            </div>
        </div>
        <material-select :show.sync="dialogMaterialChooseVisible" @showPic="handleShowPic" @receiveMaterialData="handleReceiveMaterialData"></material-select>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="showImgUrl"></preview-pic>
        <adPositionSelect :show.sync="dialogAdPositionSelectVisible" v-bind="{materialWidth: materialData.width, materialHeight: materialData.height}" @receiveSelect="handleReceiveSelect"></adPositionSelect>
    </div>
</template>

<script>
import {
    getAdDetail,
    getAdvertiser,
    getAdSensesByAdIdNoPage,
    modifyAdvertise,
    modifyAndApplay,
    disabledAdPosition,
    enabledAdPosition
} from '@/api/adPublish';
import { getSelectList } from '@/api/userManage';
import previewPic from '@/components/previewPic';
import materialSelect from '@/components/materialSelect';
import adPositionSelect from '@/components/adPositionSelect';
import restrictInput from '@/components/restrictInput';
const AD_TYPE = ['', '开屏广告', 'Banner广告', '插屏广告'];

export default {
    name: 'modifyAdvertise',
    data() {
        return {
            titleData: {
                adId: '',
                adBelong: '',
                adName: '',
                owner: '',
                cityId: '',
                showSet: false,
                adType: '',
                adTypeNum: undefined
            },
            advertisers: [],
            materialData: {
                id: '',
                name: '',
                size: '',
                width: 0,
                height: 0,
                url: ''
            },
            oldMaterialDataId: undefined,
            putData: {
                dateRangeVal: [],
                adTimeId: undefined
            },
            tableData: [],
            multipleSelection: [],
            currentPage: 1,
            totalRows: 0,
            pageSize: 10,
            loading: false,
            noTableData: '',
            tableHeight: 600,
            dialogPreviewPicVisible: false,
            showImgUrl: '',
            dialogMaterialChooseVisible: false,
            dialogAdPositionSelectVisible: false,
            undeletableTableData: [],
            undeletableTabelDataFlag: true,
            disabledOrEnabledNum: 0,
            adTypes: []
        };
    },
    created() {
        this.getAdvertiser();
        this.getAdTypeList();
        this.getAdDetail();
        this.getAdSensesByAdId();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        changeImportVal(row, e) {
            row.weightValue = e.target.value;
            row.edit = false;
        },
        handleBlur(row) {
            row.edit = false;
            row.orderValEdit = false;
        },
        editCell(row, column, cell, event) {
            if (column.label === '权重值') {
                row.edit = true;
            }
            if (column.label === '排序值') {
                row.orderValEdit = true;
            }
        },
        editWeightVal(row) {
            row.edit = true;
        },
        editOrderVal(row) {
            row.orderValEdit = true;
        },
        handleClickPic() {
            this.showImgUrl = this.materialData.url;
            this.dialogPreviewPicVisible = true;
        },
        handleShowPic(url) {
            this.showImgUrl = url;
            this.dialogPreviewPicVisible = true;
        },
        getAdDetail() {
            getAdDetail({ params: this.$route.query.adId }).then(res => {
                if (res.errcode === '0000') {
                    this.titleData.adId = res.adAdvertisementDetailDto.adId;
                    this.titleData.adName = res.adAdvertisementDetailDto.adName;
                    this.titleData.owner = res.adAdvertisementDetailDto.adAdvertiserId;
                    this.materialData.id = res.adAdvertisementDetailDto.adMateriel.id;
                    this.oldMaterialDataId = res.adAdvertisementDetailDto.adMateriel.id;
                    this.materialData.name = res.adAdvertisementDetailDto.adMateriel.materielName;
                    this.materialData.width = res.adAdvertisementDetailDto.adMateriel.resourceWidth;
                    this.materialData.height = res.adAdvertisementDetailDto.adMateriel.resourceHeight;
                    this.materialData.size = res.adAdvertisementDetailDto.adMateriel.resourceWidth + '*' + res.adAdvertisementDetailDto.adMateriel.resourceHeight;
                    this.materialData.url = res.adAdvertisementDetailDto.adMateriel.resourcePath;
                    this.putData.dateRangeVal.push(new Date(res.adAdvertisementDetailDto.adTime.adBeginDate));
                    this.putData.dateRangeVal.push(new Date(res.adAdvertisementDetailDto.adTime.adEndDate));
                    this.putData.adTimeId = res.adAdvertisementDetailDto.adTime.id;
                    this.titleData.adBelong = res.adAdvertisementDetailDto.cityName;
                    this.titleData.cityId = res.adAdvertisementDetailDto.cityId;
                    this.titleData.adType = AD_TYPE[Number(res.adAdvertisementDetailDto.adType)];
                    this.titleData.adTypeNum = res.adAdvertisementDetailDto.adType;
                    if (res.adAdvertisementDetailDto.displayType) {
                        this.titleData.showSet = true;
                    } else {
                        this.titleData.showSet = false;
                    }
                }
            });
        },
        getAdvertiser() {
            getAdvertiser({ params: {}}).then(res => {
                this.advertisers = res.result;
            });
        },
        getAdSensesByAdId() {
            const params = { adId: this.$route.query.adId };
            getAdSensesByAdIdNoPage({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.filter(i => {
                        i.adPositionSize = `${i.adSenseWide}*${i.adSenseHigh}`;
                        i.edit = false;
                        i.orderValEdit = false;
                        i.put = `${i.totalAdsCount}/${i.deliveryThreshold}/${i.carouselNumber}`;
                        return i;
                    });
                    res.result.forEach(i => {
                        this.undeletableTableData.push(i.id);
                    });
                }
            });
        },
        handleReceiveMaterialData(data) {
            this.materialData.id = data.id;
            this.materialData.name = data.materielName;
            this.materialData.size = data.materialSize;
            this.materialData.height = data.resourceHeight;
            this.materialData.width = data.resourceWidth;
            this.materialData.url = data.imgUrl;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdSensesByAdId();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAdSensesByAdId();
        },
        cellStyle({ row, columnIndex }) {
            if (((Number(row.fitness) >= 1.1 || Number(row.fitness) <= 0.9) && columnIndex === 8) || (columnIndex === 9 && row.totalAdsCount > row.deliveryThreshold)) {
                return { color: 'red' };
            }
        },
        save() {
            this.$refs.titleData.validate((valid1) => {
                if (valid1) {
                    this.$refs.putData.validate(valid2 => {
                        if (valid2) {
                            if (this.disabledOrEnabledNum) {
                                this.$confirm('确认停用／启用该条广告', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                    center: true
                                }).then(() => {
                                    const params = { adId: this.$route.query.adId, cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adMateriel: { id: this.materialData.id }, adTime: { id: this.putData.adTimeId, adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [], adType: this.titleData.adTypeNum, displayType: Number(this.titleData.showSet) };
                                    this.tableData.forEach(e => {
                                        params.adSenseAdvertisementVos.push({ adSenseId: e.adSenseId, cityId: e.cityId, weightValue: e.weightValue, sortNo: e.sortNo, fitness: e.fitness, status: e.status });
                                    });
                                    modifyAdvertise({ params }).then(res => {
                                        if (res.errcode === '0000') {
                                            this.$notify({
                                                title: '成功',
                                                message: '保存成功',
                                                type: 'success',
                                                duration: 1000
                                            });
                                            this.$router.push('/advertise/businessManage/adPublish');
                                        }
                                    });
                                }).catch(() => {});
                            } else {
                                const params = { adId: this.$route.query.adId, cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adMateriel: { id: this.materialData.id }, adTime: { id: this.putData.adTimeId, adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [], adType: this.titleData.adTypeNum, displayType: Number(this.titleData.showSet) };
                                this.tableData.forEach(e => {
                                    params.adSenseAdvertisementVos.push({ adSenseId: e.adSenseId, cityId: e.cityId, weightValue: e.weightValue, sortNo: e.sortNo, fitness: e.fitness, status: e.status });
                                });
                                modifyAdvertise({ params }).then(res => {
                                    if (res.errcode === '0000') {
                                        this.$notify({
                                            title: '成功',
                                            message: '保存成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.push('/advertise/businessManage/adPublish');
                                    }
                                });
                            }
                        }
                    });
                }
            });
        },
        saveAndApplyShelve() {
            this.$refs.titleData.validate(valid1 => {
                if (valid1) {
                    this.$refs.putData.validate(valid2 => {
                        if (valid2) {
                            if (this.disabledOrEnabledNum) {
                                this.$confirm('确认停用／启用该条广告', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning',
                                    center: true
                                }).then(() => {
                                    const params = { adId: this.$route.query.adId, cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adMateriel: { id: this.materialData.id }, adTime: { id: this.putData.adTimeId, adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [], adType: this.titleData.adTypeNum, displayType: Number(this.titleData.showSet) };
                                    this.tableData.forEach(e => {
                                        params.adSenseAdvertisementVos.push({ adSenseId: e.adSenseId, cityId: e.cityId, weightValue: e.weightValue, sortNo: e.sortNo, fitness: e.fitness, status: e.status });
                                    });
                                    modifyAndApplay({ params }).then(res => {
                                        if (res.errcode === '0000') {
                                            this.$notify({
                                                title: '成功',
                                                message: '保存并申请上架成功',
                                                type: 'success',
                                                duration: 1000
                                            });
                                            this.$router.push('/advertise/businessManage/adPublish');
                                        }
                                    });
                                });
                            } else {
                                const params = { adId: this.$route.query.adId, cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adMateriel: { id: this.materialData.id }, adTime: { id: this.putData.adTimeId, adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [], adType: this.titleData.adTypeNum, displayType: Number(this.titleData.showSet) };
                                this.tableData.forEach(e => {
                                    params.adSenseAdvertisementVos.push({ adSenseId: e.adSenseId, cityId: e.cityId, weightValue: e.weightValue, sortNo: e.sortNo, fitness: e.fitness, status: e.status });
                                });
                                modifyAndApplay({ params }).then(res => {
                                    if (res.errcode === '0000') {
                                        this.$notify({
                                            title: '成功',
                                            message: '保存并申请上架成功',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.$router.push('/advertise/businessManage/adPublish');
                                    }
                                });
                            }
                        }
                    });
                }
            });
        },
        disabledOrEnabled() {
            const tempArr1 = [];
            const tempArr2 = [];
            this.multipleSelection.forEach(i => {
                if (i.status === '1') {
                    tempArr1.push({ adId: i.adId, adSenseId: i.adSenseId, status: '0' });
                } else {
                    tempArr2.push({ adId: i.adId, adSenseId: i.adSenseId, status: '1' });
                }
            });
            if (tempArr2.length) {
                enabledAdPosition({ params: tempArr2 }).then(res => {
                    if (res.errcode === '0000') {
                        this.$notify({
                            title: '成功',
                            message: '启用成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getAdSensesByAdId();
                        this.disabledOrEnabledNum ++;
                    }
                });
            }
            if (tempArr1.length) {
                disabledAdPosition({ params: tempArr1 }).then(res => {
                    if (res.errcode === '0000') {
                        this.$notify({
                            title: '成功',
                            message: '停用成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getAdSensesByAdId();
                        this.disabledOrEnabledNum ++;
                    }
                });
            }
        },
        handleReceiveSelect(arr, gloableUserSelectCity) {
            if (this.titleData.adBelong === '全国') {
                if (gloableUserSelectCity) {
                    arr.forEach(i => {
                        i.adSenseId = i.id;
                        i.put = `${i.totalAdsCount}/${i.threshold}`;
                        i.edit = false;
                        i.weightValue = 1;
                        i.sortNo = 1;
                        i.orderValEdit = false;
                        i.cityId = this.titleData.cityId;
                        i.cityName = i.city;
                        i.fitness = i.match;
                        this.tableData.push(Object.assign({}, i));
                    });
                } else {
                    arr.forEach(i => {
                        i.cityIds.forEach(j => {
                            if (j.checked) {
                                i.adSenseId = i.id;
                                i.cityId = j.cityId;
                                i.cityName = j.cityName;
                                i.put = `${i.totalAdsCount}/${i.threshold}`;
                                i.edit = false;
                                i.weightValue = 1;
                                i.sortNo = 1;
                                i.orderValEdit = false;
                                i.fitness = i.match;
                                this.tableData.push(Object.assign({}, i));
                            }
                        });
                    });
                }
            } else {
                arr.forEach(i => {
                    i.adSenseId = i.id;
                    i.put = `${i.totalAdsCount}/${i.threshold}`;
                    i.edit = false;
                    i.weightValue = 1;
                    i.sortNo = 1;
                    i.orderValEdit = false;
                    i.cityId = this.titleData.cityId;
                    i.cityName = i.city;
                    i.fitness = i.match;
                    this.tableData.push(Object.assign({}, i));
                });
            }
        },
        cancelAdd() {
            if (this.multipleSelection.length) {
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.undeletableTableData.some(j => {
                        return j === this.multipleSelection[i].id;
                    })) {
                        this.$notify({
                            title: '提示',
                            message: '已投放的广告位不可删除',
                            type: 'warning',
                            duration: 1000
                        });
                        this.undeletableTabelDataFlag = false;
                        break;
                    } else {
                        this.undeletableTabelDataFlag = true;
                    }
                }
                if (this.undeletableTabelDataFlag) {
                    this.multipleSelection.forEach(i => {
                        const index = this.tableData.findIndex(e => {
                            return e.id === i.id;
                        });
                        if (index > -1) {
                            this.tableData.splice(index, 1);
                        }
                    });
                }
            } else {
                this.$notify({
                    title: '提示',
                    message: '请选择广告位',
                    type: 'warning',
                    duration: 1000
                });
            }
        },
        getAdTypeList() {
            const params = { code: '1067' };
            getSelectList({ params }).then(res => {
                this.adTypes = res.result;
            });
        }
    },
    watch: {
        materialData: {
            handler(newValue) {
                if (newValue.id !== this.oldMaterialDataId) {
                    this.tableData.forEach(row => {
                        row.fitness = ((newValue.width / newValue.height) / (row.adSenseWide / row.adSenseHigh)).toFixed(2);
                    });
                }
            },
            deep: true
        }
    },
    directives: {
        focus(el, { value }, { context }) {
            if (value) {
                context.$nextTick(() => {
                    el.focus();
                });
            }
        }
    },
    components: {
        previewPic,
        materialSelect,
        adPositionSelect,
        restrictInput
    }
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.modify-advertise{
    margin: 30px auto 0;
    width: 1120px;
    .manage-container{
        .ad-title{
            border-bottom: 1px solid #ccc;
        }
        .ad-material-ad{
            border-bottom: 1px solid #ccc;
            .material-title{
                display: flex;
                justify-content: space-between;
            }
        }
        .put-set{
            .ad-position{
                display: flex;
                justify-content: space-between;
                align-item: center;
                width: 1100px;
            }
        }
        .footer{
            margin-top: 30px;
            text-align: center;
        }
    }
}
.customer-width{
    .el-dialog{
        width: 800px;
    }
}
</style>
