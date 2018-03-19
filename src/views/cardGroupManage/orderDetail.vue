<template>
	<div class="order-detail">
		<div class="query-container">
			<el-form :inline="true" :model="form" label-width="100px">
				<el-row>
					<el-form-item label="手机号:">
						<el-input size="small" v-model="form.phone"></el-input>
					</el-form-item>
					<el-form-item label="状态:">
						<el-select size="small" v-model="form.status" filterable clearable>
							<el-option v-for="item in status" :label="item.caption" :value="item.value" :key="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>
			</el-form>
			<el-row type="flex" style="width:1072px;" justify="end">
				<el-col :span="3"><el-button @click="clear" size="small" type="primary" icon="delete" v-if="buttonVisible['3020112']">清空</el-button></el-col>
				<el-col :span="3"><el-button @click="query" size="small" type="primary" icon="search" v-if="buttonVisible['3020113']">查询</el-button></el-col>
				<el-col :span="2"><el-button @click="download" size="small" type="primary" v-if="buttonVisible['3020114']"><icon-svg icon-class="down" />下载</el-button></el-col>
			</el-row>
			<el-row type="flex" style="width:1072px;margin-top:20px;" justify="end">
				<el-col :span="2"><el-button @click="againGive" size="small" type="primary" v-if="buttonVisible['3020115'] && againGiveBtnShow"><icon-svg icon-class="reset" />重新发放</el-button></el-col>
			</el-row>
		</div>
		<div class="manage-container">
			<div class="order-info" style="font-size:14px;">
				<div><span style="font-weight:bold;">团购单号：</span><span>{{this.order.orderNo}}</span></div>
				<div><span style="display:inline-block;width:70px;text-align:right;font-weight:bold;">分销商：</span><span>{{this.order.distributorName}}</span></div>
				<div><span style="font-weight:bold;">订单名称：</span><span>{{this.order.orderName}}值</span></div>
				<div><span style="font-weight:bold;">充值笔数：</span><span>{{this.order.totalChargeCount}}笔</span></div>
				<div><span style="font-weight:bold;">实冲笔数：</span><span>{{this.order.factChargeCount}}笔</span></div>
			</div>
			<div class="order-info" style="margin-top:18px;font-size:14px;">
				<div><span style="display:inline-block;width:70px;text-align:right;font-weight:bold;">审核人：</span><span>{{this.order.verifyUser}}</span></div>
				<div><span style="font-weight:bold;">审核备注：</span><span>{{this.order.verifyRemark}}</span></div>
			</div>
			<el-table :data="tableData" border @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight">
				<el-table-column type="selection">
				</el-table-column>
				<el-table-column label="卡券订单号" prop="groupDetailOrderNo" width="190">
				</el-table-column>
				<el-table-column label="用户手机号" prop="userTelphone" width="130">
				</el-table-column>
				<el-table-column label="用户ID" prop="userId" width="240">
				</el-table-column>
				<el-table-column label="卡券ID" prop="cardId" width="80">
				</el-table-column>
				<el-table-column label="卡券名称" prop="cardName" width="100">
				</el-table-column>
				<el-table-column label="数量" prop="grantAmount" width="80">
				</el-table-column>
				<el-table-column label="结算金额(元)" prop="grantBalance" width="120">
				</el-table-column>
				<el-table-column label="状态" prop="statusDesc" width="80">
				</el-table-column>
				<el-table-column label="状态更新" prop="updateTime" width="180">
				</el-table-column>
				<el-table-column label="处理信息" prop="failReason" width="180">
				</el-table-column>
			</el-table>
			<div class="page-container">
				<el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
import { getOrderDetail, againGive, orderDetailDownloadUrl } from '../../api/groupOrder';
import { getToken } from '@/utils/auth';
import { getSelectList } from '../../api/userManage';
import butVisibleMixin from '../../utils/buttonVisible';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			pageId: '30201',
			form: {
				phone: '',
				status: ''
			},
			order: {},
			loading: false,
			noTableData: '',
			tableData: [],
			multipleSelection: [],
			totalRows: 0,
			pageSize: 20,
			currentPage: 1,
			status: [],
			againGiveBtnShow: false
		}
	},
	created() {
		this.getOrderDetail();
		this.getStatus();
	},
	computed: {
		...mapState({
            userInfo: state => state.user.userInfo
        }),
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 400;
            } else {
                return (this.tableData.length + 1) * 40 + 18;
            }
        }
	},
	methods: {
		getStatus() {
			getSelectList({ params: { code: '1030' } }).then(res => {
				if (res.errcode === '0000') {
					this.status = res.result;
				}
			});
		},
		getOrderDetail(page) {
			const pageNo = page || 1;
			const params = { pageNo: pageNo, pageSize: this.pageSize, groupOrderNo: this.$route.query.groupOrderNo, userTelphone: this.form.phone, status: this.form.status };
			getOrderDetail({ params }).then(res => {
				this.order = res.result.order;
				this.totalRows = res.result.orderDetail.totalCount;
				this.tableData = res.result.orderDetail.rows;
			});
		},
		clear() {
			this.form.phone = '';
			this.form.status = '';
		},
		query() {
			this.getOrderDetail();
		},
		download() {
			const params = { pageNo: this.currentPage, pageSize: this.pageSize, groupOrderNo: this.$route.query.groupOrderNo, status: this.form.status, userTelphone: this.form.phone };
			const form = $('<form>');
			form.attr({ style: 'display:none', target: '_blank', method: 'post', action: orderDetailDownloadUrl() });
			const input1 = $('<input>');
			input1.attr({ type: 'hidden', name: 'Authorization', value: getToken() });
			const input2 = $('<input>');
			input2.attr({ type: 'hidden', name: 'query', value: JSON.stringify(params) });
			$('body').append(form);
			form.append(input1);
			form.append(input2);
			form.submit();
		},
		againGive() {
			if (this.multipleSelection.length) {
				const tempArr = [];
				this.multipleSelection.forEach(i => {
					tempArr.push(i.id);
				});
				againGive({ params: tempArr }).then(res => {
					if (res.errcode === '0000') {
						this.$notify({
			                title: '成功',
			                message: '发送成功',
			                type: 'success',
			                duration: 1000
			            });
			            this.getOrderDetail();
					}
				});
			} else {
				this.$notify.warning({
		          title: '消息',
		          message: '请选择订单',
		          duration: 600
		        });
			}
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleCurrentChange(val) {
			this.currentPage = val;
			this.getOrderDetail(this.currentPage);
		},
		handleSizeChange(val) {
			this.pageSize = val;
			this.getOrderDetail(this.currentPage);
		}
	},
	mixins: [butVisibleMixin],
	watch: {
		multipleSelection(newValue) {
			if (newValue.length > 0 && newValue.every(e => {
				return e.status === '0';
			})) {
                this.againGiveBtnShow = true;
            } else {
            	this.againGiveBtnShow = false;
            }
		}
	}
};
</script>

<style lang="scss" scoped>
@import '../../styles/common.scss';
.order-detail{
	margin: 30px auto 0;
	width: 1120px;
	.manage-container{
		.order-info{
			display: flex;
			div{
				margin-right: 40px;
				&:first-child{
					width: 230px;
				}
			}

		}
	}
}
</style>
