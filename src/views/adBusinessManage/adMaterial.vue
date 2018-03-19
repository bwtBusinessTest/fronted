<template>
    <div class="ad-material">
        <div class="query-container" ref="queryContainer" style="height:180px;">   
            <el-form :inline="true" label-width="100px" ref="searchForm">
                <el-row>
                    <el-form-item  label="物料名称:">
                        <el-input v-model="form.materielName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="物料归属:">
                        <el-select size="small" :disabled='flag' filterable v-model="form.cityId" clearable placeholder="全部">
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
                    <el-form-item label="添加时间:" style="width:500px">
                        <el-date-picker style="width:150px" size="small" v-model="form.beginDate" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker> 至 <el-date-picker style="width:150px" size="small" v-model="form.endDate" value-format="yyyy-MM-dd" placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                </el-row>
            </el-form>
            <div class="query-btn">
                <el-button size="small" type="primary" icon="delete" @click="formClear" v-if="buttonVisible['5020104']">清空</el-button>
                <el-button  size="small" type="primary" icon="search" @click="searchMaterialData" v-if="buttonVisible['5020103']">查询</el-button>
            </div>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
           <el-row>
                <el-button size="small" type="primary" icon="delete" @click="deleteSelections" v-show="ifShow" v-if="buttonVisible['5020105']">删除</el-button>
                <el-button size="small" type="primary" icon="edit" @click="editRow" v-if="buttonVisible['5020108']">编辑</el-button>
                <el-button size="small" type="primary" icon="plus" @click="openAddModal" v-if="buttonVisible['5020106']">添加物料</el-button>
            </el-row>
            <el-table :data="tableData" border ref="multipleTable2" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight" @selection-change="handleSelectionChange" :default-sort = "{prop: 'createTime', order: 'descending'}">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top" v-if="scope.row.status=='1'">
                            <span class="operate" @click="openEditModal(scope.row)" v-if="buttonVisible['5020108']">编辑</span>
                            <span class="operate" @click="deleteRow(scope.row)" v-if="buttonVisible['5020105']">删除</span>
                            <div slot="reference" class="name-wrapper">
                                <span class="operate">操作</span>
                            </div>
                        </el-popover>
                        <span v-else class="operate">操作</span>
                    </template>
                </el-table-column>
                <el-table-column label="物料ID" prop="id">
                </el-table-column>
                <el-table-column label="物料名称" prop="materielName">
                </el-table-column>
                <el-table-column label="图片" prop="resourceUploadPatch">
                    <template slot-scope="props">
                        <img class="materialImg" :src="props.row.resourcePath" @click="handleClickPic(props.row.resourcePath,props.row.resourceName)">
                    </template>
                </el-table-column>
                <el-table-column label="尺寸">
                    <template slot-scope="props">
                        {{props.row.resourceWidth}} x {{props.row.resourceHeight}}
                    </template>
                </el-table-column>
                <el-table-column label="归属" prop="cityName">
                </el-table-column>
                <el-table-column label="添加时间" prop="createTime" width="160" sortable>
                </el-table-column>
                <el-table-column label="状态" prop="statusDesc">
                </el-table-column>
                <el-table-column label="备注信息" prop="remark">
                </el-table-column>
            </el-table>
            <div class="page-container">
                <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="form.pageSize" :page-sizes="[10, 20, 30]" @current-change="currenChange" @size-change="sizeChange"></el-pagination>
            </div>
        </div>
        <!-- 物料编辑 -->
        <el-dialog title="物料编辑" @close="clearData('editForm')" @open="openNewAddModal" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form :inline="false" label-width="100px" ref="editForm" :model="editForm" style="width:550px;margin:auto 30px;" :rules="editFormRules">
                <el-form-item label="物料ID:" prop="id">
                    <el-input size="small" v-model="editForm.id" style="width:185px" disabled></el-input>
                </el-form-item>
                <el-form-item label="物料所属:">
                    <el-select size="small" v-model="editForm.cityId" disabled>
                        <el-option
                            v-for="item in managerCity"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物料名称:" prop="materielName">
                    <el-input size="small" v-model="editForm.materielName" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="物料类型:" prop="materielType">
                    <el-radio disabled
                        v-for="item in materielTypeMenu"
                        :key="item.id"
                        :label="item.value"
                        v-model="editForm.materielType">{{item.caption}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="物料文件:" prop="adResourceId">
                    <el-upload
                        type="file"
                        name="file"
                        class="avatar-uploader"
                        :action="actionUrl"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :headers="uploadHeaders"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="跳转类型:" prop="jumpType">
                    <el-radio
                        v-for="item in jumpTypeMenu"
                        :key="item.id"
                        :label="item.value"
                        v-model="editForm.jumpType">{{item.caption}}
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="!(editForm.jumpType==='3')" label="跳转链接:" prop="jumpLink">
                    <el-input size="small" v-model="editForm.jumpLink" style="width:350px" placeholder="请以http(s)://开头"></el-input>
                </el-form-item>
                <el-form-item v-if="editForm.jumpType==='1'" label="显示容器:" prop="containerType">
                    <el-select size="small" v-model="editForm.containerType" clearable>
                        <el-option
                            v-for="item in containtMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业分类:" prop="industryType">
                    <el-select size="small" filterable v-model="editForm.industryType" clearable>
                        <el-option
                            v-for="item in industryTypeMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词:">
                    <el-input size="small" v-model="editForm.keyWord" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="editForm.remark" type="textarea" style="width:350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditForm('editForm')" v-if="buttonVisible['5020117']">提交</el-button>
                <el-button @click="cancleSubmit('editForm')">取消</el-button>
            </div>
        </el-dialog>
        <add-material :show.sync="dialogAddVisible" @sendMethod="searchMaterialData"></add-material>
        <preview-pic :show.sync="dialogPreviewPicVisible" @clickit="viewImg" :imgUrl="showImgUrl"></preview-pic>
    </div>
</template>

<script>
import { queryAdMaterialList, deleteMaterial, editMaterialApi, getMenuList, getManagerCity, getManagerCityMenu, adPositionUploadUrl, checkAdMeterialCanEdit } from '../../api/adMaterial';
import publicMethod from '../../utils/publicMethod';
import addMaterial from '@/components/addMaterial';
import previewPic from '@/components/previewPic';
import { getToken } from '@/utils/auth';
import butVisibleMixin from '../../utils/buttonVisible';
var $ = require('jquery');
export default {
    mixins: [publicMethod, butVisibleMixin],
    components: {
        addMaterial,
        previewPic
    },
    data() {
        // 校验跳转链接格式是否正确
        var checkFormat = (rule, value, callback) => {
            const reg = /^(\w+:\/\/)/;
            if (reg.test(value)) {
                return callback();
            } else {
                return callback(new Error('跳转链接格式不正确'));
            }
        };
        return {
            pageId: '50201',
            showImgUrl: '',
            // 查询条件
            form: {
                pageNo: 1,
                pageSize: 20,
                cityId: '',
                materielName: '',
                beginDate: '',
                endDate: ''
            },
            // 数据字典数据
            cityMenu: [],
            managerCity: [],
            containtMenu: [],
            jumpTypeMenu: [],
            industryTypeMenu: [],
            materielTypeMenu: [],
            // dialog数据
            dialogAddVisible: false,
            dialogEditVisible: false,
            dialogPreviewPicVisible: false,
            // table数据
            tableData: [],
            total: 0,
            multipleSelection: [],
            loading: true,
            imageUrl: '',
            actionUrl: adPositionUploadUrl(),
            uploadHeaders: { Authorization: getToken() },
            flag: false,
            // 表单数据
            editForm: {
                id: '',
                cityId: '',
                materielName: '',
                materielType: '1',
                jumpType: '',
                jumpLink: '',
                containerType: '',
                industryType: '',
                keyWord: '',
                remark: '',
                adResourceId: ''
            },
            editFormRules: {
                materielName: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
                materielType: [{ required: true, message: '请选择物料类型', trigger: 'blur' }],
                adResourceId: [{ required: true, message: '请选择物料文件', trigger: 'blur' }],
                jumpType: [{ required: true, message: '请选择跳转类型', trigger: 'blur' }],
                jumpLink: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }, { validator: checkFormat, trigger: 'blur' }],
                containerType: [{ required: true, message: '请选择显示容器', trigger: 'blur' }],
                industryType: [{}],
                keyWord: [{}],
                remark: [{}]
            },
            ifShow: false
        };
    },
    created() {
        this.getCityMenu();
        this.getMenusList('1043');
        this.getMenusList('1046');
        this.getMenusList('1047');
        this.getMenusList('1048');
        this.getCity();
    },
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return '';
            }
        }
    },
    methods: {
        // 图片预览消失
        viewImg() {
            this.dialogPreviewPicVisible = false;
        },
        // 获取管理员城市属性
        getCity() {
            getManagerCity({}).then(res => {
                if (res.errcode === '0000') {
                    this.managerCity = [res.result];
                    this.editForm.cityId = res.result.type;
                }
            });
        },
        getCityMenu() {
            const params = { level: '2' };
            getManagerCityMenu({ params }).then(res => {
                if (res.errcode === '0000') {
                    if (res.result.length > 1) {
                        this.cityMenu = res.result;
                    } else {
                        this.cityMenu = res.result;
                        this.flag = true;
                        this.form.cityId = this.cityMenu[0].children[0].code;
                    }
                }
                this.searchMaterialData();
            });
        },
        // 获取下拉框数据列表
        getMenusList(code) {
            const params = { code: code };
            getMenuList({ params }).then(res => {
                if (code === '1043') {
                    this.materielTypeMenu = res.result;
                }
                if (code === '1046') {
                    this.jumpTypeMenu = res.result;
                }
                if (code === '1047') {
                    this.containtMenu = res.result;
                }
                if (code === '1048') {
                    this.industryTypeMenu = res.result;
                }
            });
        },
        // 物料数据查询
        searchMaterialData() {
            const params = {
                pageNo: this.form.pageNo,
                pageSize: this.form.pageSize,
                cityId: this.form.cityId,
                materielName: this.form.materielName,
                beginDate: this.form.beginDate,
                endDate: this.form.endDate
            };
            queryAdMaterialList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.total = res.result.totalCount;
                    this.tableData = res.result.rows;
                    for (var i = 0; i < this.tableData.length; i++) {
                        this.tableData[i].cityId = this.tableData[i].cityId.toString();
                    }
                    this.loading = false;
                }
            });
        },
        // 清空数据
        formClear() {
            if (this.flag === true) {
                this.form.materielName = '';
                this.form.beginDate = '';
                this.form.endDate = '';
            } else {
                this.form = this.$options.data().form;
            }
        },
        clearData(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddVisible = false;
            this.dialogEditVisible = false;
        },
        // dialog方法
        openAddModal() {
            this.dialogAddVisible = true;
        },
        editRow() {
            if (this.multipleSelection.length !== 1) {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择一条或多条数据',
                    duration: 800
                });
            } else {
                if (this.multipleSelection[0].status === '0') {
                    this.$notify.warning({
                        title: '消息',
                        message: '已删除的物料不允许修改',
                        duration: 800
                    });
                } else {
                    this.openEditModal(this.multipleSelection[0]);
                }
            }
        },
        openEditModal(row) {
            const params = { ids: [row.id] };
            var canDelete = (row.cityId === this.cityMenu[0].children[0].code);
            if (canDelete) {
                checkAdMeterialCanEdit({ params }).then(res => {
                    if (!res.result.isExist) {
                        this.dialogEditVisible = true;
                        for (var key in this.editForm) {
                            if (key !== 'cityId') {
                                this.editForm[key] = row[key];
                            }
                        }
                        this.imageUrl = row.resourcePath;
                    } else {
                        this.$notify.warning({
                            title: '消息',
                            message: '该物料已有上架中（待生效、生效中）及待审核的广告，不允许修改',
                            duration: 800
                        });
                    }
                });
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '只能编辑管理员对应城市的物料',
                    duration: 800
                });
            }
        },
        cancleSubmit(formName) {
            this.clearData(formName);
        },
        // 编辑提交
        submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = this.editForm;
                    editMaterialApi({ params }).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify.success({
                                title: '消息',
                                message: '编辑成功',
                                duration: 800
                            });
                            this.clearData('editForm');
                            this.imageUrl = '';
                            this.searchMaterialData();
                        }
                    });
                }
            });
        },
        // 删除选中
        deleteSelections() {
            if (this.multipleSelection.length > 0) {
                const ids = [];
                var canDelete = this.multipleSelection.every(ele => {
                    return ele.cityId === this.cityMenu[0].children[0].code;
                });
                if (canDelete) {
                    for (var i = 0; i < this.multipleSelection.length; i++) {
                        ids.push(this.multipleSelection[i].id);
                    }
                    const params = { ids: ids };
                    checkAdMeterialCanEdit({ params }).then(res => {
                        if (!res.result.isExist) {
                            this.delete(params);
                        } else {
                            this.$notify.warning({
                                title: '消息',
                                message: '该物料已有上架中（待生效、生效中）及待审核的广告，不允许删除',
                                duration: 800
                            });
                        }
                    });
                } else {
                    this.$notify.warning({
                        title: '消息',
                        message: '只能删除管理员对应城市的物料',
                        duration: 800
                    });
                }
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择一条或多条数据',
                    duration: 800
                });
            }
        },
        // 删除单行
        deleteRow(row) {
            const ids = [row.id];
            var canDelete = (row.cityId === this.cityMenu[0].children[0].code);
            if (canDelete) {
                const params = { ids: ids };
                checkAdMeterialCanEdit({ params }).then(res => {
                    if (!res.result.isExist) {
                        this.delete(params);
                    } else {
                        this.$notify.warning({
                            title: '消息',
                            message: '该物料已有上架中（待生效、生效中）及待审核的广告，不允许删除',
                            duration: 800
                        });
                    }
                });
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '只能删除管理员对应城市的物料',
                    duration: 800
                });
            }
        },
        // 删除
        delete(params) {
            this.$confirm('确认删除物料?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                deleteMaterial({ params }).then(res => {
                    if (res.errcode === '0000') {
                        this.$notify.success({
                            title: '消息',
                            message: '删除成功',
                            duration: 800
                        });
                        this.searchMaterialData();
                    }
                });
            }).catch(() => {});
            var self = this;
            setTimeout(function() {
                self.openComfirmCallback();
            }, 100);
        },
        // 打开confirm后回掉
        openComfirmCallback() {
            if (!this.isCollapse) {
                this.$nextTick(() => {
                    document.querySelector('.v-modal').style.left = '36px';
                });
            }
            if (document.querySelector('.v-modal')) {
                this.scrollHeight = $(document).scrollTop();
                if (this.scrollHeight >= 0 && this.scrollHeight < 50) {
                    document.querySelector('.v-modal').style.top = (50 - this.scrollHeight) + 'px';
                } else {
                    document.querySelector('.v-modal').style.top = 0 + 'px';
                }
            }
        },
        // table方法
         // 分页
        currenChange(val) {
            this.form.pageNo = val;
            this.searchMaterialData();
        },
        sizeChange(val) {
            this.form.pageSize = val;
            this.searchMaterialData();
        },
        // 当前选中发生变化
        handleSelectionChange(val) {
            this.multipleSelection = val;
            var ifSame = this.multipleSelection.every(function(ele) {
                return ele.status === '1';
            });
            ifSame ? this.ifShow = true : this.ifShow = false;
            if (this.multipleSelection.length === 0) {
                this.ifShow = false;
            }
        },
        // 图片上传之前的钩子
        beforeAvatarUpload(file) {
            const isJPG = ((file.type === 'image/jpeg') || (file.type === 'image/gif') || (file.type === 'image/png'));
            const isLt2M = file.size / 1024 < 500;
            if (!isJPG) {
                this.$message.error('上传图片只能是jpg/gif/png格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过500kb!');
            }
            return isJPG && isLt2M;
        },
        // 图片上传成功
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.editForm.adResourceId = res.resourceId;
        },
        // 图片预览
        handleClickPic(path, name) {
            this.showImgUrl = path;
            this.dialogPreviewPicVisible = true;
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '180px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        }
    }
};
</script>

<style lang='scss'>
    @import '../../styles/common.scss';
    .ad-material{
        margin: 30px auto 0;
        width: 1120px;
        .query-container{
            .el-form-item{
                width:400px;
            }
            .el-input--small{
                width:200px;
            }
        }
        .manage-container{
            .el-col{
                margin-right: 30px;
            }
        }
        .el-dialog{
            width: 600px;
            margin-top:5px!important;
        }
        .el-dialog__wrapper{
            top: 50px;
            left: 200px;
        }
        .operate{
            color: #409EFF;
            font-size: 12px;
            cursor: pointer;
            padding: 0 6px;
        }
        span.operate:hover{
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .materialImg{
        width:80px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        min-height: 100px;
        line-height: 100px;
        text-align: center;
    }
    .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }
    .el-popover{
        min-width:80px;
    }
    .operate{
        color: #409EFF;
        font-size: 12px;
        cursor: pointer;
        padding: 0 6px;
    }
    span.operate:hover{
        text-decoration: underline;
        cursor: pointer;
    }
</style>
