<template>
    <div class="apply-review">
        <div class="manage-container">
            <div class="ad-title">
                <el-form :model="titleData" label-width="90px">
                    <el-form-item label="广告ID:">
                        <span>{{titleData.adId}}</span>
                    </el-form-item>
                    <el-form-item label="广告归属:">
                        <span>{{titleData.adBelong}}</span>
                    </el-form-item>
                    <el-form-item label="广告名称:">
                        <span>{{titleData.adName}}</span>
                    </el-form-item>
                    <el-form-item label="广告类型:">
                        <span>{{titleData.adType}}</span>
                    </el-form-item>
                    <el-form-item label="展现设置:">
                        <span>{{titleData.displayType}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <div class="ad-material">
                <div class="material-title">
                  <h3>广告物料</h3>
                </div>
                <div>
                    <el-form :model="materialData" label-width="90px">
                        <el-row>
                            <el-col :span="5">
                                <el-form-item label="物料ID:">
                                    <span>{{materialData.id}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="5">
                                <el-form-item label="物料名称:">
                                    <span>{{materialData.name}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="物料尺寸:">
                            <span>{{materialData.size}}</span>
                        </el-form-item>
                        <el-form-item label="物料显示:">
                            <img :src="materialData.url" style="width:100px;" @click="handleClickPic">
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="put-set">
                <h3>投放设置</h3>
                <p>生效时间：{{startDate}}</p>
                <p>失效时间：{{endDate}}</p>
                <p>投放广告位:</p>
                <el-table :data="tableData" border ref="multipleTable" :height="tableHeight" :cell-style="cellStyle">
                    <el-table-column label="广告位ID" prop="adSenseId" align="center">
                    </el-table-column>
                    <el-table-column label="城市" prop="cityName" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="广告位名称" prop="adSenseName" align="center">
                    </el-table-column>
                    <el-table-column label="广告类型" prop="adSenseTypeDesc" align="center">
                    </el-table-column>
                    <el-table-column label="广告位尺寸" prop="adPositionSize">
                    </el-table-column>
                    <el-table-column label="适配度" prop="fitness">
                    </el-table-column>
                    <el-table-column label="投放／闸值／轮播" prop="put">
                    </el-table-column>
                </el-table>
                <div class="page-container">
                    <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
                </div>
            </div>
            <div class="remark">
                <div>审核备注：</div>
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入"
                  v-model="textarea"
                  style="width:300px;">
                </el-input>
            </div>
            <div class="footer">
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-check" v-if="buttonVisible['5020340']" @click="check(1)">审核通过</el-button>
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-error" v-if="buttonVisible['5020341']" @click="check(2)">审核不通过</el-button>
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-error" @click="$router.go(-1)">返回</el-button>
            </div>
        </div>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="showImgUrl"></preview-pic>
    </div>
</template>

<script>
import previewPic from '@/components/previewPic';
import buttonVisible from '@/utils/buttonVisible';
import {
    getAdDetail,
    getCity,
    getAdSensesByAdId,
    adCheck
} from '@/api/adPublish';
const AD_TYPE = ['', '开屏广告', 'Banner广告', '插屏广告'];
const DISPLAY_TYPE = ['普通显示', '强制显示'];

export default {
    name: 'applyReview',
    data() {
        return {
            pageId: '50203',
            titleData: {
                adId: '',
                adBelong: '',
                adName: '',
                owner: '',
                cityId: '',
                adType: '',
                adTypeNum: undefined,
                displayType: ''
            },
            materialData: {
                id: '',
                name: '',
                size: '',
                url: ''
            },
            startDate: '',
            endDate: '',
            tableHeight: 400,
            tableData: [],
            currentPage: 1,
            totalRows: 0,
            pageSize: 10,
            textarea: '',
            dialogPreviewPicVisible: false,
            showImgUrl: ''
        };
    },
    created() {
        this.getAdDetail();
        this.getAdBelong();
        this.getAdSensesByAdId();
    },
    methods: {
        handleClickPic() {
            this.showImgUrl = this.materialData.url;
            this.dialogPreviewPicVisible = true;
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdSensesByAdId(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAdSensesByAdId(this.currentPage);
        },
        getAdDetail() {
            getAdDetail({ params: this.$route.query.adId }).then(res => {
                if (res.errcode === '0000') {
                    this.titleData.adId = res.adAdvertisementDetailDto.adId;
                    this.titleData.adName = res.adAdvertisementDetailDto.adName;
                    this.titleData.owner = res.adAdvertisementDetailDto.adAdvertiserId;
                    this.materialData.id = res.adAdvertisementDetailDto.adMateriel.id;
                    this.materialData.name = res.adAdvertisementDetailDto.adMateriel.materielName;
                    this.materialData.size = res.adAdvertisementDetailDto.adMateriel.resourceWidth + '*' + res.adAdvertisementDetailDto.adMateriel.resourceHeight;
                    this.materialData.url = `http://60.190.227.164:8100/resource/ad${res.adAdvertisementDetailDto.adMateriel.resourcePath}`;
                    this.startDate = res.adAdvertisementDetailDto.adTime.adBeginDate;
                    this.endDate = res.adAdvertisementDetailDto.adTime.adEndDate;
                    this.titleData.adType = AD_TYPE[Number(res.adAdvertisementDetailDto.adType)];
                    this.titleData.adTypeNum = res.adAdvertisementDetailDto.adType;
                    this.titleData.displayType = DISPLAY_TYPE[res.adAdvertisementDetailDto.displayType];
                }
            });
        },
        getAdBelong() {
            getCity({ params: {}}).then(res => {
                this.titleData.adBelong = res.result.caption;
                this.titleData.cityId = res.result.caption === '本级' ? res.result.code : res.result.type;
            });
        },
        getAdSensesByAdId(page) {
            const pageNo = page || 1;
            const params = { pageNo: pageNo, pageSize: this.pageSize, adId: this.$route.query.adId };
            getAdSensesByAdId({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows.filter(i => {
                        i.adPositionSize = `${i.adSenseWide}*${i.adSenseHigh}`;
                        i.put = `${i.totalAdsCount}/${i.deliveryThreshold}/${i.carouselNumber}`;
                        return i;
                    });
                    this.totalRows = res.result.totalCount;
                }
            });
        },
        cellStyle({ row, columnIndex }) {
            if (((Number(row.fitness) >= 1.1 || Number(row.fitness) <= 0.9) && columnIndex === 5) || (columnIndex === 6 && row.totalAdsCount > row.deliveryThreshold)) {
                return { color: 'red' };
            }
        },
        check(type) {
            const params = { adId: this.$route.query.adId, processReason: this.textarea };
            if (type === 1) {
                params.processType = '4';
            } else {
                params.processType = '5';
            }
            adCheck({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.$notify({
                        title: '成功',
                        message: '审核成功',
                        type: 'success',
                        duration: 1000
                    });
                    this.$router.push('/advertise/businessManage/adPublish');
                }
            });
        }
    },
    components: {
        previewPic
    },
    mixins: [buttonVisible]
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.apply-review{
    margin: 30px auto 0;
    width: 1120px;
    .manage-container{
        .ad-title{
            border-bottom: 1px solid #ccc;
        }
        .ad-material{
            border-bottom: 1px solid #ccc;
        }
        .remark{
            display: flex;
        }
        .footer{
            margin-top: 30px;
            text-align: center;
        }
    }
}
</style>
