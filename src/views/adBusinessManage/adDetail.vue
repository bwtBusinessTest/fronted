<template>
    <div class="ad-detail">
        <div class="manage-container">
            <el-form :model="adDetailInfo" label-width="90px">
                <el-form-item label="广告ID:">
                    <span>{{adDetailInfo.adId}}</span>
                </el-form-item>
                <el-form-item label="广告归属:">
                    <span>{{adDetailInfo.adBelong}}</span>
                </el-form-item>
                <el-form-item label="广告名称:">
                    <span>{{adDetailInfo.adName}}</span>
                </el-form-item>
                <el-form-item label="广告主:">
                    <span>{{adDetailInfo.owner}}</span>
                </el-form-item>
                <el-form-item label="广告类型:">
                    <span>{{adDetailInfo.adType}}</span>
                </el-form-item>
                <el-form-item v-if="adDetailInfo.adTypeNum === 3" label="展现设置:">
                    <span>{{adDetailInfo.displayType}}</span>
                </el-form-item>
            </el-form>
            <hr></hr>
            <h3>广告物料</h3>
            <el-form :model="adDetailInfo">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="物料ID:">
                            <span>{{adDetailInfo.materialId}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="物料名称:">
                            <span>{{adDetailInfo.materialName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="物料尺寸:">
                    <span>{{adDetailInfo.materialSize}}</span>
                </el-form-item>
                <el-form-item label="物料显示:">
                    <img :src="adDetailInfo.materialUrl" style="width:100px;" @click="handleClickPic">
                </el-form-item>
            </el-form>
            <hr></hr>
            <h3>投放设置</h3>
            <p>生效时间:{{adDetailInfo.startDate}}</p>
            <p>失效时间:{{adDetailInfo.endDate}}</p>
            <el-table :data="tableData" border ref="multipleTable" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :empty-text="noTableData" :height="tableHeight" :cell-style="cellStyle">
                <el-table-column label="广告位ID" prop="adSenseId" width="110" align="center">
                </el-table-column>
                <el-table-column label="城市" prop="cityName" width="100" :show-overflow-tooltip="true" align="center">
                </el-table-column>
                <el-table-column label="广告位名称" prop="adSenseName" align="center">
                </el-table-column>
                <el-table-column label="广告类型" prop="adSenseTypeDesc" width="130" align="center">
                </el-table-column>
                <el-table-column label="广告位尺寸" prop="adPositionSize" width="110">
                </el-table-column>
                <el-table-column label="权重值" prop="weightValue" width="100">
                </el-table-column>
                <el-table-column label="排序值" prop="sortNo" width="100">
                </el-table-column>
                <el-table-column label="适配度" prop="fitness" width="110" align="center">
                </el-table-column>
                <el-table-column label="投放／阈值／轮播" prop="put" width="160">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="totalRows" :page-size="pageSize" :page-sizes="[10, 20, 30]" @current-change="handleCurrentChange" @size-change="handleSizeChange"></el-pagination>
            </div>
            <div style="text-align:center;">
                <el-button type="primary" size="small" style="width:120px;" icon="el-icon-error" @click="$router.go(-1)">返 回</el-button>
            </div>
        </div>
        <preview-pic :show.sync="dialogPreviewPicVisible" :imgUrl="adDetailInfo.materialUrl"></preview-pic>
    </div>
</template>

<script>
import {
    getAdDetail,
    getCity,
    getAdSensesByAdId,
    getAdvertiser
} from '@/api/adPublish';
import previewPic from '@/components/previewPic';
const AD_TYPE = ['', '开屏广告', 'Banner广告', '插屏广告'];
const DISPLAY_TYPE = ['普通显示', '强制显示'];

export default {
    name: 'adDetail',
    data() {
        return {
            adDetailInfo: {
                adId: '',
                adName: '',
                owner: '',
                adType: '',
                displayType: '',
                materialSize: '',
                materialId: '',
                materialName: '',
                materialUrl: '',
                startDate: '',
                endDate: '',
                adBelong: '',
                adTypeNum: ''
            },
            tableHeight: 600,
            tableData: [],
            currentPage: 1,
            loading: false,
            noTableData: '',
            pageSize: 20,
            totalRows: 0,
            dialogPreviewPicVisible: false,
            advertisers: []
        };
    },
    created() {
        this.getAdvertiser();
        this.getAdDetail();
        this.getAdBelong();
        this.getAdSensesByAdId();
    },
    methods: {
        getAdDetail() {
            // console.log(this.advertisers);
            getAdDetail({ params: this.$route.query.adId }).then(res => {
                if (res.errcode === '0000') {
                    this.adDetailInfo.adId = res.adAdvertisementDetailDto.adId;
                    this.adDetailInfo.adName = res.adAdvertisementDetailDto.adName;
                    this.adDetailInfo.owner = res.adAdvertisementDetailDto.adAdvertiserName;
                    this.adDetailInfo.adType = AD_TYPE[Number(res.adAdvertisementDetailDto.adType)];
                    this.adDetailInfo.adTypeNum = Number(res.adAdvertisementDetailDto.adType);
                    this.adDetailInfo.displayType = DISPLAY_TYPE[res.adAdvertisementDetailDto.displayType];
                    this.adDetailInfo.materialId = res.adAdvertisementDetailDto.adMateriel.id;
                    this.adDetailInfo.materialName = res.adAdvertisementDetailDto.adMateriel.materielName;
                    this.adDetailInfo.materialSize = res.adAdvertisementDetailDto.adMateriel.resourceWidth + '*' + res.adAdvertisementDetailDto.adMateriel.resourceHeight;
                    this.adDetailInfo.materialUrl = res.adAdvertisementDetailDto.adMateriel.resourcePath;
                    this.adDetailInfo.startDate = res.adAdvertisementDetailDto.adTime.adBeginDate;
                    this.adDetailInfo.endDate = res.adAdvertisementDetailDto.adTime.adEndDate;
                }
            });
        },
        getAdBelong() {
            getCity({ params: {}}).then(res => {
                this.adDetailInfo.adBelong = res.result.caption;
            });
        },
        cellStyle({ row, columnIndex }) {
            if (((Number(row.fitness) >= 1.1 || Number(row.fitness) <= 0.9) && columnIndex === 7) || (columnIndex === 8 && row.totalAdsCount > row.deliveryThreshold)) {
                return { color: 'red' };
            }
        },
        handleClickPic() {
            this.dialogPreviewPicVisible = true;
        },
        getAdSensesByAdId(page) {
            const pageNo = page || 1;
            const params = { pageNo: pageNo, pageSize: this.pageSize, adId: this.$route.query.adId };
            getAdSensesByAdId({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows.filter(i => {
                        i.adPositionSize = `${i.adSenseWide}*${i.adSenseHigh}`;
                        i.put = `${i.totalAdsCount}/${i.deliveryThreshold}/${i.carouselNumber}`;
                        i.cityName = i.cityName === '本级' ? '全国' : i.cityName;
                        return i;
                    });
                    this.totalRows = res.result.totalCount;
                }
            });
        },
        getAdvertiser() {
            getAdvertiser({ params: {}}).then(res => {
                this.advertisers = res.result;
            });
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getAdSensesByAdId(this.currentPage);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getAdSensesByAdId(this.currentPage);
        }
    },
    components: {
        previewPic
    }
};
</script>

<style lang="scss">
@import '../../styles/common.scss';
.ad-detail{
    margin: 30px auto 0;
    width: 1120px;
}
</style>
