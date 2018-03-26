<template>
    <div class="material-select">
        <el-dialog title="物料选择" @close="clearMeterialChoose" :visible.sync="visible" :close-on-click-modal="false" class="customer-width" @open="openNewAddModal">
            <div style="display:flex;justify-content: space-between;">
                <div>
                    <span>物料名称:</span><el-input size="small" v-model="materialName" style="width:195px;"></el-input>
                    <span>归属:</span>
                    <el-select size="small" v-model="belong" :key="1" disabled filterable clearable>
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
                </div>
                <div>
                    <el-button size="small" type="primary" v-if="buttonVisible['5020320']" @click="getAdMaterialList(1)">筛选</el-button>
                    <el-button size="small" type="primary" @click="$emit('update:show', false)">返回</el-button>
                </div>
            </div>
            <div>
                <el-table :data="materialChoosetableData" border height="500" :row-class-name="handleRowClassName" @cell-click="handleTableImgClick">
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                          v-if="!scope.row.choose"
                          :disabled="!buttonVisible['5020321']"
                          size="mini"
                          type="primary"
                          @click="handleMaterialChoose(scope.$index, scope.row)">选择</el-button>
                        <span v-else>已选择</span>
                    </template>
                </el-table-column>
                <el-table-column label="物料ID" prop="id"  align="center">
                </el-table-column>
                <el-table-column label="物料名称" prop="materielName" >
                </el-table-column>
                <el-table-column label="图片" prop="picture" align="center">
                    <template slot-scope="scope">
                        <img :src="scope.row.imgUrl" style="width:100%;height:auto;">
                    </template>
                </el-table-column>
                <el-table-column label="物料尺寸" prop="materialSize">
                </el-table-column>
                <el-table-column label="归属" prop="cityName">
                </el-table-column>
                <el-table-column label="备注信息" prop="remark">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next" :total="totalRows" :page-size="pageSize" :page-sizes="[20,50,100]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getCityListByUser } from '@/api/adPublish';
import { getAdMaterial } from '@/api/adPublish';
import publicMethod from '@/utils/publicMethod';
import buttonVisible from '@/utils/buttonVisible';

export default {
    name: 'materialSelect',
    data() {
        return {
            pageId: '50203',
            visible: this.show,
            materialName: '',
            belong: '',
            cityMenu: [],
            materialChoosetableData: [],
            totalRows: 0,
            currentPage: 1,
            pageSize: 20,
            showImgUrl: '',
            testUrl: 'http://cangdu.org:8001/img/16018a5c08533.jpeg'
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    created() {
        this.getCityList();
        // this.getAdMaterialList();
    },
    methods: {
        clearMeterialChoose() {
            this.materialChoosetableData.forEach(e => {
                e.choose = false;
            });
            this.$emit('update:show', false);
        },
        handleRowClassName({ row, rowIndex }) {
            if (row.choose) {
                return 'choose';
            }
        },
        handleTableImgClick(row, column, cell, event) {
            if (column.label === '图片') {
                this.showImgUrl = row.imgUrl;
                this.$emit('showPic', this.showImgUrl);
            }
        },
        handleMaterialChoose(index, row) {
            this.materialChoosetableData.forEach(el => {
                el.choose = false;
            });
            row.choose = true;
            this.$emit('receiveMaterialData', row);
            this.$emit('update:show', false);
        },
        getCityList() {
            const params = { level: '2' };
            getCityListByUser({ params }).then(res => {
                this.cityMenu = res.result;
                if (this.cityMenu.length > 1) {
                    this.belong = '0';
                } else {
                    this.belong = res.result[0].children[0].code;
                }
            });
        },
        getAdMaterialList(page) {
            const pageNo = page || 1;
            const params = { pageNo: pageNo, pageSize: this.pageSize, materielName: this.materialName, cityId: this.belong, status: '1' }
            getAdMaterial({ params }).then(res => {
                this.materialChoosetableData = res.result.rows.filter(row => {
                    row.materialSize = row.resourceWidth + '*' + row.resourceHeight;
                    row.imgUrl = row.resourcePath;
                    row.choose = false;
                    return row;
                });
                this.totalRows = res.result.totalCount;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdMaterialList(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAdMaterialList(this.currentPage);
        },
    },
    watch: {
        show() {
            this.visible = this.show;
            if (this.visible) {
                this.getAdMaterialList();
            }
        },
        belong(newValue) {
            if (newValue) {
                this.getAdMaterialList();
            }
        }
    },
    mixins: [publicMethod, buttonVisible]
}
</script>

<style lang="scss" scoped>
    
</style>