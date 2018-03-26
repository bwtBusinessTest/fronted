	import { sysTemplateListApi,
			 newAddTemplateApi, 
			 modifyTemplateApi,
			 deleteBatchTemplateApi,
			 disableBatchTemplateApi,
			 enableBatchTemplateApi,
			 createTemplateApi,
			 previewApi,
			 validateTemplateNameApi,
			 checkTemplateApi
	} from '../../api/templateManage';
	import { getSelectList } from '../../api/userManage';
	import { mapState, mapMutations } from 'vuex';
	const TEMPLATESTATUS = ['未启用', '启用'];
	const TEMPLATECREATESTATUS = ['否', '是'];
	const TEMPLATETYPE = ['', '营销活动',"规则文件"];

	import UE from '../../components/ue/ue';
	import butVisibleMixin from '../../utils/buttonVisible';
	import publicMethod from '../../utils/publicMethod';	
	export default {
		name: 'templateManage',
		mixins: [butVisibleMixin, publicMethod],
		data() {
			var validateTemplateName = (rule, value, callback) => {
		      if (this.templateNameExist) {
		        callback('模板名称存在');
		      } else {
		        callback();
		      }
		    };
			return {
				pageId: '203',
				form: {
					templateType: '',
					templateName: '',
					templateState: ''
				},

				dialogNewAddVisible: false,
				dialogCheckVisible: false,
				dialogModifyVisible: false,
				dialogDeleteVisible: false,
				dialogCreateVisible: false,
				dialogPreviewVisible: false,
				dialogEnabledVisible: false,
				dialogDisabledVisible: false,

				templateIdList: [],
				tableData: [],
				checkTemplateInfoData: {
					templateType: '',
					templateName: '',
					templateContent: ''
				},
				modifyTemplateInfoData: {
					templateType: '',
					templateName: '',
					templateContent: ''
				},

				totalTemplates: 0,
				currentPage: 1,

				multipleSelection: [],
				templateNameExist: false,

				newAddTemplate: {
					templateType: '',
					templateName: '',
					templateContent: ''
				},

				defaultMsg: '',
				config: {
					initialFrameWidth: null,
					initialFrameHeight: 200
				},
				templateContent: "",
				ue1: 'ue1',
				ue2: 'ue2',
				ue3: 'ue3',
				
				
				newAddTemplateRules: {
			        templateType: [{ required: true, message: '请输入模板类型', trigger: 'blur' },{ max: 1, message: '最长1个字符', trigger: 'blur' }],
			        templateName: [{ validator: validateTemplateName, trigger: 'blur' }, { required: true, message: '请输入模板名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
					templateContent: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]

			    },
			    checkTemplateInfoDataRules: {
			        templateType: [{ required: true, message: '请输入模板类型', trigger: 'blur' }],
			        templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
			        templateContent: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
		
			    },
			    modifyTemplateInfoDataRules: {
			        templateType: [{ required: true, message: '请输入模板类型', trigger: 'blur' },{ max: 1, message: '最长1个字符', trigger: 'blur' }],
			        templateName: [{ validator: validateTemplateName, trigger: 'blur' },{ required: true, message: '请输入模板名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
			    	templateContent: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
			    },
			    templateTypeList: [],
			    templateStateList: [],
			    dialogVisibles: [
			    	'dialogNewAddVisible',
			    	'dialogCheckVisible',
			    	'dialogModifyVisible',
			    	'dialogDeleteVisible',
			    	'dialogCreateVisible',
			    	'dialogPreviewVisible',
			    	'dialogEnabledVisible',
			    	'dialogDisabledVisible'
			    ],
			    loading: true,
			    noTableData: ' ',
			    pageSize: 20
			}
		},

		created() {
			this.getTmplateList(undefined, true);
			this.getTemplateTypeList();
			this.getTemplateStateList();
		},
		methods: {
			clearContent(ref) {
	        	this.$refs[ref].clearContent();
	      	},

	      	hasContents(ref) {
	        	return this.$refs[ref].hasContents();
	      	},

	      	setUeDefaultMsg(ref) {
	        	this.$refs[ref].setUeDefaultMsg();
	      	},


	      	checkNewAddTemplateContentNull(){
			   if(this.newAddTemplate.ruleContent.length===0){
			   		this.$notify({
						title: '失败',
						message: '模板内容不能为空',
						type: 'warning',
						duration: 1000
					});
			   }
			},

			checkModifyTemplateContentNull(){
			   if(this.modifyTemplateInfoData.ruleContent.length===0){
			   		this.$notify({
						title: '失败',
						message: '模板内容不能为空',
						type: 'warning',
						duration: 1000
					});
			   }
			},

			//验证模板名称是否存在
		    sendValidateTemplateName(type) {
		      let name = '';
		      if (type === 'newAdd') {
		        name = this.newAddTemplate.templateName;
		      } else {
		        name = this.modifyTemplateInfoData.templateName;
		      }
		      if (name) {
		        validateTemplateNameApi({ params: name }).then(res => {
		          if (res.result.isExist) {
		            this.templateNameExist = true;
		          } else {
		            this.templateNameExist = false;
		          }
		        });
		      } else {
		        this.templateNameExist = false;
		      }

		    },

		    clearModifyTemplateInfoData(){
		    	this.$refs.modifyTemplateInfoData.resetFields();
		    	this.resetTemplateNameExist();
		    },

		    //重置模板名是否存在flag
		    resetTemplateNameExist() {
		      this.templateNameExist = false;
		    },

			getTemplateTypeList() {
				getSelectList({ params: { code: '1016' } }).then(res => {
					if (res.errcode === '0000') {
						this.templateTypeList = res.result;
					}
				});
			},
			getTemplateStateList() {
				getSelectList({ params: { code: '1020' } }).then(res => {
					if (res.errcode === '0000') {
						this.templateStateList = res.result;
					}
				});
			},

			handleNewAddTemplate() {
				this.$refs.newAddTemplate.validate((valid) => {
					if (valid) {
						const params = { templateType: this.newAddTemplate.templateType, templateName: this.newAddTemplate.templateName,templateContent: this.newAddTemplate.templateContent};
						newAddTemplateApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '添加模板成功',
									type: 'success',
									duration: 1000
								});
								this.dialogNewAddVisible = false;
								this.getTmplateList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});	
					} else {
          				return false;
       				}
      			});
			},

			// handleNewAddTemplate() {
			// 	// if (this.hasContents('ue1')===true){
			// 	// 	this.$notify({
			// 	// 		title: '失败',
			// 	// 		message: '模板内容不能为空',
			// 	// 		type: 'success',
			// 	// 		duration: 1000
			// 	// 	});
			// 	// }else{
			// 		const params = { templateType: this.newAddTemplate.templateType, templateName: this.newAddTemplate.templateName,templateContent: this.getUEContent('ue1')};
			// 		newAddTemplateApi({ params }).then(res => {
			// 			if (res.errcode === '0000') {
			// 				this.$notify({
			// 					title: '成功',
			// 					message: '添加模板成功',
			// 					type: 'success',
			// 					duration: 1000
			// 				});
			// 				this.dialogNewAddVisible = false;
			// 				this.getTmplateList(this.currentPage);
			// 			}else{
			// 				this.alertFailed(res.errmsg);
			// 			}
			// 		});
			// 	// }
			// },

			handleModifyTemplate() {
				this.$refs.modifyTemplateInfoData.validate((valid) => {
					if (valid) {
						const params = { id: this.modifyTemplateInfoData.id, templateType: this.modifyTemplateInfoData.templateType, templateName: this.modifyTemplateInfoData.templateName,templateContent: this.modifyTemplateInfoData.templateContent};
						modifyTemplateApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '修改模板成功',
									type: 'success',
									duration: 1000
								});
								this.dialogModifyVisible = false;
								this.getTmplateList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});
					} else {
          				return false;
       				}
      			});
			},

			// handleModifyTemplate() {
			// 	const params = { id: this.modifyTemplateInfoData.id, templateType: this.modifyTemplateInfoData.templateType, templateName: this.modifyTemplateInfoData.templateName,templateContent: this.getUEContent('ue3')};
			// 	modifyTemplateApi({ params }).then(res => {
			// 		if (res.errcode === '0000') {
			// 			this.$notify({
			// 				title: '成功',
			// 				message: '修改模板成功',
			// 				type: 'success',
			// 				duration: 1000
			// 			});
			// 			this.dialogModifyVisible = false;
			// 			this.getTmplateList(this.currentPage);
			// 		}else{
			// 			this.alertFailed(res.errmsg);
			// 		}
			// 	});
			// },

			modifyTemplateInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkTemplateApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.modifyTemplateInfoData = res.sysTemplate;
							this.dialogModifyVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			deleteBatchTemplateShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDeleteVisible = true;
				}
	 		},

			handleDeleteTemplate() {
				for(var i in this.multipleSelection){
					this.templateIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.templateIdList || null};
				deleteBatchTemplateApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
		        		this.$notify({
							title: '成功',
							message: '删除模板成功',
							type: 'success',
							duration: 1000
						});
						this.templateIdList = [];
						this.dialogDeleteVisible = false;
						this.getTmplateList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},

			enableBatchTemplateShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogEnabledVisible = true;
				}
	 		},

			handleEnableTemplate() {
				for(var i in this.multipleSelection){
					this.templateIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.templateIdList || null};
				enableBatchTemplateApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '启用模板成功',
							type: 'success',
							duration: 1000
						});
						this.templateIdList = [];
						this.dialogEnabledVisible = false;
						this.getTmplateList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},

			disableBatchTemplateShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDisabledVisible = true;
				}
	 		},

			handleDisableTemplate() {
				for(var i in this.multipleSelection){
					this.templateIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.templateIdList || null};
				disableBatchTemplateApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '禁用模板成功',
							type: 'success',
							duration: 1000
						});
						this.templateIdList = [];
						this.dialogDisabledVisible = false;
						this.getTmplateList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},

			createTemplateShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					this.dialogCreateVisible = true;
				}
	 		},

			handleCreateTemplate() {
				let id = this.multipleSelection[0].id ;
				createTemplateApi({ params: id }).then(res => {
					if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '生成模板成功',
							type: 'success',
							duration: 1000
						});
						this.dialogCreateVisible = false;
						this.getTmplateList(this.currentPage);
					}else{
						this.alertFailed(res.errmsg);
					}
				});
			},

			clearQueryParams() {
				for (let key in this.form) {
					this.form[key] = ''
				}
			},


			queryTemplateList() {
				this.getTmplateList();
			},

			getTmplateList(pageNo, isFirst) {
				const currentPage = pageNo || 1;
				const params = { pageNo: currentPage, templateType: this.form.templateType || null, templateName: this.form.templateName || null, enableStatus: this.form.templateState || null }
				sysTemplateListApi({ params }).then(res => {
					this.totalTemplates = res.result.totalCount; 
					this.tableData = res.result.rows.filter((item) => {
						//TODO 转化时间格式
						item.templateType = TEMPLATETYPE[item.templateType];
						item.createStatus = TEMPLATECREATESTATUS[item.createStatus];
						item.enableStatus = TEMPLATESTATUS[item.enableStatus];
						return item;
					});
					this.loading = false;
					if (isFirst) {
			          const whichDialog = this.openModals.find(el => {
			            return el.pageId === this.pageId;
			          });
			          if ( whichDialog && whichDialog.openModal === 'dialogNewAddVisible') {
			            this.newAddTemplate = whichDialog.data;
			            this[whichDialog.openModal] = true;
			          } else if (whichDialog) {
			            this.$nextTick(() => {
			              whichDialog.data.forEach(row => {
			                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
			              });
			              if (whichDialog.openModal === 'dialogCheckVisible') {
			                this.checkTemplateInfo();
			              } else if(whichDialog.openModal === 'dialogModifyVisible') {
			                this.modifyTemplateInfo();
			              } else if(whichDialog.openModal === 'dialogDeleteVisible') {
			                this.deleteBatchTemplateShow();
			              } else if(whichDialog.openModal === 'dialogCreateVisible') {
			                this.createTemplateShow();
			              } else if(whichDialog.openModal === 'dialogEnabledVisible') {
			                this.enableBatchTemplateShow();
			              } else if(whichDialog.openModal === 'dialogDisabledVisible') {
			                this.disableBatchTemplateShow();
			              } 
			            })
			          }
			        }
				});
			},


			checkTemplateInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkTemplateApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.checkTemplateInfoData = res.sysTemplate;
							this.dialogCheckVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			previewTemplateShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					this.dialogPreviewVisible = true;
				}
	 		},

			handlePreviewTemplate() {
				let id = this.multipleSelection[0].id ;
				previewApi({ params: id }).then(res => {
					 if (res.errcode === '0000') {
					 	this.dialogPreviewVisible = false;
						this.getTmplateList(this.currentPage);
						var preUrl=process.env.BASE_API;
						var microservice='/microservice-dist-provider';
						var isContains=RegExp(microservice).test(preUrl);
						if(isContains){
							preUrl=preUrl.replace(microservice,'');
						}
					 	open(preUrl+res.result);
					}else{
						this.alertFailed(res.errmsg);
					};
				});
			},	


			clearNewAdd() {
				for(let key in this.newAddTemplate) {
					this.newAddTemplate[key] = '';
				}
				this.$refs.newAddTemplate.resetFields();
				//this.clearContent('ue1');
				//this.setUeDefaultMsg('ue1');
				this.templateNameExist = false;
			},


			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTmplateList(val);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getTmplateList(this.currentPage);
			},
			getUEContent(ref) {
	        	let content = this.$refs[ref].getUEContent();
	     		return content;
	      	},

	      	showSelectDataMsg(){
		    	this.$notify({
		            title: '提示',
		            message: '请选择数据',
		            type: 'warning',
		        	duration: 1000
		        });
		    },
		    showSelectMoreDataMsg(){
		    	this.$notify({
		            title: '提示',
		            message: '只能选择一条数据',
		            type: 'warning',
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
		    ...mapMutations({
      			addOpenModals: 'ADD_OPEN_MODALS',
			    removeOpenModals: 'REMOVE_OPEN_MODALS'
			})
		},
		components: { UE },
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
		        data = this.newAddTemplate;
		      } else {
		        data = this.multipleSelection;
		      }
		      this.removeOpenModals({ pageId: this.pageId });
		      this.addOpenModals({ pageId: this.pageId, openModal: dialogVisible, data});
		    } else {
		      this.removeOpenModals({ pageId: this.pageId });
		    }
		    next();
		}
	}