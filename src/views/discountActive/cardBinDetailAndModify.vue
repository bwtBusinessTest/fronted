<template>
    <div class="card-bin-detail-and-modify">
        <div class="manage-container">
            <div class="item">
                <el-form :model="form1" :inline="true" label-width="88px">
                    <el-row>
                        <el-form-item label="活动名称:"><span style="color:#48576a;">{{form1.activeName}}</span></el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="支付方式:"><span style="width:300px;display:inline-block;color:#48576a;">{{form1.payType}}</span></el-form-item>
                        <el-form-item label="活动ID:"><span style="color:#48576a;">{{form1.activeId}}</span></el-form-item>
                    </el-row>
                </el-form>
            </div>
            <div class="item">
                <div class="table-container">
                    <div class="left">
                        <p style="font-size:14px;color:#48576a">查询卡bin输入：<el-button @click="handleQueryCardBin" size="mini" type="primary" style="width:50px;margin-left:40px;">查询》</el-button></p>
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入内容" v-model="queryCardBin" style="width:200px;"></el-input>
                        <p style="font-size:14px;color:#48576a">新增卡bin输入：<el-button size="mini" type="primary" @click="handleAddCardBin" style="width:50px;margin-left:40px;">添加》</el-button></p>
                        <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请输入内容" v-model="addCardBin" style="width:200px;" @input="validateInputCardBin($event)"></el-input>
                    </div>
                    <div class="right">
                        <div style="font-size:14px;color:#48576a;display:flex;justify-content:space-between;padding-top: 14px;">
                            <div>
                                <span class="filterBtn" @click="filterAll">全部({{allCount}}) </span><span class="filterBtn" @click="filterNewAdd">新增({{newAddNum}}) </span><span class="filterBtn" @click="filterDelete">删除({{deleteNum}})</span>
                            </div>
                            <div>
                                <el-button size="mini" type="primary" @click="copyCardBin" style="width:50px;">复制</el-button>
                                <el-button size="mini" type="primary" @click="deleteCardBin" style="width:50px;">删除</el-button>
                                <el-button size="mini" type="primary" @click="cancelDeleteCardBin" style="width:50px;margin-left:10px;">撤删</el-button>
                            </div>
                        </div>
                        <el-table :data="filteredTableData" border ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight" :row-style="deleteCallback">
                            <el-table-column type="selection">
                            </el-table-column>
                            <el-table-column label="卡bin" prop="cardBin" align="center" width="220">
                                <template slot-scope="scope">
                                    <span style="text-decoration:line-through;color:#d9d9d9;" v-if="scope.row.status===2">{{scope.row.cardBin}}</span>
                                    <span v-else>{{scope.row.cardBin}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="状态" prop="cardBin" align="center">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.status === 1 ? '新增' : scope.row.status === 2? '删除' : ''}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!--<div class="page-container">
                            <el-pagination layout="total, prev, pager, next" :total="totalRows" :page-size="pageSize" @current-change="handleCurrentChange"></el-pagination>
                        </div>-->
                    </div>
                </div>
            </div>
            <div class="footer-btn">
                <el-button type="primary" @click="submit" v-if="buttonVisible['40213']">提交修改</el-button>
                <el-button @click="cancel" v-if="buttonVisible['40214']">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import butVisibleMixin from '../../utils/buttonVisible';
import {
    addCardBinApi,
    deleteCardBinApi,
    queryDisctCard
} from '@/api/discountActive';

export default {
    name: 'cardBinDetailAndModify',
    data() {
        return {
            pageId: '402',
            form1: {
                activeName: this.$route.query.disctName,
                payType: this.$route.query.payType,
                activeId: this.$route.query.disctId
            },
            queryCardBin: '',
            addCardBin: '',
            tableData: [],
            filteredTableData: [],
            noTableData: '',
            loading: false,
            tableHeight: 318,
            totalRows: 0,
            oldRows: 0,
            pageSize: 100,
            currentPage: 1,
            multipleSelection: [],
            newAddCardBin: [],
            permitAdd: true
        };
    },
    created() {
        this.getCardBinLists();
    },
    computed: {
        newAddNum() {
            return this.tableData.filter(item => {
                return item.status === 1;
            }).length;
        },
        deleteNum() {
            return this.tableData.filter(item => {
                return item.status === 2;
            }).length;
        },
        allCount() {
            return this.tableData.length;
        }
    },
    methods: {
        async submit() {
            const addObj = { disctId: this.$route.query.disctId, cardNo: [] };
            const deleteObj = { disctId: this.$route.query.disctId, cardNo: [] };
            this.tableData.forEach(i => {
                if (i.status === 1) {
                    addObj.cardNo.push(i.cardBin);
                }
                if (i.status === 2) {
                    deleteObj.cardNo.push(i.cardBin);
                }
            });
            if (addObj.cardNo.length > 0) {
                /* addCardBinApi({ addParams }).then(res => {
                    if (JSON.parse(res.result).result === 1) {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getCardBinLists();
                    }
                }); */
                for (let i = 0; i < Math.ceil(addObj.cardNo.length / 100); i++) {
                    const addParams = { disctId: addObj.disctId, cardNo: addObj.cardNo.slice(i * 100, i * 100 + 100) };
                    const r = await addCardBinApi({ addParams });
                    if (JSON.parse(r.result).result === 1) {
                        this.$notify({
                            title: '成功',
                            message: '添加成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({ path: '/discountActive/index', query: { city: this.$route.query.city, service: this.$route.query.service }});
                    }
                }
            }
            if (deleteObj.cardNo.length > 0) {
                /* deleteCardBinApi({ deleteParams }).then(res => {
                    if (JSON.parse(res.result).result === 1) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.getCardBinLists();
                    }
                }); */
                for (let i = 0; i < Math.ceil(deleteObj.cardNo.length / 100); i++) {
                    const deleteParams = { disctId: deleteObj.disctId, cardNo: deleteObj.cardNo.slice(i * 100, i * 100 + 100) };
                    const r1 = await deleteCardBinApi({ deleteParams });
                    if (JSON.parse(r1.result).result === 1) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success',
                            duration: 1000
                        });
                        this.$router.push({ path: '/discountActive/index', query: { city: this.$route.query.city, service: this.$route.query.service }});
                    }
                }
            }
            this.getCardBinLists();
        },
        async getCardBinLists(page) {
            var pageNo = page || 1;
            const params = { disctId: this.$route.query.disctId, pageNo: pageNo, pageSize: this.pageSize };
            this.tableData = [];
            /* queryDisctCard({ params }).then(res => {
                if (JSON.parse(res.result).totalCount > 0) {
                    JSON.parse(res.result).cardNo.forEach(el => {
                        this.tableData.push({ cardBin: el, old: true });
                    });
                    this.oldRows = JSON.parse(res.result).totalCount;
                    this.totalRows = this.oldRows + this.newAddCardBin.length;
                }
                this.filteredTableData = this.tableData;
            }); */
            let r = await queryDisctCard({ params });
            this.totalRows = JSON.parse(r.result).totalCount;
            JSON.parse(r.result).cardNo.forEach(el => {
                this.tableData.push({ cardBin: el, old: true });
            });
            for (let i = 1; i < Math.ceil(this.totalRows / 100); i++) {
                params.pageNo++;
                r = await queryDisctCard({ params });
                JSON.parse(r.result).cardNo.forEach(el => {
                    this.tableData.push({ cardBin: el, old: true });
                });
            }
            this.filteredTableData = this.tableData;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleQueryCardBin() {
            if (this.queryCardBin) {
                this.filteredTableData = this.tableData.filter((row) => {
                    return this.queryCardBin.split('\n').some((i) => {
                        return i === row.cardBin;
                    });
                });
            } else {
                this.filteredTableData = this.tableData;
            }
        },
        validateInputCardBin(val) {
            // val.split('\n').forEach(i => {
            //     if (i) {
            //         if (!/^[0-9]*$/.test(i)) {
            //             this.$notify.warning({
            //                 title: '消息',
            //                 message: '只能输入数字',
            //                 duration: 600
            //             });
            //             this.permitAdd = false;
            //         } else {
            //             this.permitAdd = true;
            //         }
            //     }
            // });
            if (val.split('\n').every(i => {
                return /^[0-9]*$/.test(i);
            })) {
                this.permitAdd = true;
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '只能输入数字',
                    duration: 600
                });
                this.permitAdd = false;
            }
        },
        handleAddCardBin() {
            if (this.permitAdd) {
                this.addCardBin.split('\n').forEach(i => {
                    if (i) {
                        if (!this.tableData.some(e => {
                            return e.cardBin === i;
                        })) {
                            this.tableData.push({ cardBin: i, status: 1 });
                            this.newAddCardBin.push({ cardBin: i, status: 1 });
                        }
                    }
                });
                this.totalRows += this.newAddCardBin.length;
                this.addCardBin = '';
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '只能输入数字',
                    duration: 600
                });
            }
        },
        deleteCardBin() {
            if (this.multipleSelection.length) {
                this.multipleSelection.forEach(i => {
                    if (i.old) {
                        this.$set(i, 'status', 2);
                    } else {
                        this.tableData.splice(this.tableData.indexOf(i), 1);
                    }
                });
                this.$refs.multipleTable.clearSelection();
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择要删除的卡bin',
                    duration: 600
                });
            }
        },
        cancelDeleteCardBin() {
            if (this.multipleSelection.length) {
                this.multipleSelection.forEach(i => {
                    if (i.old) {
                        // delete i.status;
                        i.status = null;
                    } else {
                        i.status = 1;
                    }
                });
                this.$refs.multipleTable.clearSelection();
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择要撤删的卡bin',
                    duration: 600
                });
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getCardBinLists(this.currentPage);
        },
        deleteCallback(row, index) {
            if (row.status === 2) {
                // return { color: '#d9d9d9', 'text-decoration': 'line-through' };
                return {};
            }
        },
        cancel() {
            this.$router.push({ path: '/discountActive/index', query: { city: this.$route.query.city, service: this.$route.query.service }});
        },
        filterAll() {
            this.filteredTableData = this.tableData;
        },
        filterNewAdd() {
            this.filteredTableData = this.tableData.filter(i => {
                return i.status === 1;
            });
        },
        filterDelete() {
            this.filteredTableData = this.tableData.filter(i => {
                return i.status === 2;
            });
        },
        copyCardBin() {
            var _this = this;
            var str = '';
            this.tableData.forEach(el => {
                str += `${el.cardBin}`;
                if (el.status) {
                    str += `(${el.status === 1 ? '新增' : '删除'})`;
                }
                str += '\n';
            });
            this.$copyText(str).then(function(e) {
                _this.$notify({
                    title: '成功',
                    message: '复制成功',
                    type: 'success',
                    duration: 1000
                });
            }, function(e) {
                _this.$notify({
                    title: '失败',
                    message: '复制成功',
                    type: 'success',
                    duration: 1000
                });
            });
        }
    },
    mixins: [butVisibleMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.card-bin-detail-and-modify{
    margin: 30px auto;
    width: 1120px;
    .manage-container{
        .item{
            border-bottom: 1px solid #ccc;
            .table-container{
                display: flex;
                justify-content: space-between;
                width: 580px;
                padding: 10px 0;
                .left{
                    border-right: 1px solid #ccc;
                    padding-right: 13px;
                }
                .right{
                    width: 352px;
                    .filterBtn{
                        cursor: pointer;
                        color: #178ce6;
                    }
                }
            }
        }
        .footer-btn{
            width: 500px;
            text-align: center;
            margin-top: 20px;
        }
    }
}   
</style>
