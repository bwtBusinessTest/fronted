<template>
    <div class="active-detail-and-modify">
        <div class="manage-container">
            <div class="item">
                <el-form :model="form1" label-width="88px">
                    <el-form-item label="活动名称:"><span>{{form1.activeName}}</span></el-form-item>
                </el-form>
            </div>
            <div class="item">
                <el-form :model="form2" :inline="true" label-width="88px" style="width:620px;">
                    <el-form-item label="活动ID:" >
                        <span class="form-item">{{form2.activeId}}</span>
                    </el-form-item>
                    <el-form-item label="服务类型:" >
                        <span class="form-item">{{form2.serverType}}</span>
                    </el-form-item>
                    <el-form-item label="优先级值:" >
                        <span class="form-item">{{form2.importantVal}}</span>
                    </el-form-item>
                    <el-form-item label="活动区域:" >
                        <span class="form-item">{{form2.activeArea}}</span>
                    </el-form-item>
                    <el-form-item label="归档编号:" >
                        <el-input size="small" v-model.number="form2.sortNum" style="width:200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="支付方式:" >
                        <span class="form-item">{{form2.payType}}<span v-if="form2.payType === '绑卡'">{{`(卡bin${form2.cardBinNum}条)`}}</span></span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="item">
                <el-form :model="form3" label-width="88px" :rules="form3Rules" ref="form3Rules">
                    <el-form-item label="起始时间:">
                        <el-date-picker size="small" v-model="form3.startDate" type="datetime" placeholder="开始日期"></el-date-picker><span style="color:#ccc;margin-left:5px;">注：留空为不限时</span>
                    </el-form-item>
                    <el-form-item label="结束时间:" prop="endDate">
                        <el-date-picker size="small" v-model="form3.endDate" type="datetime" placeholder="开始日期"></el-date-picker><span style="color:#ccc;margin-left:5px;">注：留空为不限时</span>
                    </el-form-item>
                    <el-form-item label="优惠期:" >
                        <span class="form-item">{{form3.discountDate}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="item">
                <el-form :model="form4" label-width="88px">
                    <el-form-item label="优惠规则:" >
                        <span class="form-item">{{form4.discountRules}}</span>
                    </el-form-item>
                    <el-form-item label="总量限制:"  v-if="$route.query.allLimit">
                        <span class="form-item">{{form4.totalLimit}}</span>
                    </el-form-item>
                    <el-form-item label="个体限制:" v-if="$route.query.indLimit">
                        <span class="form-item">{{form4.personLimit}}</span>
                    </el-form-item>
                    <el-form-item label="配置说明:" >
                        <span class="form-item">{{form4.configInstruction}}</span>
                    </el-form-item>
                </el-form>
                <div class="footer-btn">
                    <el-button type="primary" @click="submit" v-if="buttonVisible['40211']">提交修改</el-button>
                    <el-button @click="$router.push({ path: '/discountActive/index', query: { city: $route.query.city, service: $route.query.service }});" v-if="buttonVisible['40212']">取消</el-button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import {
    modifyActive
} from '@/api/discountActive';
import { formatLongDateToSecond } from '@/utils/index';
import butVisibleMixin from '../../utils/buttonVisible';
const WEEK = ['一', '二', '三', '四', '五', '六', '日'];
const CYCLE = ['整个活动期间', '按天', '按周', '按月'];

export default {
    name: 'activeDetailAndModify',
    data() {
        var valideEndDate = (rule, value, callback) => {
            if (this.form3.startDate && this.form3.endDate) {
                if (new Date(this.form3.startDate) >= new Date(this.form3.endDate)) {
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
            form1: {
                activeName: this.$route.query.disctName
            },
            form2: {
                activeId: this.$route.query.disctId,
                serverType: this.$route.query.service,
                importantVal: this.$route.query.priority,
                activeArea: this.$route.query.city,
                sortNum: Number(this.$route.query.docType),
                payType: this.$route.query.payType,
                cardBinNum: this.$route.query.numCardBin
            },
            form3: {
                startDate: new Date(this.$route.query.effectTime),
                endDate: new Date(this.$route.query.expireTime),
                discountDate: ''
            },
            form3Rules: {
                startDate: [{ type: 'date', required: true, message: '请选择起始时间', trigger: 'change' }],
                endDate: [{ type: 'date', validator: valideEndDate, trigger: 'change' }]
            },
            form4: {
                discountRules: '',
                totalLimit: '',
                personLimit: '',
                configInstruction: this.$route.query.remarks
            }
        };
    },
    mounted() {
        this.$route.query.weekSet.split('').forEach((e, i) => {
            if (e === '1') {
                this.form3.discountDate += ` 周${WEEK[i]},`;
            }
        });
        this.form3.discountDate = this.form3.discountDate.substring(0, this.form3.discountDate.length - 1);
        switch (Number(this.$route.query.disctType)) {
            case 1:
                this.form4.discountRules = `一口价优惠${this.$route.query.disctValue / 100}元`;
                break;
            case 3:
                this.form4.discountRules = `标准优惠后费用上折扣${10 - this.$route.query.disctValue / 1000}折`;
                break;
            case 13:
                this.form4.discountRules = `原票价上折扣${10 - this.$route.query.disctValue / 1000}折`;
                break;
        }
        if (this.$route.query.allLimit) {
            const data = JSON.parse(this.$route.query.allLimit);
            this.form4.totalLimit = `${CYCLE[data.cycle]}: ${data.balance / 100}元,  限次: ${data.times}`;
        }
        if (this.$route.query.indLimit) {
            const data2 = JSON.parse(this.$route.query.indLimit);
            this.form4.personLimit = `${CYCLE[data2.cycle]}: ${data2.balance / 100}元,  限次: ${data2.times}`;
        }
    },
    methods: {
        submit() {
            this.$refs.form3Rules.validate((valid) => {
                if (valid) {
                    const params = { disctId: this.$route.query.disctId, docType: this.form2.sortNum };
                    if (this.form3.startDate) {
                        params.effectTime = formatLongDateToSecond(this.form3.startDate);
                    }
                    if (this.form3.endDate) {
                        params.expireTime = formatLongDateToSecond(this.form3.endDate);
                    }
                    modifyActive({ params }).then(res => {
                        if (JSON.parse(res.result).result === 1) {
                            this.$notify({
                                title: '成功',
                                message: '修改成功',
                                type: 'success',
                                duration: 1000
                            });
                            this.$router.push({ path: '/discountActive/index', query: { city: this.$route.query.city, service: this.$route.query.service }});
                        }
                    });
                }
            });
        }
    },
    mixins: [butVisibleMixin]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.active-detail-and-modify{
    margin: 30px auto;
    width: 1120px;
    .manage-container{
        .item{
            border-bottom: 1px solid #ccc;
            padding-top: 10px;
            &:last-of-type{
                border-bottom: none;
            }
            .footer-btn{
                width: 500px;
                text-align: center;
            }
            .el-form-item{
                span{
                    color: #48576a;
                }

            }
        }
        .form-item{
            display: inline-block;
            width: 200px;
        }
    }
}

</style>
