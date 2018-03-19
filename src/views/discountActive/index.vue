<template>
    <div class="discount-active">
        <div class="query-container" ref="queryContainer" style="height:220px;">
            <el-form :inline="true" :model="form" label-width="100px" ref="queryForm">
                <el-row>
                    <el-form-item label="活动名称:">
                        <el-input size="small" v-model="form.activeName" style="width:194px;"></el-input>
                    </el-form-item>
                    <el-form-item label="活动城市:">
                        <el-select size="small" v-model="form.activeCity" filterable clearable>
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
                    <el-form-item label="服务类型:">
                        <el-select size="small" v-model="form.serviceType" filterable clearable>
                            <el-option v-for="item in serviceTypes" :label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付类型:">
                        <el-select size="small" v-model="form.payType" filterable clearable>
                            <el-option v-for="item in payTypes" :label="item.label" :value="item.value" :key="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="优惠时间:">
                        <el-date-picker size="small" v-model="form.discountDate" type="datetime" placeholder="请选择"></el-date-picker>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button @click="clear" size="small" type="primary" icon="delete" v-if="buttonVisible['40201']"></icon>清空</el-button>
                <el-button @click="query" size="small" type="primary" icon="search" v-if="buttonVisible['40202']">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
            <el-row>
                <el-col :span="2"><el-button @click="handleActiveCreate" size="small" type="primary" icon="plus" v-if="buttonVisible['40203']">活动创建</el-button></el-col>
            </el-row>
            <el-table :data="tableData" border ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight">
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <span class="operate" @click="operate(1, scope.row)" v-if="buttonVisible['40207']">活动修改</span>
                            <span class="operate" @click="operate(2, scope.row)" v-if="buttonVisible['40208'] && scope.row.payType === '绑卡'">卡bin修改</span>
                            <div slot="reference" class="name-wrapper">
                                <span class="operate">操作</span>
                            </div>
                        </el-popover>
                  </template>
                </el-table-column>
                <el-table-column label="活动ID" prop="disctId" width="180" align="center">
                </el-table-column>
                <el-table-column label="活动名称" prop="disctName" width="160" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="城市" prop="city" width="130" align="center">
                </el-table-column>
                <el-table-column label="服务" prop="service" width="130" align="center">
                </el-table-column>
                <el-table-column label="支付类型" prop="payType" width="170">
                </el-table-column>
                <el-table-column label="条数" prop="numCardBin" width="100">
                </el-table-column>
                <el-table-column label="优先级" prop="priority" width="100">
                </el-table-column>
                <el-table-column label="活动启始时间" prop="effectTime" width="170">
                </el-table-column>
                <el-table-column label="活动结束时间" prop="expireTime" width="170">
                </el-table-column>
                <el-table-column label="归档编号" prop="docType" width="100">
                </el-table-column>
                <el-table-column label="配置备注" prop="remarks" width="100">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getCityList } from '../../api/cardManage';
import { formatLongDateToSecond } from '@/utils/index';
import {
    getQueryDiscountLists
} from '@/api/discountActive';
import butVisibleMixin from '../../utils/buttonVisible';
const PAY_TYPE = ['', '次卡', '现金', '', '', '', '', '', '绑卡'];

export default {
    name: 'discountActive',
    data() {
        return {
            pageId: '402',
            serviceTypes: [
                {
                    label: '不限',
                    value: '00'
                },
                {
                    label: '地铁',
                    value: '01'
                },
                {
                    label: '公交',
                    value: '02'
                }
            ],
            payTypes: [
                {
                    label: '次卡',
                    value: 1
                },
                {
                    label: '现金',
                    value: 2
                },
                {
                    label: '绑卡',
                    value: 8
                }
            ],
            form: {
                activeName: '',
                activeCity: '',
                serviceType: '',
                payType: '',
                discountDate: ''
            },
            tableData: [],
            loading: false,
            noTableData: '',
            totalRows: 0,
            pageSize: 20,
            currentPage: 1,
            jsonpTestData: {},
            queryContainerShrink: false,
            cityMenu: []
        };
    },
    created() {
        this.getCityMenu().then(() => {
            this.getQueryDiscountLists();
        });
    },
    methods: {
        clear() {
            for (const i in this.form) {
                this.form[i] = '';
            }
        },
        query() {
            this.getQueryDiscountLists(this.currentPage);
        },
        handleActiveCreate() {
            this.$router.push('/discountActive/activeCreate');
        },
        operate(type, row) {
            if (type === 1) {
                row.allLimit = JSON.stringify(row.allLimit);
                row.indLimit = JSON.stringify(row.indLimit);
                this.$router.push({ path: '/discountActive/activeDetailAndModify', query: row });
            } else {
                this.$router.push({ path: '/discountActive/cardBinDetailAndModify', query: row });
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getQueryDiscountLists(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getQueryDiscountLists(this.currentPage);
        },
        clearActiveCreate() {

        },
        openActiveCreate() {

        },
        submit() {

        },
        getQueryDiscountLists(page) {
            const pageNo = page || 1;
            const params = { pageNo: pageNo, pageSize: this.pageSize };
            if (this.form.activeCity) {
                params.cityId = Number(this.form.activeCity);
            }
            if (this.form.serviceType) {
                params.serviceId = this.form.serviceType;
            }
            if (this.form.activeName) {
                params.disctName = this.form.activeName;
            }
            if (this.form.payType) {
                params.payType = this.form.payType;
            }
            if (this.form.discountDate) {
                params.queryTime = formatLongDateToSecond(this.form.discountDate);
            }
            this.loading = true;
            getQueryDiscountLists({ params }).then(res => {
                if (JSON.parse(res.result).discts) {
                    this.tableData = JSON.parse(res.result).discts.filter(item => {
                        item.payType = PAY_TYPE[item.payType];
                        item.service = this.serviceTypes[Number(item.serviceId)].label;
                        this.cityMenu.forEach(province => {
                            province.children && province.children.forEach(city => {
                                if (city.code === `${item.cityId}`) {
                                    item.city = city.label;
                                }
                            });
                        });
                        return item;
                    });
                } else {
                    this.tableData = [];
                }
                this.totalRows = JSON.parse(res.result).totalCount;
                this.loading = false;
            });
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '220px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        async getCityMenu() {
            const params = { level: '2' };
            /* getCityList({ params }).then(res => {
                this.cityMenu = res.result;
            }); */
            const res = await getCityList({ params });
            this.cityMenu = res.result;
        }
    },
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 400;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        }
    },
    mixins: [butVisibleMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.discount-active{
    margin: 30px auto 0;
    width: 1120px;
}
.operate{
    color: #409EFF;
    font-size: 12px;
    cursor: pointer;
    padding: 0 6px;
}
.el-popover{
    min-width: 75px;
}
</style>
