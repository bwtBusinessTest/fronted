webpackJsonp([15],{"+tu9":function(e,t,i){"use strict";function o(e){i("YeM9")}Object.defineProperty(t,"__esModule",{value:!0});var a=i("Akrt"),l=i("EHeC"),n=i("VU/8"),r=o,s=n(a.a,l.a,r,null,null);t.default=s.exports},"2QJc":function(e,t,i){"use strict";(function(e){var o=i("Dd8w"),a=i.n(o),l=i("NYxO"),n={data:function(){return{scrollHeight:0,queryContainerShrink:!1}},computed:a()({},i.i(l.c)({isCollapse:function(e){return e.app.sidebar.opened}})),methods:{openNewAddModal:function(){var t=this;setTimeout(function(){t.isCollapse?document.querySelector(".v-modal")&&(document.querySelector(".v-modal").style.left="200px",e(".el-dialog__wrapper").css("left","200px")):(t.$nextTick(function(){document.querySelector(".v-modal").style.left="36px"}),document.querySelector(".v-modal")&&(document.querySelector(".v-modal").style.left="36px",e(".el-dialog__wrapper").css("left","36px"))),document.querySelector(".v-modal")&&(t.scrollHeight=e(document).scrollTop(),t.scrollHeight>=0&&t.scrollHeight<50?(document.querySelector(".v-modal").style.top=50-t.scrollHeight+"px",e(".el-dialog__wrapper").css("top",50-t.scrollHeight+"px")):(document.querySelector(".v-modal").style.top="0px",e(".el-dialog__wrapper").css("top","0px")))},100)},shrinkQueryArea:function(e){this.queryContainerShrink?(this.$refs.queryContainer.style.height=e+"px",this.queryContainerShrink=!1):(this.$refs.queryContainer.style.height="60px",this.queryContainerShrink=!0)}},watch:{isCollapse:function(t){document.querySelector(".v-modal")&&(t?(document.querySelector(".v-modal").style.left="200px",e(".el-dialog__wrapper").css("left","200px")):(document.querySelector(".v-modal").style.left="36px",e(".el-dialog__wrapper").css("left","36px")))}}};t.a=n}).call(t,i("7t+N"))},"9q5R":function(e,t,i){"use strict";(function(e){var o=i("Dd8w"),a=i.n(o),l=i("NYxO"),n={computed:a()({},i.i(l.b)(["buttonAuth"]),{buttonVisible:function(){var e=this,t={};return this.buttonAuth.forEach(function(i){i.menuParentCode===e.pageId&&(t[i.menuCode]=!0)}),t}}),mounted:function(){e(".el-dialog").draggable()}};t.a=n}).call(t,i("7t+N"))},Akrt:function(e,t,i){"use strict";var o=i("Dd8w"),a=i.n(o),l=i("uD/V"),n=i("NYxO"),r=i("9q5R"),s=i("2QJc");t.a={name:"roleManage",mixins:[r.a,s.a],data:function(){var e=this,t=function(t,i,o){e.roleNoExist?o("角色编号已存在"):o()},i=function(t,i,o){e.roleNameExist?o("角色名称已存在"):o()};return{addRoleRules:{roleNo:[{validator:t,trigger:"blur"},{required:!0,message:"请输入角色编号,最多20个字符",min:1,max:20,trigger:"blur"}],roleName:[{validator:i,trigger:"blur"},{required:!0,message:"请输入角色名称,最多20个字符",min:1,max:20,trigger:"blur"}],remark:[{required:!1,message:"备注最多50个字符",min:0,max:50,trigger:"blur"}]},modifyRoleRules:{roleNo:[{validator:t,trigger:"blur"},{required:!0,message:"请输入角色编号,最多20个字符",min:1,max:20,trigger:"blur"}],roleName:[{validator:i,trigger:"blur"},{required:!0,message:"请输入角色名称,最多20个字符",min:1,max:20,trigger:"blur"}],remark:[{required:!1,message:"备注最多50个字符",min:0,max:50,trigger:"blur"}]},queryCondition:{roleName:""},addRoleData:{roleNo:"",roleName:"",remark:""},modifyRoleData:{roleNo:"",roleName:"",remark:""},tableData:[],total:0,currentPage:1,pageSize:10,multipleSelection:[],roleNameExist:!1,roleNoExist:!1,dialogAddVisible:!1,dialogModifyVisible:!1,dialogDeleteVisible:!1,dialogRightDistributeVisible:!1,rightsModifyData:[],checkedKeysData:[],menuList:[],pageId:"202",dialogVisibles:["dialogAddVisible","dialogModifyVisible","dialogDeleteVisible","dialogRightDistributeVisible"],loading:!0,noTableData:" "}},created:function(){this.getRoleList(void 0,!0)},methods:a()({handleSelectionChange:function(e){this.multipleSelection=e},handleCurrentChange:function(e){this.currentPage=e,this.getRoleList(e)},clearAddModel:function(){this.$refs.addRoleForm.resetFields();for(var e in this.addRoleData)this.addRoleData[e]="";this.roleNameExist=!1,this.roleNoExist=!1},clearModifyModel:function(){this.$refs.modifyRoleForm.resetFields();for(var e in this.modifyRoleData)this.modifyRoleData[e]="";this.roleNameExist=!1,this.roleNoExist=!1},handleAddRole:function(){var e=this;this.$refs.addRoleForm.validate(function(t){if(!t)return!1;var o={roleNo:e.addRoleData.roleNo,roleName:e.addRoleData.roleName,remark:""==e.addRoleData.remark?null:e.addRoleData.remark};i.i(l.a)({params:o}).then(function(t){"0000"===t.errcode&&(e.$notify({title:"成功",message:"添加角色成功",type:"success",duration:1e3}),e.dialogAddVisible=!1,e.getRoleList(e.currentPage))})})},modifyRole:function(){this.multipleSelection.length<1?this.showSelectDataMsg():this.multipleSelection.length>1?this.showSelectMoreDataMsg():(this.modifyRoleData=a()({},this.multipleSelection[0]),this.dialogModifyVisible=!0)},handleModifyRole:function(){var e=this;this.$refs.modifyRoleForm.validate(function(t){if(!t)return!1;var o={id:e.modifyRoleData.id,roleNo:e.modifyRoleData.roleNo,roleName:e.modifyRoleData.roleName,remark:e.modifyRoleData.remark};i.i(l.b)({params:o}).then(function(t){"0000"===t.errcode&&(e.$notify({title:"成功",message:"修改角色成功",type:"success",duration:1e3}),e.dialogModifyVisible=!1,e.getRoleList(e.currentPage))})})},removeRole:function(){this.multipleSelection.length<1?this.showSelectDataMsg():this.multipleSelection.length>1?this.showSelectMoreDataMsg():this.dialogDeleteVisible=!0},handleRemoveRole:function(){var e=this;if(this.multipleSelection.length>0){var t=this.multipleSelection[0].id;if(1==t||2==t)return this.$notify({title:"提示",message:"基础角色，禁止删除",type:"warning",duration:1e3}),void(this.dialogDeleteVisible=!1);i.i(l.c)({params:t}).then(function(t){"0000"===t.errcode&&(e.$notify({title:"成功",message:"删除角色成功",type:"success",duration:1e3}),e.dialogDeleteVisible=!1,e.getRoleList(e.currentPage))})}else this.showSelectDataMsg()},getMenuPermission:function(){var e=this;if(this.multipleSelection.length<1)this.showSelectDataMsg();else if(this.multipleSelection.length>1)this.showSelectMoreDataMsg();else{var t=this.multipleSelection[0].id;i.i(l.d)({params:t}).then(function(t){"0000"===t.errcode&&(e.dialogRightDistributeVisible=!0,e.rightsModifyData=[],e.rightsModifyData[0]=t.result.menuTree,e.checkedKeysData=t.result.permissionIds,e.menuList=t.result.menuList,e.$nextTick(function(){this.$refs.permissionDialog.scrollTop=0,this.checkedMenu()}))})}},handleRightsModifyChange:function(e,t,i){},findMenuId:function(e){return this.menuList.filter(function(t){return t.code===e})[0].id},checkedMenu:function(){for(var e=0;e<this.menuList.length;e++)this.$refs.tree.setChecked(this.menuList[e].id,!1);for(var e=0;e<this.checkedKeysData.length;e++)this.$refs.tree.setChecked(this.checkedKeysData[e],!0)},handleSetPermission:function(){var e=this,t=this.multipleSelection[0].id,o=this.$refs.tree.getCheckedKeys().join(","),a={roleId:t,menuIds:o};i.i(l.e)({params:a}).then(function(t){"0000"===t.errcode&&(e.$notify({title:"成功",message:"权限分配成功",type:"success",duration:1e3}),e.dialogRightDistributeVisible=!1,e.getRoleList(e.currentPage))})},queryRoleList:function(){this.getRoleList()},handleSizeChange:function(e){this.pageSize=e,this.getRoleList(this.currentPage)},getRoleList:function(e,t){var o=this,a=e||1,n={pageNo:a,pageSize:this.pageSize,roleName:this.queryCondition.roleName||null};i.i(l.f)({params:n}).then(function(e){if(o.total=e.result.totalCount,o.tableData=e.result.rows,o.loading=!1,t){var i=o.openModals.find(function(e){return e.pageId===o.pageId});i&&"dialogAddVisible"===i.openModal?(o.addRoleData=i.data,o[i.openModal]=!0):i&&o.$nextTick(function(){i.data.forEach(function(e){o.$refs.multipleTable.toggleRowSelection(o.tableData.find(function(t){return t.id===e.id}))}),"dialogModifyVisible"===i.openModal?o.modifyRole():"dialogDeleteVisible"===i.openModal?o.removeRole():"dialogRightDistributeVisible"===i.openModal&&o.getMenuPermission()})}})},sendValidateRoleNo:function(e){var t=this,o="";if("newAdd"===e)o=this.addRoleData.roleNo;else if((o=this.modifyRoleData.roleNo)===this.multipleSelection[0].roleNo)return void(this.roleNoExist=!1);o?i.i(l.g)({params:o}).then(function(e){e.result.isExist?t.roleNoExist=!0:t.roleNoExist=!1}):this.roleNoExist=!1},sendValidateRoleName:function(e){var t=this,o="";if("newAdd"===e)o=this.addRoleData.roleName;else if((o=this.modifyRoleData.roleName)===this.multipleSelection[0].roleName)return void(this.roleNameExist=!1);o?i.i(l.h)({params:o}).then(function(e){e.result.isExist?t.roleNameExist=!0:t.roleNameExist=!1}):this.roleNameExist=!1},clearQueryParams:function(){for(var e in this.queryCondition)this.queryCondition[e]=""},showSelectDataMsg:function(){this.$notify({title:"提示",message:"请选择数据",type:"warning",duration:1e3})},showSelectMoreDataMsg:function(){this.$notify({title:"提示",message:"只能选择一条数据",type:"warning",duration:1e3})}},i.i(n.d)({addOpenModals:"ADD_OPEN_MODALS",removeOpenModals:"REMOVE_OPEN_MODALS"})),computed:a()({},i.i(n.c)({openModals:function(e){return e.app.openModals}})),beforeRouteLeave:function(e,t,i){var o,a=this,l=this.dialogVisibles.find(function(e){return a[e]});l?(o=l===this.dialogVisibles[0]?this.addRoleData:this.multipleSelection,this.removeOpenModals({pageId:this.pageId}),this.addOpenModals({pageId:this.pageId,openModal:l,data:o})):this.removeOpenModals({pageId:this.pageId}),i()}}},C2Na:function(e,t,i){t=e.exports=i("FZ+f")(!0),t.push([e.i,".query-container{padding:10px;box-shadow:0 0 4px #ccc;position:relative;overflow:hidden;transition:height .5s}.query-container .query-btn{position:absolute;right:40px;bottom:18px}.query-container .draggable{position:absolute;right:0;bottom:18px;width:30px;height:30px;padding-left:5px;line-height:30px;text-align:center;border:1px solid #ccc;opacity:.5;display:none;border-radius:50%}.query-container:hover .draggable{display:block}.manage-container{margin-top:20px;padding:10px;box-shadow:0 0 4px #ccc}.manage-container .el-dialog_wrapper{left:200px;top:50px}.el-button{width:88px}.el-table{margin-top:20px}.page-container{text-align:right;padding-top:10px}.page-container .el-pagination{padding-right:0}.reset-dialog-width .el-dialog{width:30%}.reset-dialog-width .el-dialog p{text-align:center}.el-dialog__body{margin:20px 0 5px;border-top:1px solid #ccc;border-bottom:1px solid #ccc}.v-modal{transition:all .1s;left:200px;top:50px}.svg-icon{margin-right:5px}.user-role-manage{margin:30px auto 0;width:1120px}.user-role-manage .manage-container .el-col{margin-right:30px}.user-role-manage .el-dialog__wrapper{top:50px;left:200px}","",{version:3,sources:["/Users/liwenhua/Documents/bwton/SourceCode/01.trunk/back-manage/src/views/userRoleManage/index.vue"],names:[],mappings:"AACA,iBACE,aAAc,AACd,wBAAyB,AACzB,kBAAmB,AACnB,gBAAiB,AACjB,qBAAuB,CACxB,AACD,4BACI,kBAAmB,AACnB,WAAY,AACZ,WAAa,CAChB,AACD,4BACI,kBAAmB,AACnB,QAAS,AACT,YAAa,AACb,WAAY,AACZ,YAAa,AACb,iBAAkB,AAClB,iBAAkB,AAClB,kBAAmB,AACnB,sBAAuB,AACvB,WAAa,AACb,aAAc,AACd,iBAAmB,CACtB,AACD,kCACI,aAAe,CAClB,AACD,kBACE,gBAAiB,AACjB,aAAc,AACd,uBAAyB,CAC1B,AACD,qCACI,WAAY,AACZ,QAAU,CACb,AACD,WACE,UAAY,CACb,AACD,UACE,eAAiB,CAClB,AACD,gBACE,iBAAkB,AAClB,gBAAkB,CACnB,AACD,+BACI,eAAiB,CACpB,AACD,+BACE,SAAW,CACZ,AACD,iCACI,iBAAmB,CACtB,AACD,iBACE,kBAAqB,AACrB,0BAA2B,AAC3B,4BAA8B,CAC/B,AACD,SACE,mBAAoB,AACpB,WAAY,AACZ,QAAU,CACX,AACD,UACE,gBAAkB,CACnB,AACD,kBACE,mBAAoB,AACpB,YAAc,CACf,AACD,4CACI,iBAAmB,CACtB,AACD,sCACI,SAAU,AACV,UAAY,CACf",file:"index.vue",sourcesContent:["\n.query-container {\n  padding: 10px;\n  box-shadow: 0 0 4px #ccc;\n  position: relative;\n  overflow: hidden;\n  transition: height .5s;\n}\n.query-container .query-btn {\n    position: absolute;\n    right: 40px;\n    bottom: 18px;\n}\n.query-container .draggable {\n    position: absolute;\n    right: 0;\n    bottom: 18px;\n    width: 30px;\n    height: 30px;\n    padding-left: 5px;\n    line-height: 30px;\n    text-align: center;\n    border: 1px solid #ccc;\n    opacity: 0.5;\n    display: none;\n    border-radius: 50%;\n}\n.query-container:hover .draggable {\n    display: block;\n}\n.manage-container {\n  margin-top: 20px;\n  padding: 10px;\n  box-shadow: 0 0 4px #ccc;\n}\n.manage-container .el-dialog_wrapper {\n    left: 200px;\n    top: 50px;\n}\n.el-button {\n  width: 88px;\n}\n.el-table {\n  margin-top: 20px;\n}\n.page-container {\n  text-align: right;\n  padding-top: 10px;\n}\n.page-container .el-pagination {\n    padding-right: 0;\n}\n.reset-dialog-width .el-dialog {\n  width: 30%;\n}\n.reset-dialog-width .el-dialog p {\n    text-align: center;\n}\n.el-dialog__body {\n  margin: 20px 0 5px 0;\n  border-top: 1px solid #ccc;\n  border-bottom: 1px solid #ccc;\n}\n.v-modal {\n  transition: all .1s;\n  left: 200px;\n  top: 50px;\n}\n.svg-icon {\n  margin-right: 5px;\n}\n.user-role-manage {\n  margin: 30px auto 0;\n  width: 1120px;\n}\n.user-role-manage .manage-container .el-col {\n    margin-right: 30px;\n}\n.user-role-manage .el-dialog__wrapper {\n    top: 50px;\n    left: 200px;\n}\n"],sourceRoot:""}])},EHeC:function(e,t,i){"use strict";var o=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"user-role-manage"},[i("div",{staticClass:"query-container"},[i("el-form",{attrs:{model:e.queryCondition,inline:!0}},[i("el-form-item",{attrs:{label:"角色名称"}},[i("el-input",{attrs:{size:"small"},model:{value:e.queryCondition.roleName,callback:function(t){e.queryCondition.roleName=t},expression:"queryCondition.roleName"}})],1)],1),e._v(" "),i("el-row",{attrs:{type:"flex",justify:"end"}},[e.buttonVisible[20201]?i("el-col",{attrs:{span:3}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"delete"},on:{click:e.clearQueryParams}},[e._v("清空")])],1):e._e(),e._v(" "),e.buttonVisible[20202]?i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"search"},on:{click:e.queryRoleList}},[e._v("查询")])],1):e._e()],1)],1),e._v(" "),i("div",{staticClass:"manage-container"},[i("el-row",{attrs:{type:"flex",justify:"start"}},[e.buttonVisible[20203]?i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"plus"},on:{click:function(t){e.dialogAddVisible=!0}}},[e._v("新增")])],1):e._e(),e._v(" "),e.buttonVisible[20204]?i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"edit"},on:{click:e.modifyRole}},[e._v("修改")])],1):e._e(),e._v(" "),e.buttonVisible[20205]?i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"delete"},on:{click:e.removeRole}},[e._v("删除")])],1):e._e(),e._v(" "),e.buttonVisible[20206]?i("el-col",{attrs:{span:2}},[i("el-button",{attrs:{size:"small",type:"primary",icon:"minus"},on:{click:e.getMenuPermission}},[e._v("权限分配")])],1):e._e()],1),e._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"multipleTable",attrs:{data:e.tableData,border:"","element-loading-text":"拼命加载中","empty-text":e.noTableData},on:{"selection-change":e.handleSelectionChange}},[i("el-table-column",{attrs:{type:"selection"}}),e._v(" "),i("el-table-column",{attrs:{label:"角色编号",prop:"roleNo"}}),e._v(" "),i("el-table-column",{attrs:{label:"角色名称",prop:"roleName"}}),e._v(" "),i("el-table-column",{attrs:{label:"备注",prop:"remark"}})],1),e._v(" "),i("div",{staticClass:"page-container"},[i("el-pagination",{attrs:{layout:"total, sizes, prev, pager, next, jumper",total:e.total,"page-size":e.pageSize,"page-sizes":[10,20,30]},on:{"current-change":e.handleCurrentChange,"size-change":e.handleSizeChange}})],1)],1),e._v(" "),i("el-dialog",{attrs:{title:"新增角色",visible:e.dialogAddVisible,"close-on-click-modal":!1},on:{close:e.clearAddModel,"update:visible":function(t){e.dialogAddVisible=t},open:e.openNewAddModal}},[i("el-form",{ref:"addRoleForm",attrs:{inline:!0,model:e.addRoleData,rules:e.addRoleRules,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"角色编号",prop:"roleNo"}},[i("el-input",{on:{input:function(t){e.sendValidateRoleNo("newAdd")}},model:{value:e.addRoleData.roleNo,callback:function(t){e.addRoleData.roleNo=t},expression:"addRoleData.roleNo"}})],1),e._v(" "),i("el-form-item",{staticClass:"polish",attrs:{label:"角色名称",prop:"roleName"}},[i("el-input",{on:{input:function(t){e.sendValidateRoleName("newAdd")}},model:{value:e.addRoleData.roleName,callback:function(t){e.addRoleData.roleName=t},expression:"addRoleData.roleName"}})],1),e._v(" "),i("el-form-item",{staticClass:"polish",attrs:{label:"备注",prop:"remark"}},[i("el-input",{model:{value:e.addRoleData.remark,callback:function(t){e.addRoleData.remark=t},expression:"addRoleData.remark"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.handleAddRole}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:function(t){e.dialogAddVisible=!1}}},[e._v("取 消")])],1)],1),e._v(" "),i("el-dialog",{attrs:{title:"修改角色",visible:e.dialogModifyVisible,"close-on-click-modal":!1},on:{close:e.clearModifyModel,"update:visible":function(t){e.dialogModifyVisible=t},open:e.openNewAddModal}},[i("el-form",{ref:"modifyRoleForm",attrs:{inline:!0,model:e.modifyRoleData,rules:e.modifyRoleRules,"label-width":"80px"}},[i("el-form-item",{attrs:{label:"角色编号",prop:"roleNo"}},[i("el-input",{on:{input:function(t){e.sendValidateRoleNo("modify")}},model:{value:e.modifyRoleData.roleNo,callback:function(t){e.modifyRoleData.roleNo=t},expression:"modifyRoleData.roleNo"}})],1),e._v(" "),i("el-form-item",{staticClass:"polish",attrs:{label:"角色名称",prop:"roleName"}},[i("el-input",{on:{input:function(t){e.sendValidateRoleName("modify")}},model:{value:e.modifyRoleData.roleName,callback:function(t){e.modifyRoleData.roleName=t},expression:"modifyRoleData.roleName"}})],1),e._v(" "),i("el-form-item",{staticClass:"polish",attrs:{label:"备注",prop:"remark"}},[i("el-input",{model:{value:e.modifyRoleData.remark,callback:function(t){e.modifyRoleData.remark=t},expression:"modifyRoleData.remark"}})],1)],1),e._v(" "),i("div",{staticClass:"dialog-footer",slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.handleModifyRole}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:function(t){e.dialogModifyVisible=!1}}},[e._v("取 消")])],1)],1),e._v(" "),i("el-dialog",{staticClass:"reset-dialog-width",attrs:{title:"删除角色",visible:e.dialogDeleteVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogDeleteVisible=t},open:e.openNewAddModal}},[i("div",{staticClass:"el-message-box__status el-icon-warning"}),i("p",{staticStyle:{"padding-left":"50px"}},[e._v("确认删除角色？删除角色会级联删除相关的用户权限！")]),e._v(" "),i("div",{staticClass:"dialog-footer",slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.handleRemoveRole}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:function(t){e.dialogDeleteVisible=!1}}},[e._v("取 消")])],1)]),e._v(" "),i("el-dialog",{attrs:{title:"权限分配",visible:e.dialogRightDistributeVisible,"close-on-click-modal":!1},on:{"update:visible":function(t){e.dialogRightDistributeVisible=t},open:e.openNewAddModal}},[i("div",{ref:"permissionDialog",staticStyle:{height:"460px","overflow-y":"auto"}},[i("el-tree",{ref:"tree",attrs:{data:e.rightsModifyData,"show-checkbox":"","node-key":"id","default-expand-all":!0,"default-checked-keys":e.checkedKeysData},on:{"check-change":e.handleRightsModifyChange}})],1),e._v(" "),i("div",{staticClass:"dialog-footer",slot:"footer"},[i("el-button",{attrs:{type:"primary"},on:{click:e.handleSetPermission}},[e._v("确 定")]),e._v(" "),i("el-button",{on:{click:function(t){e.dialogRightDistributeVisible=!1}}},[e._v("取 消")])],1)])],1)},a=[],l={render:o,staticRenderFns:a};t.a=l},YeM9:function(e,t,i){var o=i("C2Na");"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);i("rjj0")("0c36b9fc",o,!0)},"uD/V":function(e,t,i){"use strict";function o(e){var t=e.params;return i.i(u.a)({url:"/role/list",method:"post",data:t})}function a(e){var t=e.params;return i.i(u.a)({url:"role/add",method:"post",data:t})}function l(e){var t=e.params;return i.i(u.a)({url:"role/existNo/"+t,method:"get"})}function n(e){var t=e.params;return i.i(u.a)({url:"role/existName/"+t,method:"get"})}function r(e){var t=e.params;return i.i(u.a)({url:"role/modify",method:"post",data:t})}function s(e){var t=e.params;return i.i(u.a)({url:"role/remove/"+t,method:"get"})}function d(e){var t=e.params;return i.i(u.a)({url:"role/menu/"+t,method:"get"})}function c(e){var t=e.params;return i.i(u.a)({url:"role/setPermission",method:"post",data:t})}t.f=o,t.a=a,t.g=l,t.h=n,t.b=r,t.c=s,t.d=d,t.e=c;var u=i("Vo7i")}});
//# sourceMappingURL=15.6ac651270f2fbfc47934.js.map