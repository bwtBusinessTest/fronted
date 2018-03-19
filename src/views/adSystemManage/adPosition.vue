<template>
    <div class="ad-position">
        <div class="query-container" ref="queryContainer" style="height:185px;">   
            <el-form :inline="true" :model="form" label-width="100px" ref="searchForm" :rules="formRules">
                <el-row>
                    <el-form-item  label="广告位名称:" prop="adSenseName">
                        <el-input v-model="form.adSenseName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="支持城市:">
                        <el-select size="small" filterable v-model="form.cityId" clearable placeholder="全部">
                            <el-option-group
                                v-for="group in cityList"
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
                    <el-form-item label="广告类型:">
                        <el-select size="small" filterable v-model="form.adSenseType" clearable placeholder="全部">
                            <el-option
                                v-for="item in adPosTypeMenu"
                                :key="item.id"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态:">
                        <el-select size="small" v-model="form.status" clearable placeholder="全部">
                            <el-option
                                v-for="item in statusMenu"
                                :key="item.id"
                                :label="item.caption"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
            </el-form>
            <el-row class="query-btn">
                <el-button size="small" type="primary" icon="delete" @click="formClear">清空</el-button>
                <el-button  size="small" type="primary" icon="search" @click="adPositionSearchTerm('searchForm')" v-if="buttonVisible['5010104']">查询</el-button>
            </el-row>
            <div class="draggable" @click="shrinkQueryArea">
                <icon-svg icon-class="hamburger"/>
            </div>
        </div>
        <div class="manage-container">
           <el-row>
                <el-button size="small" type="primary" icon="plus" @click="openAddModal" v-if="buttonVisible['5010105']">新增</el-button>
                <el-button size="small" type="primary" icon="check" @click="mutiUseAble(1)" v-show="ifShowOff" v-if="buttonVisible['5010107']">启用</el-button>
                <el-button size="small" type="primary" icon="minus" @click="mutiUseAble(0)" v-show="ifShowOn" v-if="buttonVisible['5010106']">停用</el-button>
            </el-row>
            <el-table :data="tableData" border ref="multipleTable2" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" :height="tableHeight" @selection-change="handleSelectionChange" :default-sort = "{prop: 'id', order: 'descending'}">
                <el-table-column type="selection">
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                            <span class="operate" @click="openEditModal(scope.row)" v-if="buttonVisible['5010108']">编辑</span>
                            <span class="operate" @click="singleUseAble(scope.row.status==='1'?0:1,scope.row.id)">{{scope.row.status==='1'?'禁用':'启用'}}</span>
                            <div slot="reference" class="name-wrapper">
                                <span class="operate">操作</span>
                            </div>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="广告位ID" prop="id" sortable>
                </el-table-column>
                <el-table-column label="广告位CODE" prop="adSenseCode">
                </el-table-column>
                <el-table-column label="广告位名称" prop="adSenseName">
                </el-table-column>
                <el-table-column label="广告类型" prop="adSenseTypeDesc">
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

        <!-- 广告位添加 -->
        <el-dialog title="广告位添加" @close="clearData('addForm')" @open="openNewAddModal" :visible.sync="dialogAddVisible" :close-on-click-modal="false">
            <el-form :inline="true" label-width="110px" ref="addForm" :model="addForm" style="width:550px;margin:auto 30px;" :rules="addFormRules">
                <el-form-item label="APP应用:" prop="appApplicationType">
                    <el-select size="small" filterable v-model="addForm.appApplicationType" clearable placeholder="请选择">
                        <el-option
                            v-for="item in AppType"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位名称:" prop="adSenseName">
                    <el-input size="small" v-model="addForm.adSenseName" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="广告位Code:" prop="adSenseCode">
                    <el-input size="small" v-model="addForm.adSenseCode" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="广告类型:" prop="adSenseType">
                    <el-radio 
                        v-for="item in adPosTypeMenu" 
                        :key="item.id"
                        v-model="addForm.adSenseType" 
                        :label="item.value">{{item.caption}}
                    </el-radio>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='1'" label="物料类型:" prop="materielType">
                    <el-checkbox v-model="addForm.materielType" style="margin-right:50px" true-label="1" false-label="">图片</el-checkbox>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='1'" label="关闭设置:" prop="autoCloseSecond">
                    <el-input size="small" placeholder="" v-model="addForm.autoCloseSecond" style="width:350px">
                        <template slot="append">秒后，自动关闭广告(注：0为不自动关闭)</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='1'" label=" " prop="autoUserCloseType">
                    <el-checkbox v-model="addForm.autoUserCloseType" 
                    style="margin-right:50px"
                    true-label="1" false-label="0"
                    >用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="支持物料:" prop="materielType" style="width:300px">
                    <el-checkbox v-model="addForm.materielType" true-label="1" false-label="">图片</el-checkbox>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="轮播数量:" prop="carouselNumber" style="width:300px">
                    <el-input size="small" v-model="addForm.carouselNumber" placeholder="" style="width:110px">
                        <template slot="append">张</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="轮播间隔:" prop="carouselInterval" style="width:300px">
                    <el-input size="small" placeholder="" v-model="addForm.carouselInterval" style="width:110px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="关闭设置:" prop="autoUserCloseType">
                    <el-checkbox v-model="addForm.autoUserCloseType" 
                    style="margin-right:50px"
                    true-label="1" false-label="0"
                    >用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="更新间隔:" prop="updateInterval" style="width:300px">
                    <el-input size="small" v-model="addForm.updateInterval" style="width:170px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='2'" label="默认图片:" prop="adResourceId">
                    <el-upload
                        type="file"
                        name="file"
                        class="avatar-uploader"
                        :action="actionUrl"
                        :show-file-list="false"
                        :headers="uploadHeaders"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='3'" label="支持物料:" prop="materielType">
                    <el-checkbox v-model="addForm.materielType" true-label="1" false-label="">图片</el-checkbox>                
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='3'" label="关闭设置:" prop="autoCloseSecond">
                    <el-input size="small" placeholder="" v-model="addForm.autoCloseSecond" style="width:350px">
                        <template slot="append">秒后，自动关闭广告(注：0为不自动关闭)</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='3'" label=" " prop="autoUserCloseType">
                    <el-checkbox v-model="addForm.autoUserCloseType" 
                    style="margin-right:50px"
                    true-label="1" false-label="0"
                    >用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-show="addForm.adSenseType=='3'" label="更新间隔:" prop="updateInterval" style="width:300px">
                    <el-input size="small" v-model="addForm.updateInterval" style="width:170px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="尺寸大小:" prop="adSenseWide">
                    <el-input size="small" v-model="addForm.adSenseWide" style="width:180px">
                        <template slot="prepend">宽</template>
                        <template slot="append">px</template>                        
                    </el-input>
                </el-form-item> 
                <el-form-item prop="adSenseHigh">  
                    <el-input size="small" v-model="addForm.adSenseHigh" style="width:180px">
                        <template slot="prepend">高</template>
                        <template slot="append">px</template>                        
                    </el-input>
                </el-form-item> 
                <!-- <el-form-item label="支持城市:" prop="cityIds">
                    <el-checkbox v-model="checkAddAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" style="margin-right:10px">全选</el-checkbox>
                    <el-checkbox-group v-model="addForm.cityIds" @change="handleCheckedCitiesChange" style="display:inline-block">
                        <el-checkbox v-for="city in cityMenu" :label="city.value" :key="city.lable">{{city.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>    -->
                <el-form-item label="支持城市:" prop="cityIds">
                    <el-select multiple filterable v-model="addForm.cityIds" placeholder="输入搜索" style="width:370px" @change="changeCity">
                        <el-option-group
                            v-for="group in cityList"
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
                <el-form-item label="投放阈值:" prop="deliveryThreshold">
                    <el-input size="small" v-model="addForm.deliveryThreshold" style="width:220px">
                        <template slot="append">个广告/城市广告位</template>                        
                    </el-input>
                </el-form-item>
                <el-form-item label="所在页面:" prop="curPage">
                    <el-input size="small" v-model="addForm.curPage" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input size="small" v-model="addForm.remark" type="textarea" style="width:350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAddForm('addForm')" v-if="buttonVisible['5010115']">提交</el-button>
                <el-button @click="clearData('addForm')">取消</el-button>
            </div>
        </el-dialog>   

        <!-- 广告位编辑 -->
        <el-dialog title="广告位编辑" @close="clearData('editForm')" @open="openNewAddModal" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
            <el-form :inline="true" label-width="110px" ref="editForm" :model="editForm" style="width:550px;margin:auto 30px;" :rules="editFormRules">
                <el-form-item label="广告位Id:" prop="id">
                    <el-input size="small" v-model="editForm.id" disabled style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="APP应用:" prop="appApplicationType">
                    <el-select size="small" disabled v-model="editForm.appApplicationType" placeholder="请选择">
                        <el-option
                            v-for="item in AppType"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="广告位名称:" prop="adSenseName">
                    <el-input size="small" v-model="editForm.adSenseName" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="广告位Code:" prop="adSenseCode">
                    <el-input size="small" v-model="editForm.adSenseCode" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="广告类型:" prop="adSenseType">
                    <el-select size="small" disabled v-model="editForm.adSenseType" placeholder="全部">
                        <el-option
                            v-for="item in adPosTypeMenu"
                            :key="item.id"
                            :label="item.caption"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='1'" label="物料类型:" prop="materielType" style="width:300px">
                    <el-checkbox v-model="editForm.materielType" style="margin-right:50px" true-label="1" false-label="">图片</el-checkbox>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='1'" label="关闭设置:" prop="autoCloseSecond">
                    <el-input size="small" placeholder="" v-model="editForm.autoCloseSecond" style="width:350px">
                        <template slot="append">秒后，自动关闭广告(注：0为不自动关闭)</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='1'" label=" " prop="autoUserCloseType">
                    <el-checkbox v-model="editForm.autoUserCloseType" style="margin-right:50px" true-label="1" false-label="0">用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="支持物料:" prop="materielType" style="width:300px">
                    <el-checkbox v-model="editForm.materielType" true-label="1" false-label="">图片</el-checkbox>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="轮播数量:" prop="carouselNumber" style="width:300px">
                    <el-input size="small" v-model="editForm.carouselNumber" placeholder="" style="width:110px">
                        <template slot="append">张</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="轮播间隔:" prop="carouselInterval" style="width:300px">
                    <el-input size="small" v-model="editForm.carouselInterval" style="width:110px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="关闭设置" prop="autoUserCloseType">
                    <el-checkbox v-model="editForm.autoUserCloseType" style="margin-right:50px" true-label="1" false-label="0">用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="更新间隔:" prop="updateInterval" style="width:300px">
                    <el-input size="small" v-model="editForm.updateInterval" style="width:170px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='2'" label="默认图片:" prop="adResourceId">
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
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='3'" label="支持物料:" prop="materielType" style="width:300px">
                    <el-checkbox v-model="editForm.materielType" style="margin-right:50px" true-label="1" false-label="">图片</el-checkbox>                    
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='3'" label="关闭设置:" prop="autoCloseSecond">
                    <el-input size="small" placeholder="" v-model="editForm.autoCloseSecond" style="width:350px">
                        <template slot="append">秒后，自动关闭广告(注：0为不自动关闭)</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='3'" label=" " prop="autoUserCloseType">
                    <el-checkbox v-model="editForm.autoUserCloseType" style="margin-right:50px" true-label="1" false-label="0">用户可关闭/跳过广告</el-checkbox>                                        
                </el-form-item>
                <el-form-item v-if="editForm.adSenseType=='3'" label="更新间隔:" prop="updateInterval" style="width:300px">
                    <el-input size="small" v-model="editForm.updateInterval" style="width:170px">
                        <template slot="append">秒</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="尺寸大小:" prop="adSenseWide">
                    <el-input size="small" :disabled="editForm.adSenseType!='3'" v-model="editForm.adSenseWide" style="width:180px">
                        <template slot="prepend">宽</template>
                        <template slot="append">px</template>                        
                    </el-input>
                </el-form-item> 
                <el-form-item prop="adSenseHigh">  
                    <el-input size="small" :disabled="editForm.adSenseType!='3'" v-model="editForm.adSenseHigh"  style="width:180px">
                        <template slot="prepend">高</template>
                        <template slot="append">px</template>                        
                    </el-input>
                </el-form-item>
                <el-form-item label="支持城市:" prop="cityIds">
                    <el-select multiple filterable v-model="editForm.cityIds" placeholder="输入搜索" style="width:370px" @change="changeCity">
                        <el-option-group
                            v-for="group in cityList"
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
                <el-form-item label="投放阈值:" prop="deliveryThreshold">
                    <el-input size="small" v-model="editForm.deliveryThreshold"  style="width:220px">
                        <template slot="append">个广告/城市广告位</template>                        
                    </el-input>
                </el-form-item>
                <el-form-item label="所在页面:">
                    <el-input size="small" v-model="editForm.curPage" style="width:350px"></el-input>
                </el-form-item>
                <el-form-item label="备注:">
                    <el-input size="small" v-model="editForm.remark" type="textarea" style="width:350px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitEditForm('editForm')" v-if="buttonVisible['5010121']">提交</el-button>
                <el-button @click="clearData('editForm')">取消</el-button>
            </div>
        </el-dialog>    
    </div>
</template>

<script>
import publicMethod from '../../utils/publicMethod';
import { queryAdPositionList, addAdPosition, startUsing, endUsing, editAdPosition, getMenuList, getCityList, adPositionUploadUrl, adPositionIsExit } from '../../api/adPosition';
import { getToken } from '@/utils/auth';
import butVisibleMixin from '../../utils/buttonVisible';
var $ = require('jquery');
export default {
    mixins: [publicMethod, butVisibleMixin],
    data() {
        var checkNum = (rule, value, callback) => {
            const reg = /^[0-9]\d*$/;
            if ((reg.test(value)) && (value !== '')) {
                return callback();
            } else {
                return callback(new Error('只能输入正整数且不能为空'));
            }
        };
        // 校验数字范围
        var autoCloseRange = (rule, value, callback) => {
            if (parseInt(value) >= 0 && parseInt(value) <= 10) {
                return callback();
            } else {
                return callback(new Error('输入范围是0-10'));
            }
        };
        var lunboNumRange = (rule, value, callback) => {
            if (parseInt(value) >= 1 && parseInt(value) <= 10) {
                return callback();
            } else {
                return callback(new Error('输入范围是1-10'));
            }
        };
        var updataTimeRange = (rule, value, callback) => {
            if (parseInt(value) >= 60 && parseInt(value) <= 18000) {
                return callback();
            } else {
                return callback(new Error('输入范围是60-18000'));
            }
        };
        var lunboChangeRange = (rule, value, callback) => {
            if (parseInt(value) >= 3 && parseInt(value) <= 10) {
                return callback();
            } else {
                return callback(new Error('输入范围是3-10'));
            }
        };
        var adNumRange = (rule, value, callback) => {
            if (parseInt(value) >= 1 && parseInt(value) <= 100) {
                return callback();
            } else {
                return callback(new Error('输入范围是1-100'));
            }
        };
        // 校验不能含有特殊字符
        var checkSpecialCode = (rule, value, callback) => {
            const reg = /[\!@#\$%\^&\*]+/g;
            if (reg.test(value)) {
                return callback(new Error('不能含有特殊字符'));
            } else {
                return callback();
            }
        };
        // 不能同时设置0秒和用户不能关闭广告
        var checkAddClose = (rule, value, callback) => {
            if ((value - 0 === 0) && (this.addForm.autoUserCloseType === '0')) {
                callback(new Error('不能同时设置0秒和用户不能关闭广告'));
            } else {
                callback();
            }
        };
        var checkEditClose = (rule, value, callback) => {
            if ((value - 0 === 0) && (this.editForm.autoUserCloseType === '0')) {
                callback(new Error('不能同时设置0秒和用户不能关闭广告'));
            } else {
                callback();
            }
        };
        var validateAdPosition = (rule, value, callback) => {
            const params = { adSenseCode: this.addForm.adSenseCode };
            adPositionIsExit({ params }).then(res => {
                if (res.result.errcode === '0004') {
                    callback(new Error('广告位code已存在'));
                } else {
                    callback();
                }
            });
        };
        return {
            pageId: '50101',
            // 搜索表单数据
            form: {
                pageNo: 1,
                pageSize: 20,
                adSenseName: '',
                cityId: '',
                adSenseType: '',
                status: ''
            },
            adPosTypeMenu: [],
            cityList: [],
            statusMenu: [],
            AppType: [],
            // 表格数据
            total: 0,
            tableData: [],
            multipleSelection: [],
            loading: true,
            // 对话框数据
            dialogAddVisible: false,
            dialogEditVisible: false,
            // 添加表单数据
            addForm: {
                updateInterval: '3600',
                appApplicationType: '',
                adSenseName: '',
                adSenseCode: '',
                adSenseType: '1',
                materielType: '1',
                autoCloseSecond: '3',
                carouselNumber: '5',
                carouselInterval: '3',
                autoUserCloseType: '1',
                adSenseWide: '',
                adSenseHigh: '',
                cityIds: ['0'],
                deliveryThreshold: '10',
                curPage: '',
                remark: '',
                adResourceId: ''
            },
            // 编辑表单数据
            editForm: {
                updateInterval: '',
                id: '',
                appApplicationType: '',
                adSenseName: '',
                adSenseCode: '',
                adSenseType: '',
                materielType: '',
                autoCloseSecond: '',
                carouselNumber: '',
                carouselInterval: '',
                autoUserCloseType: '',
                adSenseWide: '',
                adSenseHigh: '',
                cityIds: ['0'],
                deliveryThreshold: '',
                curPage: '',
                remark: '',
                adResourceId: ''
            },
            // 查询表单校验
            formRules: {
                adSenseName: [{ max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }]
            },
            addFormRules: {
                appApplicationType: [{ required: true, message: '请选择APP应用', trigger: 'blur' }],
                adSenseName: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }],
                adSenseCode: [{ required: true, message: '请输入广告位code', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: validateAdPosition, trigger: 'blur' }],
                adSenseType: [{ required: true, message: '请选择广告类型', trigger: 'blur' }],
                materielType: [{ required: true, message: '请选择物料类型', trigger: 'blur' }],
                autoCloseSecond: [{ required: true, message: '关闭设置不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: autoCloseRange, trigger: 'blur' }, { validator: checkAddClose, trigger: 'blur' }],
                carouselNumber: [{ required: true, message: '轮播数量不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: lunboNumRange, trigger: 'blur' }],
                carouselInterval: [{ required: true, message: '轮播间隔不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: lunboChangeRange, trigger: 'blur' }],
                adSenseWide: [{ required: true, message: '尺寸宽度不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }],
                adSenseHigh: [{ required: true, message: '尺寸高度不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }],
                cityIds: [{ required: true, message: '请选择支持城市', trigger: 'blur' }],
                deliveryThreshold: [{ required: true, message: '投放阈值不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: adNumRange, trigger: 'blur' }],
                updateInterval: [{ required: true, message: '更新间隔不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: updataTimeRange, trigger: 'blur' }]
            },
            editFormRules: {
                appApplicationType: [{ required: true, message: '请选择APP应用', trigger: 'blur' }],
                adSenseName: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: checkSpecialCode, trigger: 'blur' }],
                adSenseCode: [{ required: true, message: '请输入广告位code', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }, { validator: validateAdPosition, trigger: 'blur' }],
                adSenseType: [{ required: true, message: '请选择广告类型', trigger: 'blur' }],
                materielType: [{ required: true, message: '请选择物料类型', trigger: 'blur' }],
                autoCloseSecond: [{ required: true, message: '关闭设置不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: autoCloseRange, trigger: 'blur' }, { validator: checkEditClose, trigger: 'blur' }],
                carouselNumber: [{ required: true, message: '轮播数量不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: lunboNumRange, trigger: 'blur' }],
                carouselInterval: [{ required: true, message: '轮播间隔不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: lunboChangeRange, trigger: 'blur' }],
                adSenseWide: [{ required: true, message: '尺寸宽度不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }],
                adSenseHigh: [{ required: true, message: '尺寸高度不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }],
                cityIds: [{ required: true, message: '请选择支持城市', trigger: 'blur' }],
                deliveryThreshold: [{ required: true, message: '投放阈值不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: adNumRange, trigger: 'blur' }],
                updateInterval: [{ required: true, message: '更新间隔不能为空', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }, { validator: updataTimeRange, trigger: 'blur' }]
            },
            ids: [],
            test: {
                radio: '1',
                checked: true,
                input: 3
            },
            imageUrl: '',
            actionUrl: adPositionUploadUrl(),
            uploadHeaders: { Authorization: getToken() },
            // 城市checkbox
            isIndeterminate: true,
            isIndeterminate1: true,
            checkAddAll: false,
            checkEditAll: false,
            checkedCities: [],
            ifShowOff: false,
            ifShowOn: false
        };
    },
    created() {
        this.getAdPositionList();
        this.getMenusList('1042');
        this.getMenusList('1044');
        this.getMenusList('1041');
        this.getCityMenuList();
    },
    computed: {
        tableHeight() {
            if (this.tableData.length <= 5) {
                return 300;
            } else {
                return '';
            }
        },
        adSenseType() {
            return this.addForm.adSenseType;
        }
    },
    methods: {
        // 获取下拉框数据列表
        getMenusList(code) {
            const params = { code: code };
            getMenuList({ params }).then(res => {
                if (code === '1042') {
                    this.adPosTypeMenu = res.result;
                }
                if (code === '1044') {
                    this.statusMenu = res.result;
                }
                if (code === '1041') {
                    this.AppType = res.result;
                }
            });
        },
        // 获取城市下拉列表数据
        getCityMenuList() {
            const params = { level: '2' };
            getCityList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.cityList = res.result;
                    this.cityList.unshift({ id: null, code: null, label: null, status: null, sortNo: null, parentCode: null, children: [{ id: null, code: '0', label: '全国', status: '1', sortNo: null, parentCode: null, children: null }] });
                }
            });
        },
        // 查询
        adPositionSearchTerm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.getAdPositionList();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 查询清空
        formClear() {
            this.form = this.$options.data().form;
        },
        clearData(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddVisible = false;
            this.dialogEditVisible = false;
        },
        // dialog方法
        openAddModal() {
            this.dialogAddVisible = true;
            this.addForm.adResourceId = '';
            this.imageUrl = '';
        },
        openEditModal(row) {
            var ids = [];
            for (var j = 0; j < row.cityIds.length; j++) {
                ids.push(row.cityIds[j].cityId.toString());
            }
            this.dialogEditVisible = true;
            for (var key in this.editForm) {
                this.editForm[key] = row[key];
            }
            this.editForm.cityIds = ids;
            const baseUrl = process.env.BASE_API.substring(0, 17);
            if (row.adResourceId === null) {
                this.imageUrl = '';
            } else {
                this.imageUrl = baseUrl + row.resourcePath;
            }
        },
        changeCity() {
            if (this.addForm.cityIds.indexOf('0') === -1) {
                this.addForm.cityIds.unshift('0');
            }
            if (this.editForm.cityIds.indexOf('0') === -1) {
                this.editForm.cityIds.unshift('0');
            }
        },
        // 新增card
        submitAddForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addForm.autoCloseSecond = parseInt(this.addForm.autoCloseSecond);
                    this.addForm.carouselNumber = parseInt(this.addForm.carouselNumber);
                    this.addForm.carouselInterval = parseInt(this.addForm.carouselInterval);
                    this.addForm.adSenseWide = parseInt(this.addForm.adSenseWide);
                    this.addForm.adSenseHigh = parseInt(this.addForm.adSenseHigh);
                    this.addForm.deliveryThreshold = parseInt(this.addForm.deliveryThreshold);
                    this.addForm.updateInterval = parseInt(this.addForm.updateInterval);
                    var ids = [];
                    this.addForm.cityIds.forEach((ele, index) => {
                        ids[index] = ele;
                    });
                    ids.splice(0, 1);
                    var params = {};
                    for (var key in this.addForm) {
                        if (key === 'cityIds') {
                            params.cityIds = ids;
                        } else {
                            params[key] = this.addForm[key];
                        }
                    }
                    addAdPosition({ params }).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify.success({
                                title: '消息',
                                message: '添加成功',
                                duration: 800
                            });
                            this.clearData('addForm');
                            // this.form.pageNo = 1;
                            this.getAdPositionList();
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 编辑card
        submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editForm.autoCloseSecond = parseInt(this.editForm.autoCloseSecond);
                    this.editForm.carouselNumber = parseInt(this.editForm.carouselNumber);
                    this.editForm.carouselInterval = parseInt(this.editForm.carouselInterval);
                    this.editForm.adSenseWide = parseInt(this.editForm.adSenseWide);
                    this.editForm.adSenseHigh = parseInt(this.editForm.adSenseHigh);
                    this.editForm.deliveryThreshold = parseInt(this.editForm.deliveryThreshold);
                    this.editForm.updateInterval = parseInt(this.editForm.updateInterval);
                    var ids = [];
                    this.editForm.cityIds.forEach((ele, index) => {
                        ids[index] = ele;
                    });
                    ids.splice(0, 1);
                    var params = {};
                    for (var key in this.editForm) {
                        if (key === 'cityIds') {
                            params.cityIds = ids;
                        } else {
                            params[key] = this.editForm[key];
                        }
                    }
                    editAdPosition({ params }).then(res => {
                        if (res.errcode === '0000') {
                            this.$notify.success({
                                title: '消息',
                                message: '修改成功',
                                duration: 800
                            });
                            this.dialogEditVisible = false;
                            // this.form.pageNo = 1;
                            this.getAdPositionList();
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 启用
        beginUsing() {
            const params = { ids: this.ids };
            startUsing({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.$notify.success({
                        title: '消息',
                        message: '启用成功',
                        duration: 800
                    });
                    this.getAdPositionList();
                }
            });
        },
        // 停用
        stopUsing() {
            const params = { ids: this.ids };
            endUsing({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.$notify.success({
                        title: '消息',
                        message: '停用成功',
                        duration: 600
                    });
                    this.getAdPositionList();
                }
            });
        },
        // 弹出confirm框确认是否起禁用(1条)
        singleUseAble(flag, ids) {
            this.ids = [ids];
            this.$confirm(flag === 1 ? '确认启用该广告位吗' : '确认停用该广告位吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                if (flag === 1) {
                    this.beginUsing();
                } else {
                    this.stopUsing();
                }
            }).catch(() => {});
            var self = this;
            setTimeout(function() {
                self.openComfirmCallback();
            }, 100);
        },
        // 弹出confirm框确认是否起禁用(多条)
        mutiUseAble(flag) {
            if (this.multipleSelection && this.multipleSelection.length >= 1) {
                this.$confirm(flag === 1 ? '确认启用该广告位吗' : '确认停用该广告位吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {
                    if (flag === 1) {
                        this.beginUsing();
                    } else {
                        this.stopUsing();
                    }
                }).catch(() => {});
                var self = this;
                setTimeout(function() {
                    self.openComfirmCallback();
                }, 100);
            } else {
                this.$notify.warning({
                    title: '消息',
                    message: '请选择一条或多条数据',
                    duration: 800
                });
            }
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
        // 获取table列表
        getAdPositionList() {
            const params = this.form;
            queryAdPositionList({ params }).then(res => {
                if (res.errcode === '0000') {
                    this.tableData = res.result.rows;
                    this.loading = false;
                    this.total = res.result.totalCount;
                }
            });
        },
        // 分页
        currenChange(val) {
            this.form.pageNo = val;
            this.getAdPositionList();
        },
        sizeChange(val) {
            this.form.pageSize = val;
            this.getAdPositionList();
        },
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            this.addForm.adResourceId = res.resourceId;
            this.editForm.adResourceId = res.resourceId;
        },
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
        // 当前选中发生变化
        handleSelectionChange(val) {
            this.multipleSelection = val;
            var ifSameOff = this.multipleSelection.every(function(ele) {
                return ele.status === '0';
            });
            var ifSameOn = this.multipleSelection.every(function(ele) {
                return ele.status === '1';
            });
            ifSameOff ? this.ifShowOff = true : this.ifShowOff = false;
            ifSameOn ? this.ifShowOn = true : this.ifShowOn = false;
            if (this.multipleSelection.length === 0) {
                this.ifShowOff = false;
                this.ifShowOn = false;
            }
            this.ids = [];
            for (var i = 0; i < val.length; i++) {
                this.ids.push(val[i].id);
            }
        },
        shrinkQueryArea() {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = '185px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        }
    },
    watch: {
        adSenseType(newValue, oldValue) {
            this.addForm.autoCloseSecond = (newValue === '1' ? '3' : '0');
        }
    }
};
</script>

<style lang="scss">
    @import '../../styles/common.scss';
    .ad-position{
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
