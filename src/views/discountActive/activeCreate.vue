<template>
    <div class="active-create">
        <div class="manage-container">
            <el-form :model="activeCreate" label-width="88px" ref="activeCreate" :rules="activeCreateRules">
                <el-form-item label="活动名称:" prop="activeName">
                    <el-input size="small" v-model="activeCreate.activeName" style="width:194px;"></el-input>
                </el-form-item>
                <el-form-item label="服务类型:" prop="serviceType">
                    <el-radio-group v-model="activeCreate.serviceType">
                        <el-radio label="00">不限</el-radio>
                        <el-radio label="01">地铁</el-radio>
                        <el-radio label="02">公交</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动城市:" prop="activeCity">
                    <el-select size="small" v-model="activeCreate.activeCity" filterable clearable>
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
                <el-form-item label="起始时间:">
                    <el-date-picker size="small" v-model="activeCreate.startDate" type="datetime" placeholder="起始时间" :default-value="new Date(defaultStartDate)"></el-date-picker><span style="color:#ccc;margin-left:5px;">注：留空为不限时</span>
                </el-form-item>
                <el-form-item label="结束时间:" prop="endDate">
                    <el-date-picker size="small" v-model="activeCreate.endDate" type="datetime" placeholder="结束时间" :default-value="new Date(defaultEndDate)"></el-date-picker><span style="color:#ccc;margin-left:5px;">注：留空为不限时</span>
                </el-form-item>
                <el-form-item label="优惠期:" prop="discountDate">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="activeCreate.discountDate" @change="handleCheckedCitiesChange">
                        <el-checkbox label="周一"></el-checkbox>
                        <el-checkbox label="周二"></el-checkbox>
                        <el-checkbox label="周三"></el-checkbox>
                        <el-checkbox label="周四"></el-checkbox>
                        <el-checkbox label="周五"></el-checkbox>
                        <el-checkbox label="周六"></el-checkbox>
                        <el-checkbox label="周日"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="优先级值:" prop="importantVal">
                    <el-input size="small" v-model.number="activeCreate.importantVal" style="width:194px;"></el-input><span style="color:#ccc;margin-left:5px;">注：2位以内数值</span>
                </el-form-item>
                <el-form-item label="归档编号:" prop="sortNum">
                    <el-input size="small" v-model.number="activeCreate.sortNum" style="width:194px;"></el-input><span style="color:#ccc;margin-left:5px;">注：5位以内数值</span>
                </el-form-item>
                <el-form-item label="支付方式:" prop="payType">
                    <el-radio-group v-model.number="activeCreate.payType">
                        <el-radio :label="2">余额</el-radio>
                        <el-radio :label="8">绑卡</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="优惠规则:" prop="discountRules">
                    <el-radio-group v-model.number="activeCreate.discountRules" style="padding-top:4px;">
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="1">一口价优惠</el-radio><el-input v-model.number="activeCreate.onceDiscount" size="small" :disabled="activeCreate.discountRules &&  activeCreate.discountRules !== 1" style="width:90px;margin-left:56px;">
                                <template slot="append">元</template>
                            </el-input>
                        </el-row>
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="3">标准优惠票价上折扣</el-radio><el-input v-model="activeCreate.standardDiscount" size="small" :disabled="activeCreate.discountRules && activeCreate.discountRules !== 3" style="width:90px;">
                                <template slot="append">折</template>
                            </el-input>
                        </el-row>
                        <el-row>
                            <el-radio :label="13">原票价上折扣</el-radio><el-input v-model="activeCreate.originDiscount" size="small" :disabled="activeCreate.discountRules && activeCreate.discountRules !== 13" style="width:90px;margin-left:42px;">
                                <template slot="append">折</template>
                            </el-input>
                        </el-row>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="总量限制:">
                    <el-row>
                        <el-checkbox v-model="activeCreate.totalLimit">设置限制</el-checkbox>
                    </el-row>
                    <el-radio-group v-model="activeCreate.totalSetLimit" v-if="activeCreate.totalLimit">
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="0">总限额:</el-radio>
                            <el-input v-model.number="activeCreate.TLTotalLimitMoney" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 0" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.TLTotalLimitNum" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 0" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="3">月限额:</el-radio>
                            <el-input v-model.number="activeCreate.TLMonthLimitMoney" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 3" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.TLMonthLimitNum" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 3" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="2">周限额:</el-radio>
                            <el-input v-model.number="activeCreate.TLWeekLimitMoney" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 2" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.TLWeekLimitNum" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 2" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row>
                            <el-radio :label="1">日限额:</el-radio>
                            <el-input v-model.number="activeCreate.TLDayLimitMoney" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 1" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.TLDayLimitNum" size="small" :disabled="activeCreate.totalSetLimit !== undefined && activeCreate.totalSetLimit !== 1" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                    </el-radio-group>
                    <el-row v-if="activeCreate.totalLimit">
                        <span style="color:#ccc;margin-left:5px;">注：可设置1条规则，限额和限次可同时设置，0为不限</span>
                    </el-row>
                </el-form-item>
                <el-form-item label="个体限制:">
                    <el-row>
                        <el-checkbox v-model="activeCreate.personLimit">设置限制</el-checkbox>
                    </el-row>
                    <el-radio-group v-model="activeCreate.personSetLimit" v-if="activeCreate.personLimit">
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="0">总限额:</el-radio>
                            <el-input v-model.number="activeCreate.PLTotalLimitMoney" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 0" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.PLTotalLimitNum" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 0" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="3">月限额:</el-radio>
                            <el-input v-model.number="activeCreate.PLMonthLimitMoney" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 3" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.PLMonthLimitNum" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 3" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row style="margin-bottom:8px;">
                            <el-radio :label="2">周限额:</el-radio>
                            <el-input v-model.number="activeCreate.PLWeekLimitMoney" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 2" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.PLWeekLimitNum" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 2" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                        <el-row>
                            <el-radio :label="1">日限额:</el-radio>
                            <el-input v-model.number="activeCreate.PLDayLimitMoney" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 1" style="width:100px;margin-left:10px;">
                                <template slot="append">元</template>
                            </el-input>
                            <el-input v-model.number="activeCreate.PLDayLimitNum" size="small" :disabled="activeCreate.personSetLimit !== undefined && activeCreate.personSetLimit !== 1" style="width:150px;margin-left:10px;">
                                <template slot="prepend">限次:</template>
                                <template slot="append">次</template>
                            </el-input>
                        </el-row>
                    </el-radio-group>
                    <el-row v-if="activeCreate.personLimit">
                        <span style="color:#ccc;margin-left:5px;">注：可设置1条规则，限额和限次可同时设置，0为不限</span>
                    </el-row>
                </el-form-item>
                <el-form-item label="配置备注:">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入内容" v-model="activeCreate.configRemark" style="width:354px;"></el-input>
                </el-form-item>
            </el-form>
            <div class="footer-btn">
                <el-button type="primary" @click="submit" v-if="buttonVisible['40209']">提交</el-button>
                <el-button @click="cancel" v-if="buttonVisible['40210']">取消</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { getCityList } from '../../api/cardManage';
import { formatLongDateToSecond } from '@/utils/index';
import {
    addActive
} from '@/api/discountActive';
import butVisibleMixin from '../../utils/buttonVisible';
const WeekOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default {
    name: 'activeCreate',
    data() {
        var totalSetLimitRules = (rule, value, callback) => {
            if (this.activeCreate.totalLimit) {
                if (this.activeCreate.totalSetLimit === undefined) {
                    callback(new Error('请选择限额'));
                } else {
                    switch (this.activeCreate.totalSetLimit) {
                        case 0:
                            if (this.activeCreate.TLTotalLimitMoney === undefined || this.activeCreate.TLTotalLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 1:
                            if (this.activeCreate.TLDayLimitMoney === undefined || this.activeCreate.TLDayLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 2:
                            if (this.activeCreate.TLWeekLimitMoney === undefined || this.activeCreate.TLWeekLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 3:
                            if (this.activeCreate.PLMonthLimitMoney === undefined || this.activeCreate.TLMonthLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                    }
                }
            } else {
                callback();
            }
        };
        var personSetLimitRules = (rule, value, callback) => {
            if (this.activeCreate.personLimit) {
                if (this.activeCreate.personSetLimit === undefined) {
                    callback(new Error('请选择限额'));
                } else {
                    switch (this.activeCreate.personSetLimit) {
                        case 0:
                            if (this.activeCreate.PLTotalLimitMoney === undefined || this.activeCreate.PLTotalLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 1:
                            if (this.activeCreate.PLDayLimitMoney === undefined || this.activeCreate.PLDayLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 2:
                            if (this.activeCreate.PLWeekLimitMoney === undefined || this.activeCreate.PLWeekLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                        case 3:
                            if (this.activeCreate.PLMonthLimitMoney === undefined || this.activeCreate.PLMonthLimitNum === undefined) {
                                callback(new Error('请填写限额或限次'));
                            } else {
                                callback();
                            }
                            break;
                    }
                }
            } else {
                callback();
            }
        };
        var discountRulesRules = (rule, value, callback) => {
            if (this.activeCreate.discountRules === undefined) {
                callback(new Error('请选择优惠规则'));
            } else if (this.activeCreate.discountRules === 1) {
                if (this.activeCreate.onceDiscount === undefined) {
                    callback(new Error('请填写优惠'));
                } else {
                    callback();
                }
            } else if (this.activeCreate.discountRules === 3) {
                if (this.activeCreate.standardDiscount === undefined) {
                    callback(new Error('请填写折扣'));
                } else {
                    callback();
                }
            } else if (this.activeCreate.discountRules === 13) {
                if (this.activeCreate.originDiscount === undefined) {
                    callback(new Error('请填写折扣'));
                } else {
                    callback();
                }
            }
        };
        var endDateValide = (rule, value, callback) => {
            if (this.activeCreate.startDate && this.activeCreate.endDate) {
                if (new Date(this.activeCreate.startDate) >= new Date(this.activeCreate.endDate)) {
                    callback(new Error('结束时间应大于起始时间'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            pageId: '402',
            activeCreate: {
                activeName: '',
                serviceType: '',
                activeCity: '',
                startDate: '',
                endDate: '',
                discountDate: [],
                importantVal: undefined,
                sortNum: undefined,
                payType: undefined,
                discountRules: undefined,
                onceDiscount: undefined,
                standardDiscount: undefined,
                originDiscount: undefined,
                totalLimit: '',
                personLimit: '',
                totalSetLimit: undefined,
                personSetLimit: undefined,
                configRemark: '',
                TLTotalLimitMoney: undefined,
                TLTotalLimitNum: undefined,
                TLMonthLimitMoney: undefined,
                TLMonthLimitNum: undefined,
                TLWeekLimitMoney: undefined,
                TLWeekLimitNum: undefined,
                TLDayLimitMoney: undefined,
                TLDayLimitNum: undefined,
                PLTotalLimitMoney: undefined,
                PLTotalLimitNum: undefined,
                PLMonthLimitMoney: undefined,
                PLMonthLimitNum: undefined,
                PLWeekLimitMoney: undefined,
                PLWeekLimitNum: undefined,
                PLDayLimitMoney: undefined,
                PLDayLimitNum: undefined
            },
            activeCreateRules: {
                activeName: [{ required: true, message: '请填写活动名称', trigger: 'blur' }],
                serviceType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
                activeCity: [{ required: true, message: '请选择活动城市', trigger: 'change' }],
                startDate: [{ type: 'date', required: true, message: '请选择起始时间', trigger: 'change' }],
                endDate: [{ type: 'date', validator: endDateValide, trigger: 'change' }],
                discountDate: [{ type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }],
                importantVal: [{ type: 'number', required: true, message: '请填写优先级值', trigger: 'blur' }, { type: 'number', max: 99, min: 0, message: '2位以内数字', trigger: 'blur' }],
                sortNum: [{ type: 'number', max: 99999, message: '5位以内数字', trigger: 'blur' }],
                payType: [{ type: 'number', required: true, message: '请选择支付方式', trigger: 'change' }],
                bankBin: [{ required: true, message: '请填写银行卡bin', trigger: 'blur' }],
                discountRules: [{ validator: discountRulesRules, required: true, trigger: 'change, blur' }],
                totalSetLimit: [{ validator: totalSetLimitRules, required: true, trigger: 'change, blur' }],
                personSetLimit: [{ validator: personSetLimitRules, required: true, trigger: 'change' }]
            },
            cityMenu: [],
            checkAll: false,
            isIndeterminate: false,
            weeks: WeekOptions,
            defaultStartDate: `${new Date().getMonth() + 1} ${new Date().getDate()},${new Date().getFullYear()} 00:00:00`,
            defaultEndDate: `${new Date().getMonth() + 1} ${new Date().getDate()},${new Date().getFullYear()} 23:59:59`
        };
    },
    created() {
        this.getCityMenu();
    },
    methods: {
        getCityMenu() {
            const params = { level: '2' };
            getCityList({ params }).then(res => {
                this.cityMenu = res.result;
            });
        },
        submit() {
            this.$refs.activeCreate.validate((valid) => {
                if (valid) {
                    const params = { disctName: this.activeCreate.activeName, serviceId: this.activeCreate.serviceType, cityId: Number(this.activeCreate.activeCity), effectTime: formatLongDateToSecond(this.activeCreate.startDate), expireTime: formatLongDateToSecond(this.activeCreate.endDate), priority: this.activeCreate.importantVal, docType: this.activeCreate.sortNum, payType: this.activeCreate.payType, disctType: this.activeCreate.discountRules, remarks: this.activeCreate.configRemark };
                    const tempWeek = [0, 0, 0, 0, 0, 0, 0];
                    this.activeCreate.discountDate.forEach(i => {
                        switch (i) {
                            case '周一':
                                tempWeek[0] = 1;
                                break;
                            case '周二':
                                tempWeek[1] = 1;
                                break;
                            case '周三':
                                tempWeek[2] = 1;
                                break;
                            case '周四':
                                tempWeek[3] = 1;
                                break;
                            case '周五':
                                tempWeek[4] = 1;
                                break;
                            case '周六':
                                tempWeek[5] = 1;
                                break;
                            case '周日':
                                tempWeek[6] = 1;
                                break;
                        }
                    });
                    params.weekSet = tempWeek.join('');
                    if (this.activeCreate.discountRules === 1) {
                        params.disctValue = this.activeCreate.onceDiscount * 100;
                    } else if (this.activeCreate.discountRules === 3) {
                        params.disctValue = (10 - this.activeCreate.standardDiscount) * 1000;
                    } else if (this.activeCreate.discountRules === 13) {
                        params.disctValue = (10 - this.activeCreate.originDiscount) * 1000;
                    }
                    if (this.activeCreate.totalLimit) {
                        params.allLimit = { mode: 3, cycle: this.activeCreate.totalSetLimit };
                        if (this.activeCreate.totalSetLimit === 0) {
                            params.allLimit.times = this.activeCreate.TLTotalLimitNum;
                            params.allLimit.balance = this.activeCreate.TLTotalLimitMoney * 100;
                        } else if (this.activeCreate.totalSetLimit === 1) {
                            params.allLimit.times = this.activeCreate.TLDayLimitNum;
                            params.allLimit.balance = this.activeCreate.TLDayLimitMoney * 100;
                        } else if (this.activeCreate.totalSetLimit === 2) {
                            params.allLimit.times = this.activeCreate.TLWeekLimitNum;
                            params.allLimit.balance = this.activeCreate.TLWeekLimitMoney * 100;
                        } else if (this.activeCreate.totalSetLimit === 3) {
                            params.allLimit.times = this.activeCreate.TLMonthLimitNum;
                            params.allLimit.balance = this.activeCreate.TLMonthLimitMoney * 100;
                        }
                    }
                    if (this.activeCreate.personLimit) {
                        params.indLimit = { mode: 3, cycle: this.activeCreate.personSetLimit };
                        if (this.activeCreate.personSetLimit === 0) {
                            params.indLimit.times = this.activeCreate.PLTotalLimitNum;
                            params.indLimit.balance = this.activeCreate.PLTotalLimitMoney * 100;
                        } else if (this.activeCreate.personSetLimit === 1) {
                            params.indLimit.times = this.activeCreate.PLDayLimitNum;
                            params.indLimit.balance = this.activeCreate.PLDayLimitMoney * 100;
                        } else if (this.activeCreate.personSetLimit === 2) {
                            params.indLimit.times = this.activeCreate.PLWeekLimitNum;
                            params.indLimit.balance = this.activeCreate.PLWeekLimitMoney * 100;
                        } else if (this.activeCreate.personSetLimit === 3) {
                            params.indLimit.times = this.activeCreate.PLMonthLimitNum;
                            params.indLimit.balance = this.activeCreate.PLMonthLimitMoney * 100;
                        }
                    }
                    addActive({ params }).then(res => {
                        if (JSON.parse(res.result).result === 1) {
                            this.$notify({
                                title: '成功',
                                message: '添加成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.push('/discountActive/index');
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        cancel() {
            this.$refs.activeCreate.resetFields();
            this.$router.push('/discountActive/index');
        },
        handleCheckAllChange(val) {
            this.activeCreate.discountDate = this.checkAll ? WeekOptions : [];
            this.isIndeterminate = false;
        },
        handleCheckedCitiesChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.weeks.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.weeks.length;
        }
    },
    mixins: [butVisibleMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.active-create{
    margin: 30px auto 0;
    width: 1120px;
    .manage-container{
        .bangCard-bin{
            .el-form-item__content{
                display: flex;
            }
            .bankCard-bin-remark{
                padding: 0 10px;
                p{
                    margin: 0;
                    &:last-child{
                        color: #ccc;
                    }
                }
            }
        }
        .footer-btn{
            width: 500px;
            text-align: center;
        }
    }
} 
</style>
