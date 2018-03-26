<template>
    <div class="ad-position-ad">
        <div class="query-container" ref="queryContainer" style="height:250px">   
            <el-form :inline="true" label-width="100px" ref="searchForm">
                <el-row>
                    <el-form-item  label="广告位名称:">
                        <el-input disabled v-model="form.adSenseName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="广告类型:">
                        <el-select size="small" disabled v-model="form.adSenseType">
                            <el-option
                                v-for="item in adTypeMenu"
                                :key="item.value"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="广告位ID:">
                        <el-input size="small" disabled filterable v-model="form.id"></el-input>
                    </el-form-item>
                    <el-form-item label="投放城市:">
                        <el-select size="small" clearable :disabled="flag" filterable v-model="form.cityId" placeholder="全部">
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
                </el-row>
                <el-row>
                    <el-form-item label="广告状态:">
                        <el-select size="small" clearable v-model="form.adStatus">
                            <el-option
                                v-for="item in adStatusMenu"
                                :key="item.value"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投放位配置:">
                        <el-select size="small" clearable v-model="form.status">
                            <el-option
                                v-for="item in statusMenu"
                                :key="item.value"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="广告归属:">
                        <el-select size="small" clearable filterable v-model="form.adCityId">
                            <el-option-group
                                v-for="group in cityList"
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
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button  size="small" type="primary" icon="search" @click="getAdLists" v-if="buttonVisible['5020210']">筛选</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row type="flex" style="width:1072px;margin-bottom:10px" justify="start">
                <el-button  size="small" type="primary" icon="search" @click="addAdvise" v-if="buttonVisible['5020207']">添加广告</el-button>       
            </el-row>
            <el-table :data="tableData" border ref="multipleTable2" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight" @selection-change="handleSelectionChange" :default-sort = "{prop: 'adId', order: 'ascending'}">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="广告ID" prop="adId" sortable>
                </el-table-column>
                <el-table-column label="广告名称" prop="adName" width="150">
                    <template slot-scope="props">
                        <span v-if="props.row.disPlayType" class="strongShow">[强显]</span><span>{{props.row.adName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="图片" prop="adResourcePath">
                    <template slot-scope="props">
                        <img class="materialImg" :src="props.row.adResourcePath" @click="handleClickPic(props.row.adResourcePath,props.row.adResourceName)">
                    </template>
                </el-table-column>
                <el-table-column label="广告归属" prop="adCityName">
                </el-table-column>
                <el-table-column label="投放城市" prop="cityName">
                </el-table-column>
                <el-table-column label="权重值" align="center" prop="weightValue" sortable>
                </el-table-column>
                <el-table-column label="排序值" align="center" prop="sortNo" sortable>
                </el-table-column>
                <el-table-column label="广告状态" align="center" prop="adStatusDesc">
                </el-table-column>
                <el-table-column label="投放位配置" align="center" prop="statusDesc">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="20" :page-sizes="[20, 50, 100]" @current-change="currenChange" @size-change="sizeChange"></el-pagination>
            </div>
        </div>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="showImgUrl"></preview-pic>
    </div>    
</template>

<script>
import { getAdLists, getMenuList, getManagerCityMenu } from '../../api/adPositionAd';
import { getCityList } from '../../api/adPosition';
import restrictInput from '@/components/restrictInput';
import previewPic from '@/components/previewPic';
import butVisibleMixin from '../../utils/buttonVisible';
export default {
    mixins: [butVisibleMixin],
    components: {
        restrictInput,
        previewPic
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
    data() {
        return {
            pageId: '50202',
            showImgUrl: '',
            // 表格数据
            tableData: [],
            loading: true,
            total: 0,
            multipleSelection: [],
            form: {
                adSenseName: this.$route.query.adSenseName,
                cityId: this.$route.query.cityId.toString(),
                adCityId: '',
                id: this.$route.query.id,
                adSenseType: this.$route.query.adSenseType,
                adStatus: '',
                status: ''
            },
            flag: false,
            cityMenu: [],
            cityList: [],
            throwSituation: [],
            adTypeMenu: [],
            adStatusMenu: [],
            statusMenu: [],
            dialogPreviewPicVisible: false
        };
    },
    created() {
        this.getCityMenu();
        this.getCityMenuList();
        this.getMenuListByCode('1042');
        this.getMenuListByCode('1049');
        this.getMenuListByCode('1069');
    },
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return 500;
            }
        }
    },
    methods: {
        getCityMenu() {
            const params = { level: '2' };
            getManagerCityMenu({ params }).then(res => {
                if (res.errcode === '0000') {
                    if (res.result.length > 1) {
                        this.cityMenu = res.result;
                        this.cityMenu.forEach((ele, index) => {
                            if (ele.children && ele.children.length > 0) {
                                ele.children.forEach((e, idx) => {
                                    if (e.code === '0') {
                                        e.label = '全国';
                                    }
                                });
                            }
                        });
                    } else {
                        this.cityMenu = res.result;
                        this.flag = true;
                        this.form.cityId = this.cityMenu[0].children[0].code;
                    }
                }
                this.getAdLists();
            });
        },
         // 获取城市下拉列表数据
        getCityMenuList() {
            const params = { level: '2' };
            getCityList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.cityList = res.result;
                    this.cityList.unshift({ id: null, code: null, label: null, status: null, sortNo: null, parentCode: null, children: [{ id: null, code: '0', label: '本级', status: '1', sortNo: null, parentCode: null, children: null }] });
                }
            });
        },
        // 根据code值获取下拉列表
        getMenuListByCode(code) {
            const params = { code: code };
            getMenuList({ params }).then(res => {
                if (code === '1042') {
                    this.adTypeMenu = res.result;
                }
                if (code === '1049') {
                    this.adStatusMenu = res.result;
                }
                if (code === '1069') {
                    this.statusMenu = res.result;
                }
            });
        },
        // 清空数据
        formClear() {
            this.form = this.$options.data().form;
            this.dialogAddVisible = false;
            this.dialogEditVisible = false;
        },
        clearData(formName) {
            this.$refs[formName].resetFields();
        },
        // 查询广告列表
        getAdLists() {
            const params = { adSenseId: this.form.id, cityId: this.form.cityId, adCityId: this.form.adCityId, adStatus: this.form.adStatus, status: this.form.status };
            getAdLists({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.total = res.result.totalCount;
                    this.tableData = res.result.rows.filter(i => {
                        i.edit = false;
                        i.orderValEdit = false;
                        if (i.cityId === 0) {
                            i.cityName = '全国';
                        }
                        return i;
                    });
                    this.loading = false;
                }
            });
        },
        // 分页
        currenChange(val) {
            this.form.pageNo = val;
            this.getAdLists();
        },
        sizeChange(val) {
            this.form.pageSize = val;
            this.getAdLists();
        },
        // 添加广告
        addAdvise() {
            this.$router.push({ name: '添加广告', query: { id: this.form.id }});
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            var ifSameOff = this.multipleSelection.every(function(ele) {
                return ele.status === '0';
            });
            var ifSameOn = this.multipleSelection.every(function(ele) {
                return ele.status === '1';
            });
            ifSameOff ? this.ifShowOff = true : this.ifShowOff = false;
            ifSameOn ? this.ifShowOn = true : this.ifShowOn = false;
            if (this.multipleSelection.length === 0) {
                this.ifShowOff = false;
                this.ifShowOn = false;
            }
        },
        // 图片预览
        handleClickPic(path, name) {
            this.showImgUrl = path;
            this.dialogPreviewPicVisible = true;
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '250px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        }
    }
};
</script>

<style lang='scss' scoped>
    @import '../../styles/common.scss';
    .ad-position-ad{
        margin: 30px auto 0;
        width: 1120px;
        .query-container{
            .el-form-item{
                width:400px;
            }
            .el-input--small{
                width:200px;
            }
        }
        .manage-container{
            .el-col{
                margin-right: 30px;
            }
        }
    }   
    .manage{
        color: #409EFF;
        font-size: 12px;
        cursor: pointer;
        padding: 0 6px;
    }
    .manage:hover{
        text-decoration: underline;
        cursor: pointer;
    }  
    .showEdit{
        display:none;
    }   
    .materialImg{
        width:80px;
    }
    .strongShow{
        color: red;
    }
</style>
