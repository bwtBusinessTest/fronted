<template>
	<div class="retail-order">
		<div class="query-container" ref="queryContainer" style="height:225px;">
			<el-form :inline="true" :model="form" label-width="100px">
				<el-row>
					<el-form-item label="发行方:">
						<el-select size="small" v-model="form.lssuer" filterable clearable style="width:210px;">
							<el-option v-for="item in lssuers" :label="item.caption" :value="item.caption" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="订单日期:">
						<el-date-picker size="small" v-model="form.startDate" placeholder="开始日期"></el-date-picker> 至 <el-date-picker size="small" v-model="form.endDate" placeholder="结束日期"></el-date-picker>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="分销商户:">
						<el-select size="small" v-model="form.retail" filterable clearable style="width:210px;">
							<el-option v-for="item in retails" :label="item.name" :value="item.code" :key="item.code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="分销单号:">
						<el-input size="small" v-model="form.retailOrderNum" style="width:410px;"></el-input>
					</el-form-item>
				</el-row>
				<el-form-item label="手机号:">
					<el-input size="small" v-model="form.phone" style="width:210px;"></el-input>
				</el-form-item>
				<el-form-item label="商户单号:">
					<el-input size="small" v-model="form.customerOrderNum" style="width:410px;"></el-input>
				</el-form-item>
			</el-form>
			<div class="query-btn">
				<el-button @click="query" size="small" type="primary" icon="search" v-if="buttonVisible['3030303']">查询</el-button>
				<el-button @click="exportExcel" size="small" type="primary" v-if="buttonVisible['3030304']"><icon-svg icon-class="down"/>Excel导出</el-button>
			</div>
			<div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
		</div>
		<div class="manage-container">
			<el-row type="flex" style="width:1072px;margin-top:18px;" justify="start">
				<el-col :span="2"><el-button @click="returnGoods" size="small" type="primary" v-if="buttonVisible['3030306'] && returnGoodsBtnShow"><icon-svg icon-class="goods" />退货</el-button></el-col>
			</el-row>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight">
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column label="分销商订单" prop="distributorOrderNo" width="120">
				</el-table-column>
				<el-table-column label="用户手机号" prop="userTelphone" width="130">
				</el-table-column>
				<el-table-column label="分销商户" prop="distributorName" width="120">
				</el-table-column>
				<el-table-column label="商户订单号" prop="orderNo" width="170">
				</el-table-column>
				<el-table-column label="卡券名称" prop="cardName" width="100">
				</el-table-column>
				<el-table-column label="发行方" prop="publish" width="100">
				</el-table-column>
				<el-table-column label="数量" prop="cardAmount" width="100">
				</el-table-column>
				<el-table-column label="已退数量" prop="backedAmount" width="100">
				</el-table-column>
				<el-table-column label="结算金额(元)" prop="totalMoney" width="120">
				</el-table-column>
				<el-table-column label="已退金额" prop="backedMoney" width="100">
				</el-table-column>
				<el-table-column label="交易时间" prop="createTime" width="180">
				</el-table-column>
				<el-table-column label="交易状态" prop="status" width="100">
				</el-table-column>
				<el-table-column label="退货状态" width="120">
					<template slot-scope="scope">
						<span style="color: #178ce6;cursor:pointer;" @click="$router.push({path: '/cardVoucher/retailOrderManage/refundOrder', query: {distributorOrderNo:scope.row.distributorOrderNo}})">{{scope.row.backStatus}}</span>
					</template>
				</el-table-column>
				<el-table-column label="订单类型" prop="distributorOrderType" width="100">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
		<el-dialog title="退货申请" @close="handleCloseReturnGoodsDialog" @open="openReturnGoodsApplication" :visible.sync="dialogReturnGoodsVisible" :close-on-click-modal="false">
			<el-form :model="returnGoodsInfo" :rules="rules" label-width="85px" ref="returnGoods" style="width:300px;margin:auto;">
				<el-form-item label="分销商:">
					<span>{{returnGoodsInfo.distributorName}}</span>
				</el-form-item>
				<el-form-item label="订单号:">
			       <span>{{returnGoodsInfo.distributorOrderNo}}</span>
				</el-form-item>
				<el-form-item label="卡券名称:">
			       <span>{{returnGoodsInfo.cardName}}</span>
				</el-form-item>
				<el-form-item label="购买数量:">
			       <span>{{returnGoodsInfo.cardAmount}} 件</span>
				</el-form-item>
				<el-form-item label="最大可退:">
			       <span>{{`${returnGoodsInfo.maxBackedAmount} 件`}}</span>
				</el-form-item>
				<el-form-item label="退货数量:">
			       <el-input size="small" v-model="returnGoodsInfo.cardAmount" style="width:80px;" disabled></el-input>件
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogReturnGoodsVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleReturnGoods">提 交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import {
	getRetailOrders,
	getRetailOrderInfo,
	retailOrderDownloadUrl,
	returnGoodsSubmit
} from '@/api/retailOrderManage';
import { getDistributors } from '@/api/groupOrder';
import { getSelectList } from '@/api/userManage';
import { formatDate } from '@/utils';
import { getToken } from '@/utils/auth';
import butVisibleMixin from '../../utils/buttonVisible';
import { mapState } from 'vuex';
const DEAL_STATUS = ['', '新建', '兑换成功', '兑换失败'];

export default {
	data() {
		var validateNumber = (rule, value, callback) => {
			if (value <= 0) {
				callback(new Error('退货数量大于0'));
			} else {
				callback();
			}
		};
		return {
			pageId: '30303',
			form: {
				lssuer: '',
				startDate: '',
				endDate: '',
				retail: '',
				phone: '',
				retailOrderNum: '',
				customerOrderNum: ''
			},
			rules: {
				number: [{ validator: validateNumber, trigger: 'blur' }, { required: true, message: '请输入退货数量', trigger: 'blur' }]
			},
			lssuers: [],
			retails: [],
			noTableData: '',
			tableData: [],
			totalRows: 0,
			pageSize: 20,
			currentPage: 1,
			loading: false,
			dialogReturnGoodsVisible: false,
			multipleSelection: [],
			returnGoodsInfo: {
				number: ''
			},
			queryContainerShrink: false,
			returnGoodsBtnShow: false
		}
	},
	created() {
		this.getLssuers();
		this.getDistributors();
		this.getRetailOrders();
	},
	methods: {
		getLssuers() {
			getSelectList({ params: { code: '1036' } }).then(res => {
				if (res.errcode === '0000') {
					this.lssuers = res.result;
				}
			});
		},
		getDistributors() {
			getDistributors({}).then(res => {
				if (res.errcode === '0000') {
					this.retails = res.result;
				}
			});
		},
		getRetailOrders(page) {
			const pageNo = page || 1;
			let ed;
			let sd;
			if (this.form.startDate) {
				sd = formatDate(this.form.startDate);
			} else {
				sd = '';
			}
			if (this.form.endDate) {
				ed = formatDate(this.form.endDate);
			} else {
				ed = '';
			}
			const params = { pageNo: pageNo, pageSize: this.pageSize, publish: this.form.lssuer, distributorInfoCode: this.form.retail, beginDate: sd, endDate: ed, distributorOrderNo: this.form.retailOrderNum, userTelphone: this.form.phone, orderNo: this.form.customerOrderNum };
			getRetailOrders({ params }).then(res => {
				if (res.errcode === '0000') {
					this.totalRows = res.result.totalCount;
					this.tableData = res.result.rows.filter(item => {
						item.status = DEAL_STATUS[item.status];
						item.distributorOrderType = item.distributorOrderType === '1' ? '团购' : '外部';
						return item;
					});
				}
			});
		},
		query() {
			this.getRetailOrders(this.currentPage);
		},
		exportExcel() {
			let ed;
			let sd;
			if (this.form.startDate) {
				sd = formatDate(this.form.startDate);
			} else {
				sd = '';
			}
			if (this.form.endDate) {
				ed = formatDate(this.form.endDate);
			} else {
				ed = '';
			}
			const params = { pageNo: this.currentPage, pageSize: this.pageSize, publish: this.form.lssuer, distributorInfoCode: this.form.retail, beginDate: sd, endDate: ed, distributorOrderNo: this.form.retailOrderNum, userTelphone: this.form.phone, orderNo: this.form.customerOrderNum };
			const form = $('<form>');
            form.attr({ style: 'display:none', target: '_blank', method: 'post', action: retailOrderDownloadUrl() });
            const input1 = $('<input>');
            input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
            const input2 = $('<input>');
            input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
            $('body').append(form);
            form.append(input1);
            form.append(input2);
            form.submit();
		},
		returnGoods() {
			if (this.multipleSelection.length === 1) {
				getRetailOrderInfo({ params: { id: this.multipleSelection[0].id }}).then(res => {
					if (res.errcode === '0000') {
						Object.assign(this.returnGoodsInfo, res.result);
						window.scrollTo(0, 0);
						this.dialogReturnGoodsVisible = true;
					}
				});
			} else {
				this.$notify.warning({
		          title: '消息',
		          message: this.multipleSelection.length === 0 ? '请选择一条用户查看' : '只能选择一条用户查看',
		          duration: 600
		        });
			}
		},
		handleReturnGoods() {
			this.$refs.returnGoods.validate((valid) => {
				if (valid) {
					returnGoodsSubmit({ params: { orderId: this.returnGoodsInfo.id, backAmount: this.returnGoodsInfo.cardAmount }}).then(res => {
						if (res.errcode === '0000') {
							this.$notify({
		                        title: '成功',
		                        message: '退货成功',
		                        type: 'success',
		                        duration: 1000
		                    });
		                    this.dialogReturnGoodsVisible = false;
		                    this.getRetailOrders();
						}
					});
				}
			});
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getRetailOrders(this.currentPage);
		},
		handleSizeChange(val) {
			this.pageSize = val;
			this.getRetailOrders(this.currentPage);
		},
		handleCloseReturnGoodsDialog() {
			this.$refs.returnGoods.resetFields();
		},
		shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '225px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
        openReturnGoodsApplication() {
        	if (!this.isCollapse) {
                this.$nextTick(() => {
                    document.querySelector('.v-modal').style.left = '36px';
                });
            }
        }
	},
	mixins: [butVisibleMixin],
	computed: {
		tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        },
        ...mapState({
            isCollapse: state => state.app.sidebar.opened
        })
	},
	watch: {
		multipleSelection(newValue) {
			if (newValue.length > 0 && newValue.every((e) => {
                return e.backCardOrder.status === '3' || e.backCardOrder.status === '5' || e.backCardOrder.status === null;
            })) {
				this.returnGoodsBtnShow = true;
			} else {
				this.returnGoodsBtnShow = false;
			}
		},
		isCollapse(newValue) {
            if (document.querySelector('.v-modal')) {
                if (newValue) {
                    document.querySelector('.v-modal').style.left = '200px';
                } else {
                    document.querySelector('.v-modal').style.left = '36px';
                }
            }
        }
	}
}
</script>

<style lang="scss">
@import '../../styles/common.scss';
.retail-order{
	margin: 30px auto 0;
	width: 1120px;
	.el-dialog__wrapper{
		top: 50px;
		left: 200px;
	}
}
</style>