<template>
    <div class="add-advertise">
        <div class="manage-container">
            <div class="ad-title">
                <el-form :model="titleData" label-width="90px" ref="titleData" :rules="titleRules">
                    <el-form-item label="广告归属:">
                        <span>{{titleData.adBelong}}</span>
                    </el-form-item>
                    <el-form-item label="广告名称:" prop="adName">
                        <el-input size="small" v-model="titleData.adName" style="width:194px;"></el-input>
                    </el-form-item>
                    <el-form-item label="广告主:" prop="owner">
                        <el-select size="small" v-model="titleData.owner" filterable clearable>
                            <el-option v-for="advertiser in advertisers" :label="advertiser.advertiserName" :value="advertiser.id" :key="advertiser.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="广告类型:" prop="type">
                        <el-radio-group v-model="titleData.type">
                            <el-radio label="1">开屏广告</el-radio>
                            <el-radio label="2">Banner广告</el-radio>
                            <el-radio label="3">插屏广告</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="titleData.type === '3'" label="展现设置:">
                       <el-checkbox v-model="titleData.showSet">强制显示</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <div class="ad-material-ad">
                <div class="material-title">
                  <h3>广告物料</h3>
                  <div style="margin-top:14px;">
                      <el-button size="small" type="primary" icon="el-icon-plus" v-if="buttonVisible['5020311']" @click="dialogAddVisible = true">新建物料</el-button>
                      <el-button size="small" type="primary" icon="el-icon-edit" v-if="buttonVisible['5020317']" @click="chooseMaterial">选择/修改</el-button>
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
                    <el-form-item label="投放时间:" prop="dateRangeVal" :rules="[{ required: true, message: '请选择投放时间', trigger: 'change' }]">
                        <el-date-picker
                          v-model="putData.dateRangeVal"
                          type="datetimerange"
                          size="small"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :default-time="['00:00:00','23:59:59']">
                        </el-date-picker>
                    </el-form-item>
                </el-form>
                <div class="ad-position">
                    <div>
                        <span>投放位设置:</span>
                    </div>
                    <div>
                        <el-button size="small" type="primary" icon="el-icon-error" @click="cancelAdd">删除</el-button>
                        <el-button size="small" type="primary" icon="el-icon-plus" v-if="buttonVisible['5020322']" @click="showDialogAdPositionSelect">添加/修改</el-button>
                    </div>
                </div>
                <el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" @cell-dblclick="editCell" :height="tableHeight" :cell-style="cellStyle">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="广告位ID" prop="id" width="110" align="center">
                </el-table-column>
                <el-table-column label="城市" prop="cityName" width="100" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column label="广告位名称" prop="adSenseName" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告类型" prop="adType" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告位尺寸" prop="adPositionSize" width="110">
                </el-table-column>
                <el-table-column label="权重值" prop="importantVal" width="100">
                    <template slot-scope="scope">
                        <div v-show="!scope.row.edit"><label style="display:inline-block;width:80%;text-align:center;" v-text="scope.row.importantVal"></label><i class="el-icon-edit" @click="editImportantVal(scope.row)"></i></div>
                        <restrictInput v-show="scope.row.edit" v-model="scope.row.importantVal" :max="10" :min="1" width="79px" v-focus="scope.row.importantVal" @handleBlur="handleBlur(scope.row)"></restrictInput>
                    </template>
                </el-table-column>
                <el-table-column label="排序值" prop="orderVal" width="100">
                    <template slot-scope="scope">
                        <div v-show="!scope.row.orderValEdit"><label style="display:inline-block;width:80%;text-align:center;" v-text="scope.row.orderVal"></label><i class="el-icon-edit" @click="editOrderVal(scope.row)"></i></div>
                        <!-- <input style="width:79px;display:block;" v-show="scope.row.orderValEdit" v-focus="scope.row.orderValEdit" :value="scope.row.orderVal" @blur="changeOrderVal(scope.row, $event)"> -->
                        <restrictInput v-show="scope.row.orderValEdit" v-model="scope.row.orderVal" :max="10" :min="1" width="79px" v-focus="scope.row.orderValEdit" @handleBlur="handleBlur(scope.row)"></restrictInput>
                    </template>
                </el-table-column>
                <el-table-column label="适配度" prop="match" width="110" align="center">
                </el-table-column>
                <el-table-column label="投放／阈值／轮播" prop="put" width="160">
                </el-table-column>
            </el-table>
            </div>
            <div class="footer">
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-check" v-if="buttonVisible['5020327']" @click="save">保存</el-button>
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-check" v-if="buttonVisible['5020328']" @click="saveAndApplyShelve">保存并申请上架</el-button>
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-error" @click="$router.push('/advertise/businessManage/adPublish')">取消</el-button>
            </div>
        </div>
        <add-material :show.sync="dialogAddVisible" @sendMethod="getMaterialJustNow"></add-material>
        <material-select :show.sync="dialogMaterialChooseVisible" @showPic="handleShowPic" @receiveMaterialData="handleReceiveMaterialData"></material-select>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="showImgUrl"></preview-pic>
        <adPositionSelect :show.sync="dialogAdPositionSelectVisible" v-bind="{materialWidth: materialData.width, materialHeight: materialData.height, adType: titleData.type}" @receiveSelect="handleReceiveSelect"></adPositionSelect>
    </div>
</template>

<script>
import previewPic from '@/components/previewPic';
import addMaterial from '@/components/addMaterial';
import materialSelect from '@/components/materialSelect';
import adPositionSelect from '@/components/adPositionSelect';
import restrictInput from '@/components/restrictInput';
import buttonVisible from '@/utils/buttonVisible';
import { mapState } from 'vuex';
// import { formatLongDateToSecond } from '@/utils/index';
import {
    getCity,
    getAdvertiser,
    addAdvertise,
    addAndApplyShelveAdvertise,
    getAdSenseByIdAndCityId,
    getAdMaterial
} from '@/api/adPublish';

export default {
    name: 'addAdvertise',
    data() {
        var titleValidate = (rule, value, callback) => {
            if (value) {
                // validateAdNameIsSame({ params: value }).then(res => {
                //     if (res.result.isExist) {
                //         callback(new Error('广告名称已存在'));
                //     } else {
                //         callback();
                //     }
                // });
                callback();
            } else {
                callback(new Error('请输入广告名称'));
            }
        };
        return {
            pageId: '50203',
            titleData: {
                adBelong: '',
                adName: '',
                owner: '',
                cityId: '',
                type: '',
                showSet: false
            },
            titleRules: {
                adName: [{ required: true, validator: titleValidate, trigger: 'blur' }, { max: 200, message: '最多200个字符', trigger: 'blur' }],
                owner: [{ required: true, message: '请输入广告主', trigger: 'blur' }],
                type: [{ required: true, message: '请选择广告类型', trigger: 'change' }]
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
            putData: {
                dateRangeVal: ''
            },
            tableData: [],
            multipleSelection: [],
            loading: false,
            noTableData: '',
            tableHeight: 300,
            dialogMaterialChooseVisible: false,
            dialogPreviewPicVisible: false,
            dialogAdPositionSelectVisible: false,
            dialogAddVisible: false,
            showImgUrl: ''
        };
    },
    computed: {
        ...mapState({
            cityId: state => state.user.userInfo.cityId
        })
    },
    created() {
        getCity({ params: {}}).then(res => {
            this.titleData.adBelong = res.result.caption;
            this.titleData.cityId = res.result.caption === '本级' ? res.result.code : res.result.type;
            if (this.$route.query.id) {
                this.getAdSenseByIdAndCityId();
            }
        });
        this.getAdvertiser();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        changeImportVal(row, e) {
            row.importantVal = e.target.value;
            row.edit = false;
        },
        handleBlur(row) {
            row.edit = false;
            row.orderValEdit = false;
        },
        changeOrderVal(row, e) {
            row.orderVal = e.target.value;
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
        editImportantVal(row) {
            row.edit = true;
        },
        editOrderVal(row) {
            row.orderValEdit = true;
        },
        chooseMaterial() {
            this.dialogMaterialChooseVisible = true;
        },
        handleClickPic() {
            this.showImgUrl = this.materialData.url;
            this.dialogPreviewPicVisible = true;
        },
        handleShowPic(url) {
            this.showImgUrl = url;
            this.dialogPreviewPicVisible = true;
        },
        handleReceiveMaterialData(data) {
            this.materialData.id = data.id;
            this.materialData.name = data.materielName;
            this.materialData.size = data.materialSize;
            this.materialData.height = data.resourceHeight;
            this.materialData.width = data.resourceWidth;
            this.materialData.url = data.imgUrl;
        },
        getMaterialJustNow() {
            const params = { pageNo: 1, pageSize: 1, materielName: '', cityId: this.titleData.cityId };
            getAdMaterial({ params }).then(res => {
                this.materialData.id = res.result.rows[0].id;
                this.materialData.name = res.result.rows[0].materielName;
                this.materialData.size = res.result.rows[0].resourceWidth + '*' + res.result.rows[0].resourceHeight;
                this.materialData.height = res.result.rows[0].resourceHeight;
                this.materialData.width = res.result.rows[0].resourceWidth;
                this.materialData.url = res.result.rows[0].resourcePath;
            });
        },
        showDialogAdPositionSelect() {
            if (this.materialData.id) {
                this.dialogAdPositionSelectVisible = true;
            } else {
                this.$notify({
                    title: '提示',
                    message: '请先选择物料',
                    type: 'warning',
                    duration: 500
                });
            }
        },
        handleReceiveSelect(arr, gloableUserSelectCity) {
            if (this.titleData.adBelong === '本级') {
                if (gloableUserSelectCity) {
                    arr.forEach(i => {
                        if (this.tableData.some(row => {
                            return row.id === i.id && row.cityId === i.cityId;
                        })) {
                            this.$notify({
                                title: '提示',
                                message: '相同广告位相同城市不能重复添加',
                                type: 'warning',
                                duration: 1000
                            });
                        } else {
                            i.put = `${i.cityIds[0].count + i.cityIds[1].count}/${i.threshold}`;
                            i.edit = false;
                            i.importantVal = 1;
                            i.orderVal = 1;
                            i.orderValEdit = false;
                            i.cityId = i.cityId;
                            i.cityName = i.city;
                            this.tableData.push(Object.assign({}, i));
                        }
                    });
                } else {
                    arr.forEach(i => {
                        i.cityIds.forEach((j, index) => {
                            if (j.checked) {
                                i.cityId = j.cityId;
                                i.cityName = j.cityName;
                                if (index !== 0) {
                                    i.put = `${(j.count + i.cityIds[0].count)}/${i.threshold}`;
                                } else {
                                    i.put = `${j.count}/${i.threshold}`;
                                }
                                i.edit = false;
                                i.importantVal = 1;
                                i.orderVal = 1;
                                i.orderValEdit = false;
                                if (this.tableData.some(row => {
                                    return row.id === i.id && row.cityId === i.cityId;
                                })) {
                                    this.$notify({
                                        title: '提示',
                                        message: '相同广告位相同城市不能重复添加',
                                        type: 'warning',
                                        duration: 1000
                                    });
                                } else {
                                    this.tableData.push(Object.assign({}, i));
                                }
                            }
                        });
                    });
                }
            } else {
                arr.forEach(i => {
                    if (this.tableData.some(row => {
                        return row.id === i.id && row.cityId === i.cityId;
                    })) {
                        this.$notify({
                            title: '提示',
                            message: '相同广告位相同城市不能重复添加',
                            type: 'warning',
                            duration: 1000
                        });
                    } else {
                        i.put = `${i.cityIds[0].count + i.cityIds[1].count}/${i.threshold}`;
                        i.edit = false;
                        i.importantVal = 1;
                        i.orderVal = 1;
                        i.orderValEdit = false;
                        i.cityId = this.titleData.cityId;
                        i.cityName = i.city;
                        this.tableData.push(Object.assign({}, i));
                    }
                });
            }
        },
        cellStyle({ row, columnIndex }) {
            if (((Number(row.match) >= 1.1 || Number(row.match) <= 0.9) && columnIndex === 8) || (columnIndex === 9 && row.totalAdsCount > row.deliveryThreshold)) {
                return { color: 'red' };
            }
        },
        getAdvertiser() {
            getAdvertiser({ params: {}}).then(res => {
                this.advertisers = res.result;
            });
        },
        cancelAdd() {
            this.multipleSelection.forEach(el => {
                const findIndex = this.tableData.findIndex(i => {
                    return i.id === el.id;
                });
                console.log(findIndex);
                if (findIndex > -1) {
                    this.tableData.splice(findIndex, 1);
                }
            });
        },
        save() {
            this.$refs.titleData.validate((valid1) => {
                if (valid1) {
                    this.$refs.putData.validate(valid2 => {
                        if (valid2) {
                            if (this.tableData.length) {
                                const overMatchNum = this.tableData.filter(i => {
                                    return Number(i.match) > 1.1 || Number(i.match) < 0.9;
                                }).length;
                                if (overMatchNum) {
                                    this.$confirm(`有${overMatchNum}条适配偏差超过0.1`, '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning',
                                        center: true
                                    }).then(() => {
                                        const params = { cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adType: this.titleData.type, displayType: Number(this.titleData.showSet), adMateriel: { id: this.materialData.id }, adTime: { adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [] };
                                        this.tableData.forEach(e => {
                                            params.adSenseAdvertisementVos.push({ adSenseId: e.id, cityId: e.cityId, weightValue: e.importantVal, sortNo: e.orderVal, fitness: e.match });
                                        });
                                        addAdvertise({ params }).then(res => {
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
                                    const params = { cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adType: this.titleData.type, displayType: Number(this.titleData.showSet), adMateriel: { id: this.materialData.id }, adTime: { adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [] };
                                    this.tableData.forEach(e => {
                                        params.adSenseAdvertisementVos.push({ adSenseId: e.id, cityId: e.cityId, weightValue: e.importantVal, sortNo: e.orderVal, fitness: e.match });
                                    });
                                    addAdvertise({ params }).then(res => {
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
                            } else {
                                this.$notify({
                                    title: '提示',
                                    message: '请添加广告位',
                                    type: 'warning',
                                    duration: 1000
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
                            if (this.tableData.length) {
                                const params = { cityId: this.titleData.cityId, adName: this.titleData.adName, adAdvertiserId: `${this.titleData.owner}`, adType: this.titleData.type, displayType: Number(this.titleData.showSet), adMateriel: { id: this.materialData.id }, adTime: { adBeginDate: this.putData.dateRangeVal[0], adEndDate: this.putData.dateRangeVal[1] }, adSenseAdvertisementVos: [] };
                                this.tableData.forEach(e => {
                                    params.adSenseAdvertisementVos.push({ adSenseId: e.id, cityId: e.cityId, weightValue: e.importantVal, sortNo: e.orderVal, fitness: e.match });
                                });
                                addAndApplyShelveAdvertise({ params }).then(res => {
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
                            } else {
                                this.$notify({
                                    title: '提示',
                                    message: '请添加广告位',
                                    type: 'warning',
                                    duration: 1000
                                });
                            }
                        }
                    });
                }
            });
        },
        getAdSenseByIdAndCityId() {
            getAdSenseByIdAndCityId({ params: { id: this.$route.query.id, cityId: this.titleData.cityId }}).then(res => {
                if (res.errcode === '0000') {
                    // this.tableData = res.result.filter(i => {
                    //     i.adPositionSize = `${i.adSenseWide}*${i.adSenseHigh}`;
                    //     i.edit = false;
                    //     i.orderValEdit = false;
                    //     i.put = `${i.totalAdsCount}/${i.deliveryThreshold}/${i.carouselNumber}`;
                    //     return i;
                    // });
                    this.tableData.push({ id: res.result.adSenseId, cityId: res.result.cityId, cityName: res.result.cityName, adSenseName: res.result.adSenseName, adType: res.result.adSenseTypeDesc, adPositionSize: `${res.result.adSenseWide}*${res.result.adSenseHigh}`, importantVal: res.result.weightValue, orderVal: res.result.sortNo, put: `${res.result.totalAdsCount}/${res.result.deliveryThreshold}/${res.result.carouselNumber}`, edit: false, orderValEdit: false, adSenseWide: res.result.adSenseWide, adSenseHigh: res.result.adSenseHigh });
                    this.titleData.type = res.result.adSenseType;
                }
            });
        }
    },
    watch: {
        materialData: {
            handler(newValue) {
                if (this.$route.query.id) {
                    if (newValue.width) {
                        this.$set(this.tableData[0], 'match', ((newValue.width / newValue.height) / (this.tableData[0].adSenseWide / this.tableData[0].adSenseHigh)).toFixed(2));
                    }
                } else {
                    if (newValue.width) {
                        this.tableData.forEach(row => {
                            row.match = ((newValue.width / newValue.height) / (row.adSenseWide / row.adSenseHigh)).toFixed(2);
                        });
                    }
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
        restrictInput,
        addMaterial
    },
    mixins: [buttonVisible]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.add-advertise{
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
.choose{
        background-color: #BBFFFF !important;
        &:hover{
            td{
                background-color: #BBFFFF !important;
            }
        }
}
</style>
