import { 
	getMenuTreeApi,
	insertMenuApi,
	updateMenuApi,
	deleteBatchMenuApi,
	showBatchMenuApi,
	hideBatchMenuApi,
	validateMenuCodeApi,
	getBeanMenuApi
} from '../../api/menuManage';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
import { mapState, mapMutations } from 'vuex';

	export default {
		name: 'menuManage',
		mixins: [butVisibleMixin, publicMethod],
		data() {
			var validateInsertMenuCode = (rule, value, callback) => {
			  let menuCode = '';
		      let id = null;
		      menuCode = this.insertMenuInfo.menuCode;
		      
		      if (menuCode) {
		      	const params = {menuCode: menuCode, id: id || null};
		        validateMenuCodeApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback('菜单编号存在');
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
		    };
		    var validateUpdateMenuCode = (rule, value, callback) => {
			  let menuCode = '';
		      let id = null;
		      menuCode = this.updateMenuInfo.menuCode;
		      id = this.updateMenuInfo.id;
		      
		      if (menuCode) {
		      	const params = {menuCode: menuCode, id: id || null};
		        validateMenuCodeApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback('菜单编号存在');
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
		    };
			return{
				pageId: '208',
				menuCodeExist: false,
				addRules: {
					menuCode: [{ validator: validateInsertMenuCode, trigger: 'blur'}, { required: true, message: '请输入菜单编号', trigger: 'blur' },{ max: 20, message: '最多20个字符', trigger: 'blur' }],
					menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' },{ max: 100, message: '最多100个字符', trigger: 'blur' }],
					menuParentCode: [{ required: true, message: '请输入上级菜单编号', trigger: 'blur' },{ max: 20, message: '最多20个字符', trigger: 'blur' }],
					menuFlag: [{ required: true, message: '请输入是否菜单', trigger: 'blur' }],
					leafFlag: [{ required: true, message: '请输入是否子节点类型', trigger: 'blur' }],
					sortNo: [{ required: true, message: '请输入排序号'},
							{validator:(rule,value,callback)=>{
			                if(/^\d+$/.test(value) == false){
			                    callback(new Error("只能输入数字"));
			                }else if(value > 65535){
			                    callback(new Error("不得超过65535"));
			                }else{
			                    callback();
			                }
			            	}, trigger:'blur'}
			            	],
					url: [{ max: 200, message: '最多200个字符', trigger: 'blur' }],
					status: [{ required: true, message: '请输入是否启用', trigger: 'blur' }]
				},
				updateRules: {
					menuCode: [{ validator: validateUpdateMenuCode, trigger: 'blur'}, { required: true, message: '请输入菜单编号', trigger: 'blur' },{ max: 20, message: '最多20个字符', trigger: 'blur' }],
					menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' },{ max: 100, message: '最多100个字符', trigger: 'blur' }],
					menuParentCode: [{ required: true, message: '请输入上级菜单编号', trigger: 'blur' },{ max: 20, message: '最多20个字符', trigger: 'blur' }],
					menuFlag: [{ required: true, message: '请输入是否菜单', trigger: 'blur' }],
					leafFlag: [{ required: true, message: '请输入是否子节点类型', trigger: 'blur' }],
					sortNo: [{ required: true, message: '请输入排序号'},
							{validator:(rule,value,callback)=>{
			                if(/^\d+$/.test(value) == false){
			                    callback(new Error("只能输入数字"));
			                }else if(value > 65535){
			                    callback(new Error("不得超过65535"));
			                }else{
			                    callback();
			                }
			            	}, trigger:'blur'}
			            	],
					url: [{ max: 200, message: '最多200个字符', trigger: 'blur' }],
					status: [{ required: true, message: '请输入是否启用', trigger: 'blur' }]
				},
				treeDataView : [],
				filterText: '',
				defaultProps: {
		          children: 'children',
		          label: 'label'
		        },
		        dialogInsertVisible: false,
				dialogUpdateVisible: false,
				dialogDeleteVisible: false,
				dialogShowVisible: false,
				dialogHideVisible: false,
				menuInfo: {},
				insertMenuInfo: {},
				menuIdList: [],
				updateMenuInfo: {},
				checkedNodes: [],
				dialogVisibles: [
					'dialogInsertVisible'
				]
			}
		},
		created(){
			this.getTreeData(true);
		},
		methods: {
			...mapMutations({
			    addOpenModals: 'ADD_OPEN_MODALS',
			    removeOpenModals: 'REMOVE_OPEN_MODALS'
			}),
			//验证菜单编号是否存在
		    sendValidateMenuCode(type) {
		      let menuCode = '';
		      let id = null;
		      if (type === 'insert') {
		        menuCode = this.insertMenuInfo.menuCode;
		      } else {
		        menuCode = this.updateMenuInfo.menuCode;
		        id = this.updateMenuInfo.id;
		      }
		      if (menuCode) {
		      	const params = {menuCode: menuCode, id: id || null};
		        validateMenuCodeApi({ params }).then(res => {
		          if (res.result.isExist) {
		            this.menuCodeExist = true;
		          } else {
		            this.menuCodeExist = false;
		          }
		        });
		      } else {
		        this.menuCodeExist = false;
		      }

		    },
			closeInsert(){
				this.$refs["insertForm"].resetFields();
				this.dialogInsertVisible = false;
			},
			closeUpdate(){
				this.$refs["updateForm"].resetFields();
				this.dialogUpdateVisible = false;
			},
			insertMenuShow(){
		 		this.insertMenuInfo = {menuCode: '', menuName: '', menuParentCode: '', menuFlag: '', url: '', leafFlag: '', sortNo: '', status: ''};
		 		this.dialogInsertVisible = true;
		 	},
		 	insertMenu(){
		 		this.$refs.insertForm.validate((valid) => {
		 			if (valid) {
				 		const params = {menuCode: this.insertMenuInfo.menuCode || null, menuName: this.insertMenuInfo.menuName || null, 
				 			menuParentCode: this.insertMenuInfo.menuParentCode || null, menuFlag: this.insertMenuInfo.menuFlag || null,
				 			url: this.insertMenuInfo.url || null, leafFlag: this.insertMenuInfo.leafFlag || null, 
				 			sortNo: this.insertMenuInfo.sortNo || null, status: this.insertMenuInfo.status || null};
				 		insertMenuApi({ params }).then(res => {
					        if (res.errcode === '0000') {
						        this.alertSuccess("新增成功");
								this.dialogInsertVisible = false;
								this.getTreeData();
						    }else{
						    	this.alertFailed(res.errmsg);
						    }
						});
				 	}
				 });
		 	},
		 	updateMenuShow(){
		 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
					this.alertFailed("请选择数据");
				}else if(this.$refs.tree.getCheckedNodes().length > 1){
					this.alertFailed("只能选择一条数据");
				}else{
					this.checkedNodes = this.$refs.tree.getCheckedNodes();
					const params = { id: this.checkedNodes[0].id || null};
					getBeanMenuApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.updateMenuInfo = res.result;
							this.dialogUpdateVisible = true;
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
				}
		 	},
		 	updateMenu(){
		 		this.$refs.updateForm.validate((valid) => {
		 			if (valid) {
				 		const params = {id: this.updateMenuInfo.id || null, 
				 			menuCode: this.updateMenuInfo.menuCode || null, menuName: this.updateMenuInfo.menuName || null, 
				 			menuParentCode: this.updateMenuInfo.menuParentCode || null, menuFlag: this.updateMenuInfo.menuFlag || null,
				 			url: this.updateMenuInfo.url || null, leafFlag: this.updateMenuInfo.leafFlag || null, 
				 			sortNo: this.updateMenuInfo.sortNo || 0, status: this.updateMenuInfo.status || null};
				 		updateMenuApi({ params }).then(res => {
					        if (res.errcode === '0000') {
						        this.alertSuccess("修改成功");
						        this.updateMenuInfo = {};
								this.dialogUpdateVisible = false;
								this.getTreeData();
						    }else{
						    	this.alertFailed(res.errmsg);
						    }
						});
				 	}
				 });
		 	},
		 	deleteBatchMenuShow(){
		 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
					this.alertFailed("请选择数据");
				}else{
					this.$confirm('确认删除这些菜单？删除菜单会级联删除该菜单相关的用户、角色权限！', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',	
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.deleteBatchMenu();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
						self.openComfirmCallback();
					},100)
				}
		 	},
		 	deleteBatchMenu(){
				for(var i in this.$refs.tree.getCheckedNodes()){
					this.menuIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
				}
				const params = { idList: this.menuIdList || null};
				deleteBatchMenuApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.alertSuccess("删除成功");
				        this.menuIdList = [];
				        this.dialogDeleteVisible = false;
				        this.getTreeData();
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
		 	},
		 	showBatchMenuShow(){
		 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
					this.alertFailed("请选择数据");
				}else{
					this.$confirm('确认是否显示这些菜单？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.showBatchMenu();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
						self.openComfirmCallback();
					},100)
				}
		 	},
		 	showBatchMenu(){
		 		const tempArr = [];
		 		this.$refs.tree.getCheckedNodes().forEach(i => {
		 			tempArr.push(i.id);
		 			if (i.children && i.children.length > 0) {
		 				i.children.forEach(j => {
		 					tempArr.push(j.id);
		 				});
		 			}
		 		});
		 		this.$refs.tree.setCheckedKeys(tempArr);
		 		for(var i in this.$refs.tree.getCheckedNodes()){
					this.menuIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
				}
				const params = { idList: this.menuIdList || null};
				showBatchMenuApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.alertSuccess("显示成功");
				        this.dictIdList = [];
				        this.dialogShowVisible = false;
				        this.getTreeData();
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
		 	},
		 	hideBatchMenuShow(){
		 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
					this.alertFailed("请选择数据");
				}else{
					this.$confirm('确认是否隐藏这些菜单？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.hideBatchMenu();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
						self.openComfirmCallback();
					},100)
				}
		 	},
		 	hideBatchMenu(){
		 		const tempArr = [];
		 		this.$refs.tree.getCheckedNodes().forEach(i => {
		 			if (!i.disabled) {
		 				tempArr.push(i.id);
		 			} else {
		 				this.$notify({
					        title: '提示',
					        message: '不能隐藏',
					        type: 'warning',
					    	duration: 1000
					    });
					    this.stopHide = true;
					    return;
		 			}
		 			if (i.children && i.children.length > 0) {
		 				i.children.forEach(j => {
		 					if (!j.disabled) {
		 						tempArr.push(j.id);
		 					} else {
		 						this.$notify({
							        title: '提示',
							        message: '不能隐藏',
							        type: 'warning',
							    	duration: 1000
							    });
							    this.stopHide = true;
							    return;
		 					}
		 				});
		 			}
		 		});
		 		if (this.stopHide) return;
		 		this.$refs.tree.setCheckedKeys(tempArr);
		 		for(var i in this.$refs.tree.getCheckedNodes()){
					this.menuIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
				}
				const params = { idList: this.menuIdList || null};
				hideBatchMenuApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.alertSuccess("隐藏成功");
				        this.dictIdList = [];
				        this.dialogHideVisible = false;
				        this.getTreeData();
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
		 	},
			getTreeData(isFirst){
				const params = {status: null};
				getMenuTreeApi({ params }).then(res => {
					if (res.errcode === '0000') {
						this.treeDataView = res.result;
						this.$refs.tree.setCheckedKeys([]);
						if (isFirst) {
							const whichDialog = this.openModals.find(el => {
				            	return el.pageId === this.pageId;
				          	});
							if ( whichDialog && whichDialog.openModal === 'dialogInsertVisible') {
					            this.insertMenuInfo = whichDialog.data;
					            this[whichDialog.openModal] = true;
					         }
						}
						return res.result;
					}
				});
			},
			contracts(){
				console.log(this.$refs.tree.getCheckedKeys());
			},
			filterNode(value, data) {
		        if (!value) return true;
		        return data.label.indexOf(value) !== -1;
		     },
			alertSuccess(message){
				this.$notify({
			        title: '成功',
			        message: message,
			        type: 'success',
			    	duration: 1000
			    });
			},
			alertFailed(message){
				this.$notify({
			        title: '失败',
			        message: message,
			        type: 'warning',
			    	duration: 1000
			    });
			},
			renderContent(h, { node, data, store }) {
			if (data.status === '0') {
				return (
					<span style="color:#ccc;">{data.label}</span>
				)
			} else {
				return (
					<span>{data.label}</span>
				)
			}
			
		},
		//打开confirm后回掉
		openComfirmCallback(){
			$('.el-dialog__wrapper').css('left','0px');
			$('.v-modal').css('left','0px');
			$('.el-dialog__wrapper').css('top','0px');
			$('.v-modal').css('top','0px');
		}
		},
		watch: {
	      	filterText(val) {
	        	this.$refs.tree.filter(val);
	      	}
    	},
    	computed: {
			...mapState({
			    openModals: state => state.app.openModals
			})
		},
		beforeRouteLeave(to, from, next) {
			const dialogVisible = this.dialogVisibles.find(el => {
			    return this[el];
			});
		    var data;
		    if (dialogVisible) {
		      if (dialogVisible === this.dialogVisibles[0]) {
		        data = this.insertMenuInfo;
		      }
		      this.removeOpenModals({ pageId: this.pageId });
		      this.addOpenModals({ pageId: this.pageId, openModal: dialogVisible, data});
		    } else {
		      this.removeOpenModals({ pageId: this.pageId });
		    }
		    next();
		}
	}