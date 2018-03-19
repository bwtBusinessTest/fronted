<template>
    <div class="ad-city-position">
        <div class="query-container" style="height:70px">   
            <el-row :gutter="20">
                <el-col :span="20">
                    <el-form :inline="true" label-width="100px" ref="copyForm" :model="copyForm" :rules="copyFormRules">
                        <el-form-item label="当前城市:" prop="cityId">
                            <el-select size="small" v-model="copyForm.cityId" filterable placeholder="请选择" @change="changeCurrentCity">
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
                    </el-form>
                </el-col>
                <el-col :span="4"><el-button size="small" type="primary" icon="check" style="margin-top:5px" @click="saveEdit" v-if="buttonVisible['5010205']">保存修改</el-button></el-col>
            </el-row> 
        </div>
        <div class="manage-container">
            <el-row>
                <el-row :gutter="20">
                    <el-col :span="11" style="box-shadow: 0 0 4px #ccc;padding-top:10px">
                        <div style="color:#ccc">可添加:{{tableDataLeft.length}}条</div>
                        <el-form :inline="true" ref="searchFormLeft">
                            <el-form-item>
                                <el-select size="small" v-model="form.cityId" filterable clearable placeholder="选择城市" style="width:100px">
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
                            <el-form-item>
                                <el-select size="small" v-model="form.adSenseType" clearable placeholder="选择类型" style="width:100px">
                                    <el-option
                                        v-for="item in adPosTypeMenu"
                                        :key="item.id"
                                        :label="item.caption"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="form.adSenseName" size="small" style="width:150px"></el-input>
                            </el-form-item>
                            <el-button size="small" type="primary" icon="search" style="margin-top:3px" @click="searchData" v-if="buttonVisible['5010203']">查询</el-button>
                        </el-form>
                        <el-table :data="tableDataLeft" fit ref="multipleTable1" height="300" @row-click="rowSelectionLeft" @selection-change="handleSelectionChangeLeft" :reserve-selection="true">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column label="广告位名称" prop="adSenseName">
                            </el-table-column>
                            <el-table-column label="详细信息">
                                <template slot-scope="props">
                                    {{props.row.id}}/{{props.row.adSenseTypeDesc}}/{{props.row.adSenseCode}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="2">
                        <div class="middleControl">
                            <div><el-button size="small" type="primary" style="margin-top:5px" @click="copyAll">全部></el-button></div>
                            <div><el-button size="small" type="primary" style="margin-top:5px" @click="copySelection">>></el-button></div>
                            <div><el-button size="small" type="primary" style="margin-top:5px" @click="cancleSelection"><<</el-button></div>
                            <div><el-button size="small" type="primary" style="margin-top:5px" @click="cancleAll"><全部</el-button></div>
                        </div>
                    </el-col>
                    <el-col :span="11" style="box-shadow: 0 0 4px #ccc;padding-top:10px">
                        <div style="color:#cfcfcf">已添加:{{tableDataRight.length}}条</div>
                        <el-form :inline="true" ref="searchFormRight">
                            <el-form-item>
                                <el-select size="small" v-model="rightForm.adSenseType" clearable placeholder="选择类型" style="width:100px">
                                    <el-option
                                        v-for="item in adPosTypeMenu"
                                        :key="item.id"
                                        :label="item.caption"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="rightForm.adSenseName" size="small" style="width:150px"></el-input>
                            </el-form-item>
                            <el-button size="small" type="primary" icon="search" style="margin-top:3px" @click="searchRightData" v-if="buttonVisible['5010204']">查询</el-button>
                        </el-form>
                        <el-table :data="newtableData" ref="multipleTable2" @row-click="rowSelectionRight" @selection-change="handleSelectionChangeRight" height="300" :reserve-selection="true">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column label="广告位ID" prop="adSenseName">
                            </el-table-column>
                            <el-table-column label="详细信息">
                                <template slot-scope="props">
                                    {{props.row.id}}/{{props.row.adSenseTypeDesc}}/{{props.row.adSenseCode}}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </el-row> 
        </div>           
    </div>
</template>

<script>
import { queryAdPositionByCity, adPositionForCity, getMenuList, getCityList } from '../../api/cityAdPosition';
import butVisibleMixin from '../../utils/buttonVisible';
export default {
    mixins: [butVisibleMixin],
    data() {
        return {
            pageId: '50102',
            cityMenu: [],
            adPosTypeMenu: [],
            // 条件查询
            form: {
                cityId: '',
                adSenseType: '',
                adSenseName: ''
            },
            copyForm: {
                cityId: ''
            },
            rightForm: {
                adSenseType: '',
                adSenseName: ''
            },
            currentCity: '',
            // 表格数据
            tableDataLeft: [],
            tableDataRight: [],
            newtableData: [],
            multipleSelection1: [],
            multipleSelection2: [],
            copyFormRules: {
                cityId: [{ required: true, message: '请选择要复制到的城市', trigger: 'change' }]
            }
        };
    },
    created() {
        this.searchCurrentCity();
        this.getTypeMenuList();
        this.getCityMenuList();
    },
    methods: {
        // 接口调用
        // 获取支持城市下拉框数据列表
        getTypeMenuList() {
            const params = { code: '1042' };
            getMenuList({ params }).then(res => {
                this.adPosTypeMenu = res.result;
            });
        },
        // 获取城市下拉列表数据
        getCityMenuList() {
            const params = { level: '2' };
            getCityList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.cityMenu = res.result;
                }
            });
        },
        // 查询
        searchCurrentCity() {
            const params = this.form;
            params.selectedCityId = this.copyForm.cityId;
            queryAdPositionByCity({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableDataLeft = res.result.rows;
                    for (var i = 0; i < this.tableDataRight.length; i++) {
                        for (var j = 0; j < this.tableDataLeft.length; j++) {
                            if (this.tableDataRight[i].id === this.tableDataLeft[j].id) {
                                this.tableDataLeft.splice(j, 1);
                                break;
                            }
                        }
                    }
                }
            });
        },
        // 改变当前城市
        changeCurrentCity() {
            this.searchCurrentCity();
            const params = { cityId: this.copyForm.cityId };
            queryAdPositionByCity({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.newtableData = res.result.rows;
                    this.tableDataRight = this.newtableData;
                }
            });
        },
        // 点击左边查询
        searchData() {
            this.searchCurrentCity();
        },
        // 点击右边查询
        searchRightData() {
            var keyWords = new RegExp(this.rightForm.adSenseName, 'i');
            var adType = new RegExp(this.rightForm.adSenseType, 'i');
            this.newtableData = [];
            for (var i = 0; i < this.tableDataRight.length; i++) {
                if (adType.test(this.tableDataRight[i].adSenseType) && (keyWords.test(this.tableDataRight[i].adSenseName))) {
                    this.newtableData.push(this.tableDataRight[i]);
                }
            }
        },
        // 点击保存修改
        saveEdit() {
            this.$refs['copyForm'].validate((valid) => {
                if (valid) {
                    const ids = [];
                    for (var i = 0; i < this.tableDataRight.length; i++) {
                        ids.push(this.tableDataRight[i].id);
                    }
                    const params = { adSenseIds: ids, cityId: this.copyForm.cityId };
                    adPositionForCity({ params }).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify.success({
                                title: '消息',
                                message: '保存成功',
                                duration: 800
                            });
                            this.searchCurrentCity();
                            this.rightForm.adSenseType = '';
                            this.rightForm.adSenseName = '';
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 单击行选中
        rowSelectionLeft(row) {
            this.$refs.multipleTable1.toggleRowSelection(row);
        },
        rowSelectionRight(row) {
            this.$refs.multipleTable2.toggleRowSelection(row);
        },
        // 复制操作
        copyAll() {
            // const dataCount = this.tableDataLeft.length;
            this.tableDataRight = this.tableDataLeft.concat(this.tableDataRight);
            this.newtableData = this.tableDataRight;
            this.tableDataLeft = [];
            this.rightForm.adSenseType = '';
            this.rightForm.adSenseName = '';
            // this.multipleSelection2 = this.multipleSelection2.concat(this.multipleSelection1);
            // for(var i=0;i<dataCount;i++) {
            //     this.tableDataRight.push(this.tableDataLeft[i])
            // }
        },
        // 复制选中
        copySelection() {
            for (var i = 0; i < this.multipleSelection1.length; i++) {
                for (var j = 0; j < this.tableDataLeft.length; j++) {
                    if (this.multipleSelection1[i].id === this.tableDataLeft[j].id) {
                        this.tableDataLeft.splice(j, 1);
                        j = j - 1;
                    }
                }
                this.tableDataRight.unshift(this.multipleSelection1[i]);
            }
            for (var l = this.tableDataRight.length - 1; l >= 0; l--) {
                for (var k = 0; k < this.newtableData.length; k++) {
                    if (this.tableDataRight[l].id === this.newtableData[k].id) {
                        break;
                    }
                }
                if (k === this.newtableData.length) {
                    this.newtableData.unshift(this.tableDataRight[l]);
                }
            }
            this.rightForm.adSenseType = '';
            this.rightForm.adSenseName = '';
            this.multipleSelection1.forEach(row => {
                this.$refs.multipleTable2.toggleRowSelection(row, true);
            });
            this.multipleSelection1 = [];
        },
        // 取消选中
        cancleSelection() {
            for (var i = 0; i < this.multipleSelection2.length; i++) {
                for (var j = 0; j < this.tableDataRight.length; j++) {
                    if (this.multipleSelection2[i].id === this.tableDataRight[j].id) {
                        this.tableDataRight.splice(j, 1);
                        j = j - 1;
                    }
                }
                this.newtableData.forEach((ele, index) => {
                    if (this.multipleSelection2[i].id === ele.id) {
                        this.newtableData.splice(index, 1);
                    }
                });
                this.tableDataLeft.unshift(this.multipleSelection2[i]);
            }
            // this.searchRightData();
            // this.multipleSelection1 = [];
        },
        // 取消所有
        cancleAll() {
            this.tableDataLeft = this.tableDataLeft.concat(this.tableDataRight);
            this.tableDataRight = [];
            this.newtableData = this.tableDataRight;
        },
        // 选中操作
        handleSelectionChangeLeft(val) {
            this.multipleSelection1 = val;
        },
        handleSelectionChangeRight(val) {
            this.multipleSelection2 = val;
        }
    }
};
</script>

<style lang="scss" scoped>
    @import '../../styles/common.scss';
    .ad-city-position{
        margin: 30px auto 0;
        width: 1120px;
        .middleControl{
            margin-top:180px;
            .el-button{
                width:70px;
            }
        }
        .el-form{   
            height:30px;
        }
        .el-table{
            height:400px!important;
            .el-table__header-wrapper{
                height:0!important;
            }
            .el-table-column--selection{
                display: none!important;
            }
        }
    }
</style>
