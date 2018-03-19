<template>
    <div class="ad-position-select">
        <el-dialog title="广告位选择" :visible.sync="visible" @close="closeDialog" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
            <div style="display:flex;justify-content: space-between;">
                <div>
                    <span>条件查询:</span>
                    <el-select size="small" v-model="city" :key="1" style="width:130px;" filterable>
                        <el-option-group
                            v-for="group in cityMenu"
                            :key="group.id"
                            :label="group.label">
                            <el-option
                                v-for="item in group.children"
                                :key="item.id"
                                :label="item.label"
                                :value="item.code">
                              </el-option>
                        </el-option-group>
                    </el-select>
                    <el-select size="small" v-model="type" style="width:130px;" disabled clearable>
                        <el-option label="开屏" value="1"></el-option>
                        <el-option label="Banner" value="2"></el-option>
                        <el-option label="插屏广告" value="3"></el-option>
                    </el-select>
                    <el-input size="small" placeholder="关键字" v-model="keywords" style="width:130px;"></el-input>
                    <el-button size="mini" type="primary" v-if="buttonVisible['5020323']" @click="filterSelect">筛选</el-button>
                </div>
                <div>
                    <el-button size="small" type="primary" v-if="buttonVisible['5020326']" @click="confirmSelect">确认选择</el-button>
                    <el-button size="small" type="primary" @click="$emit('update:show', false)">返回</el-button>
                </div>
            </div>
            <div v-if="city === '0'">
                <el-table :data="adPositiontableData" :cell-style="noBorderRight" border :key="1">
                    <el-table-column type="expand" width="30">
                        <template slot-scope="props">
                            <div class="row-citys">
                                <div v-for="(item, index) in props.row.cityIds">
                                    <el-checkbox v-model="item.checked" :disabled="disabledCheckbox(props.row, index)" :key="index">{{`${item.cityName}(${item.count})`}}</el-checkbox>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="选择城市" align="left" width="80">
                        <template slot-scope="props">
                            <span :class="{ hasSelected : props.row.cityIds.filter(city => city.checked).length > 0 }">{{`选择[${props.row.cityIds.filter(city => city.checked).length}]`}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="广告位ID" prop="id"  align="center">
                    </el-table-column>
                    <el-table-column label="广告位名称" prop="adSenseName" align="center">
                    </el-table-column>
                    <el-table-column label="广告类型" prop="adType" align="center">
                    </el-table-column>
                    <el-table-column label="广告位尺寸" prop="adPositionSize">
                    </el-table-column>
                    <el-table-column label="适配度" prop="match">
                    </el-table-column>
                    <el-table-column label="阈值/轮播" prop="threshold">
                    </el-table-column>
                </el-table>
                <div class="page-container">
                    <el-pagination layout="total, prev, pager, next" :total="totalRows" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                </div>
            </div>
            <div v-else>
                <el-table :data="adPositiontableData2" @selection-change="handleSelectionChange" border height="300" :key="2" :cell-style="markMatch">
                    <el-table-column type="selection">
                    </el-table-column>
                    <el-table-column label="广告位ID" prop="id"  align="center">
                    </el-table-column>
                    <el-table-column label="城市" prop="city"  align="center">
                    </el-table-column>
                    <el-table-column label="广告位名称" prop="adSenseName" >
                    </el-table-column>
                    <el-table-column label="广告类型" prop="adType" align="center">
                    </el-table-column>
                    <el-table-column label="广告位尺寸" prop="adPositionSize">
                    </el-table-column>
                    <el-table-column label="适配度" prop="match">
                    </el-table-column>
                    <el-table-column label="阈值/轮播" prop="threshold">
                    </el-table-column>
                </el-table>
                <div class="page-container">
                    <el-pagination layout="total, prev, pager, next" :total="totalRows2" :page-size="pageSize" @current-change="handleCurrentChange2"></el-pagination>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCityList } from '@/api/cardManage';
import { getAdPosition, getCityListByUser } from '@/api/adPublish';
import publicMethod from '@/utils/publicMethod';
import buttonVisible from '@/utils/buttonVisible';
const AD_TYPE = ['', '开屏广告', 'Banner广告', '插屏广告']

export default {
    name: 'adPositionSelect',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        materialWidth: {
            type: Number,
            default: 0
        },
        materialHeight: {
            type: Number,
            default: 0,
        },
        adType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageId: '50203',
            visible: this.show,
            city: '',
            type: '',
            keywords: '',
            cityMenu: [],
            adPositiontableData: [],
            currentPage: 1,
            currentPage2: 1,
            adPositiontableData2: [],
            multipleSelection: [],
            totalRows: 0,
            totalRows2: 0,
            pageSize: 5
        };
    },
    created() {
        this.getCityList();
    },
    methods: {
        closeDialog() {
            this.$emit('update:show', false);
        },
        noBorderRight({row, columnIndex }) {
            if (columnIndex === 0) {
                return { 'border-right': 'none' };
            }
            if ((Number(row.match) >= 1.1 || Number(row.match) <= 0.9) && columnIndex === 6) {
                return { color: 'red' };
            }
        },
        markMatch({row, columnIndex }) {
            if ((Number(row.match) >= 1.1 || Number(row.match) <= 0.9) && columnIndex === 6) {
                return { color: 'red' };
            }
        },
        filterSelect() {
            this.getAdPositionLists();
        },
        getAdPositionLists(page) {
            const pageNo = page || 1;
            const params = { pageNo: pageNo, pageSize: this.pageSize, adSenseName: this.keywords, cityId: this.city, adSenseType: this.type, status: '1' }
            getAdPosition({ params }).then(res => {
                if (this.city === '0') {
                    this.adPositiontableData = res.result.rows.filter(row => {
                        row.cityIds.forEach(el => {
                            el.checked = false;
                            if (el.cityId === 0) {
                                el.cityName = '全国';
                            }
                        });
                        row.adType = AD_TYPE[row.adSenseType];
                        row.adPositionSize = `${row.adSenseWide}*${row.adSenseHigh}`;
                        row.threshold = `${row.deliveryThreshold}/${row.carouselNumber}`;
                        row.match = ((this.materialWidth / this.materialHeight) / (row.adSenseWide / row.adSenseHigh)).toFixed(2);
                        return row;
                    });
                    this.totalRows = res.result.totalCount;
                } else {
                    this.adPositiontableData2 = res.result.rows.filter(row => {
                        row.adType = AD_TYPE[row.adSenseType];
                        row.adPositionSize = `${row.adSenseWide}*${row.adSenseHigh}`;
                        row.threshold = `${row.deliveryThreshold}/${row.carouselNumber}`;
                        row.match = ((this.materialWidth / this.materialHeight) / (row.adSenseWide / row.adSenseHigh)).toFixed(2);
                        this.cityMenu.forEach(province => {
                            if (province.children) {
                                const city = province.children.find(city => {
                                    return city.code === this.city;
                                });
                                if (city) {
                                    row.city = city.label;
                                    row.cityId = city.code;
                                }
                            } else {
                                if (province.code === this.city) {
                                    row.city = province.label;
                                    row.cityId = province.code;
                                }
                            }
                            
                        });
                        return row;
                    });
                    this.totalRows2 = res.result.totalCount;
                }
            });
        },
        getCityList() {
            const params = { level: '2' };
            getCityListByUser({ params }).then(res => {
                this.cityMenu = res.result;
                if (this.cityMenu.length > 1) {
                    this.city = '0';
                    this.cityMenu[0].children[0].label = '全国';
                } else {
                    this.city = res.result[0].children[0].code;
                }
            });
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdPositionLists(this.currentPage);
        },
        handleCurrentChange2(val) {
            this.currentPage2 = val;
            this.getAdPositionLists(this.currentPage2);
        },
        confirmSelect() {
            if (this.city === '0') {
                var selectArr = [];
                this.adPositiontableData.forEach(row => {
                    if (row.cityIds.some(el => {
                        return el.checked;
                    })) {
                        selectArr.push(row);
                    }
                });
                this.$emit('receiveSelect', selectArr);
                this.$emit('update:show', false);
            } else {
                this.$emit('receiveSelect', this.multipleSelection, true);
                this.$emit('update:show', false);
            }
        },
        disabledCheckbox(row, index) {
            if (row.cityIds[0].checked && index !== 0) {
                return true;
            }else {
                return false;
            }
        }
    },
    watch: {
        adPositiontableData: {
            handler(val, oldVal) {
                val.forEach(row => {
                    if (row.cityIds[0].checked) {
                        row.cityIds.forEach((i, index) => {
                            if (index > 0) {
                                i.checked = false;
                            }
                        });
                    }
                });
            },
            deep: true
        },
        city(newValue) {
            if (newValue) {
                this.getAdPositionLists();
            }
        },
        show() {
            this.visible = this.show;
            if (this.visible) {
                this.getAdPositionLists();
            }
        },
        adType(newValue) {
            this.type = newValue;
        }
    },
    mixins: [publicMethod, buttonVisible]
}
</script>

<style lang="scss">
.row-citys{
    display: flex;
    flex-wrap: wrap;
    > div{
        margin: 0 12px;
    }
}
.hasSelected{
    color: #409EFF;
}
th.el-table__expand-column{
    border-right: none;
}
</style>