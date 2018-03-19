<template>
    <div>
        <!-- 物料添加 -->
        <el-dialog title="物料添加" @close="clearMeterialChoose" @open="openNewAddModal" :visible.sync="visible" :close-on-click-modal="false">
            <el-form :inline="false" label-width="100px" ref="addForm" :model="addForm" style="width:550px;margin:auto 30px;" :rules="addFormRules">
                <el-form-item label="物料所属:" prop="cityId">
                    <el-select size="small" v-model="addForm.cityId" disabled>
                        <el-option
                            v-for="item in cityMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.type">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物料名称:" prop="materielName">
                    <el-input size="small" v-model="addForm.materielName" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="物料类型:" prop="materielType">
                    <el-radio disabled
                        v-for="item in materielTypeMenu"
                        :key="item.id"
                        :label="item.value"
                        v-model="addForm.materielType">{{item.caption}}
                    </el-radio>
                </el-form-item>
                <el-form-item label="物料文件:" prop="adResourceId">
                    <el-upload
                        type="file"
                        name="file"
                        class="avatar-uploader"
                        :action="actionUrl"
                        :show-file-list="false"
                        :headers="uploadHeaders"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAvatarSuccess">
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
                        v-model="addForm.jumpType">{{item.caption}}
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="!(addForm.jumpType==='3')" label="跳转链接:" prop="jumpLink">
                    <el-input size="small" v-model="addForm.jumpLink" style="width:350px" placeholder="请以http(s)://开头"></el-input>
                </el-form-item>
                <el-form-item v-if="addForm.jumpType==='1'" label="显示容器:" prop="containerType">
                    <el-select size="small" filterable v-model="addForm.containerType" clearable>
                        <el-option
                            v-for="item in containtMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="行业分类:" prop="industryType">
                    <el-select size="small" filterable v-model="addForm.industryType" clearable>
                        <el-option
                            v-for="item in industryTypeMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词:">
                    <el-input size="small" v-model="addForm.keyWord" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input v-model="addForm.remark" type="textarea" style="width:350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" v-if="buttonVisible['5020315']" @click="submitAddForm('addForm')">提交</el-button>
                <el-button @click="cancleSubmit('addForm')">取消</el-button>
            </div>
        </el-dialog>
    </div>   
</template>
<script>
import { queryAdMaterialList, addMaterialApi, getMenuList, getManagerCity, adPositionUploadUrl } from '@/api/adMaterial';
import publicMethod from '../utils/publicMethod';
import buttonVisible from '@/utils/buttonVisible';
import { getToken } from '@/utils/auth';
export default {
    mixins: [publicMethod, buttonVisible],
    name: 'addMaterial',
    props: {
        show: {
            type: Boolean,
            default: false
        }
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
            pageId: '50203',
            addForm: {
                cityId: '',
                materielName: '',
                materielType: '1',
                jumpType: '1',
                jumpLink: '',
                containerType: '0',
                industryType: '',
                keyWord: '',
                remark: '',
                adResourceId: ''
            },
            visible: this.show,
            cityMenu: [],
            containtMenu: [],
            jumpTypeMenu: [],
            industryTypeMenu: [],
            materielTypeMenu: [],
            imageUrl: '',
            actionUrl: adPositionUploadUrl(),
            uploadHeaders: { Authorization: getToken() },
            addFormRules: {
                materielName: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
                materielType: [{ required: true, message: '请选择物料类型', trigger: 'blur' }],
                adResourceId: [{ required: true, message: '请选择物料文件', trigger: 'blur' }],
                jumpType: [{ required: true, message: '请选择跳转类型', trigger: 'blur' }],
                jumpLink: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }, { validator: checkFormat, trigger: 'blur' }],
                containerType: [{ required: true, message: '请选择显示容器', trigger: 'blur' }],
                industryType: [{}],
                keyWord: [{}],
                remark: [{}]
            }
        };
    },
    created() {
        this.getMenusList('1043');
        this.getMenusList('1046');
        this.getMenusList('1047');
        this.getMenusList('1048');
        this.getCity();
    },
    methods: {
        clearMeterialChoose() {
            this.$emit('update:show', false);
        },
        // 获取管理员城市属性
        getCity() {
            getManagerCity({}).then(res => {
                if (res.errcode === '0000') {
                    this.cityMenu = [res.result];
                    this.addForm.cityId = res.result.type;
                }
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
            this.addForm.adResourceId = res.resourceId;
        },
        // 添加提交
        submitAddForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const params = this.addForm;
                    addMaterialApi({ params }).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify.success({
                                title: '消息',
                                message: '添加成功',
                                duration: 800
                            });
                            this.clearData('addForm');
                            this.imageUrl = '';
                            this.$emit('sendMethod');
                        }
                    });
                }
            });
        },
        cancleSubmit(formName) {
            this.clearData(formName);
        },
        clearData(formName) {
            this.$refs[formName].resetFields();
            this.$emit('update:show', false);
        }
    },
    watch: {
        show() {
            this.visible = this.show;
        }
    }
}
</script>
<style lang='scss' scoped>
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
</style>
