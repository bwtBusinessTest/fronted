<template>
    <div class="ad-position-ad">
        <div class="query-container" ref="queryContainer" style="height:180px;">   
            <el-form :inline="true" label-width="100px" ref="searchForm">
                <el-row>
                    <el-form-item  label="广告位名称:">
                        <el-input v-model="form.adSenseName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="所属城市:">
                        <el-select size="small" :disabled="flag" filterable clearable v-model="form.cityId" placeholder="全部">
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
                    <el-form-item label="广告类型:">
                        <el-select size="small" filterable v-model="form.adSenseType" clearable placeholder="全部">
                            <el-option
                                v-for="item in adTypeMenu"
                                :key="item.value"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投放情况:">
                        <el-select size="small" filterable v-model="form.situation" clearable placeholder="全部">
                            <el-option
                                v-for="item in throwSituation"
                                :key="item.value"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button size="small" type="primary" icon="delete" @click="formClear" v-if="buttonVisible['5020201']">清空</el-button>
                <el-button  size="small" type="primary" icon="search" @click="searchData" v-if="buttonVisible['5020202']">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-table :data="tableData" border ref="multipleTable2" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight" :default-sort = "{prop: 'adSenseId', order: 'ascending'}">
                <el-table-column label="操作" align="center">
                    <template slot-scope="props">
                        <span class="manage" @click="manage(props.row)" v-if="buttonVisible['5020206']">管理</span>
                    </template>
                </el-table-column>
                <el-table-column label="广告位ID" prop="adSenseId" sortable>
                </el-table-column>
                <el-table-column label="广告位名称" prop="adSenseName">
                </el-table-column>
                <el-table-column label="广告类型" prop="adSenseTypeDesc">
                </el-table-column>
                <el-table-column label="投放/阀值/轮播" align="center">
                    <template slot-scope="props">
                        <span v-if="props.row.cityName!='本级'" v-bind:class="{ active: props.row.totalAdsCount>props.row.deliveryThreshold }">{{props.row.totalAdsCount}}/{{props.row.deliveryThreshold}}/{{props.row.carouselNumber}}</span>
                        <span v-if="props.row.cityName=='本级'">-</span>
                    </template>
                </el-table-column>
                <el-table-column label="尺寸">
                    <template slot-scope="props">
                        <span>{{props.row.adSenseWide}}X{{props.row.adSenseHigh}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="城市" prop="cityName">
                </el-table-column>
                <el-table-column label="备注信息" prop="remark">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="20" :page-sizes="[10, 20, 30]" @current-change="currenChange" @size-change="sizeChange"></el-pagination>
            </div>
        </div>
    </div>    
</template>

<script>
import { getAdPositionLists, getMenuList, getManagerCityMenu } from '../../api/adPositionAd';
import butVisibleMixin from '../../utils/buttonVisible';
export default {
    mixins: [butVisibleMixin],
    data() {
        return {
            pageId: '50202',
            // 表格数据
            tableData: [],
            loading: true,
            total: 0,
            form: {
                pageNo: 1,
                pageSize: 20,
                adSenseName: '',
                cityId: '',
                adSenseType: '',
                situation: ''
            },
            cityMenu: [],
            throwSituation: [],
            adTypeMenu: [],
            flag: false
        };
    },
    created() {
        this.getCityMenu();
        this.getMenuListByCode('1042');
        this.getMenuListByCode('1066');
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
                this.searchData();
            });
        },
        // 根据code值获取下拉列表
        getMenuListByCode(code) {
            const params = { code: code };
            getMenuList({ params }).then(res => {
                if (code === '1042') {
                    this.adTypeMenu = res.result;
                }
                if (code === '1066') {
                    this.throwSituation = res.result;
                }
            });
        },
        // 清空数据
        formClear() {
            if (this.flag === true) {
                this.form.adSenseName = '';
                this.form.adSenseType = '';
                this.form.situation = '';
            } else {
                this.form = this.$options.data().form;
            }
        },
        // 查询数据
        searchData() {
            const params = this.form;
            getAdPositionLists({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows;
                    this.tableData.forEach((ele, index) => {
                        if (ele.cityId === 0) {
                            ele.cityName = '全国';
                        }
                    });
                    this.total = res.result.totalCount;
                    this.loading = false;
                }
            });
        },
        manage(row) {
            this.$router.push({ name: '广告投放设置', query: { adSenseName: row.adSenseName, id: row.adSenseId, adSenseType: row.adSenseType, cityId: row.cityId }});
        },
         // 分页
        currenChange(val) {
            this.form.pageNo = val;
            this.searchData();
        },
        sizeChange(val) {
            this.form.pageSize = val;
            this.searchData();
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '180px';
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
    .active{
        color:red;
    }
</style>
