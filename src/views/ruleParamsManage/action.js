	import { ruleParamListApi,
			 newAddRuleParamApi, 
			 modifyRuleParamApi,
			 deleteBatchRuleParamApi,
			 enableBatchRuleParamApi,
			 disableBatchRuleParamApi,
			 checkRuleParamApi,
			 validateVariableNameApi
	} from '../../api/sysRuleParamManage';
	import { getSelectList } from '../../api/userManage';
	import butVisibleMixin from '../../utils/buttonVisible';
	import publicMethod from '../../utils/publicMethod';	
	import { mapState, mapMutations } from 'vuex';
	const RULEPARAMTYPE = ['', '基础','用户','营销活动'];
	const RULEPARAMSTATUS = ['禁用', '启用'];

	export default {
		name: 'sysRuleParamManage',
		mixins: [butVisibleMixin, publicMethod],
		data() {
			var validateVariableName = (rule, value, callback) => {
		      if (this.variableNameExist) {
		        callback('变量名称存在');
		      } else {
		        callback();
		      }
		    };
			return {
				pageId: '204',
				//条件查询
				form: {
					paramName: '',
					variableName: '',
					paramType: '',
					status: ''
				},

				dialogNewAddVisible: false,
				dialogCheckVisible: false,
				dialogModifyVisible: false,
				dialogDeleteVisible: false,
				dialogEnabledVisible: false,
				dialogDisabledVisible: false,

				ruleParamIdList: [],
				totalRuleParams: 0,
				tableData: [],
				checkRuleParamInfoData: {
					paramType: '',
					paramName: '',
					variableName: '',
					remark: ''
				},
				modifyRuleParamInfoData: {
					paramType: '',
					paramName: '',
					variableName: '',
					remark: ''
				},
				multipleSelection: [],

				newAddRuleParam: {
					paramType: '',
					paramName: '',
					variableName: '',
					remark: ''
				},

				newAddRuleParamRules: {
			        paramType: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' },{ max: 1, message: '最长1个字符', trigger: 'blur' }],
			        paramName: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
			        variableName: [{ validator: validateVariableName, trigger: 'blur' },{ required: true, message: '请输入规则变量名称',  trigger: 'blur' },{ min: 1, max: 50, message: '最少1个字符最长50个字符', trigger: 'blur' }],
			    	remark: [{ min: 1,max: 50, message: '最长1个字符最长50个字符', trigger: 'blur' }]

			    },
			    checkRuleParamInfoDataRules: {
			        paramType: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' }],
			        paramName: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' }],
			        variableName: [{ required: true, message: '请输入规则变量名称',  trigger: 'blur' }]
			    },
			    modifyRuleParamInfoDataRules: {
			      	paramType: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' },{ max: 1, message: '最长1个字符', trigger: 'blur' }],
			        paramName: [{ required: true, message: '请输入规则参数名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
			        variableName: [{ validator: validateVariableName, trigger: 'blur' },{ required: true, message: '请输入规则变量名称',  trigger: 'blur' },{ min: 1, max: 50, message: '最少1个字符最长50个字符', trigger: 'blur' }],
			    	remark: [{ min: 1,max: 50, message: '最长1个字符最长50个字符', trigger: 'blur' }]
			    },
			    variableNameExist: false,
			    ruleParamsTypeList: [],
			    ruleParamsStateList: [],
			    dialogVisibles: [
			    	'dialogNewAddVisible',
			    	'dialogCheckVisible',
			    	'dialogModifyVisible',
			    	'dialogDeleteVisible',
			    	'dialogEnabledVisible',
			    	'dialogDisabledVisible'
			    ],
			    loading: true,
				noTableData: ' ',
				queryContainerShrink: false,
				pageSize: 20
			}
		},
		created() {
			this.getRuleParamList(undefined, true);
			this.getRuleParamsType();
			this.getRuleParamsState();
		},
		methods: {

			//验证规则参数变量名称是否存在
		    sendValidateVariableName(type) {
		      let name = '';
		      if (type === 'newAdd') {
		        name = this.newAddRuleParam.variableName;
		      } else {
		        name = this.modifyRuleParamInfoData.variableName;
		      }
		      if (name) {
		        validateVariableNameApi({ params: name }).then(res => {
		          if (res.result.isExist) {
		            this.variableNameExist = true;
		          } else {
		            this.variableNameExist = false;
		          }
		        });
		      } else {
		        this.variableNameExist = false;
		      }

		    },

			//添加规则参数
			handleNewAddRuleParam() {
				this.$refs.newAddRuleParam.validate((valid) => {
					if (valid) {
						const params = { paramType: this.newAddRuleParam.paramType, paramName: this.newAddRuleParam.paramName, variableName: this.newAddRuleParam.variableName, remark: this.newAddRuleParam.remark};
						newAddRuleParamApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '添加规则参数成功',
									type: 'success',
									duration: 1000
								});
								this.dialogNewAddVisible = false;
								this.getRuleParamList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});
					} else {
          				return false;
       				}
      			});
			},

			handleModifyRuleParam() {
				this.$refs.modifyRuleParamInfoData.validate((valid) => {
					if (valid) {
						const params = {id: this.modifyRuleParamInfoData.id,paramType: this.modifyRuleParamInfoData.paramType, paramName: this.modifyRuleParamInfoData.paramName, variableName: this.modifyRuleParamInfoData.variableName, remark: this.modifyRuleParamInfoData.remark};
						modifyRuleParamApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '修改规则参数成功',
									type: 'success',
									duration: 1000
								});
								this.dialogModifyVisible = false;
								this.getRuleParamList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});
					} else {
          				return false;
       				}
      			});
			},

			modifyRuleParamInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkRuleParamApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.modifyRuleParamInfoData = res.sysRuleParam;
							this.dialogModifyVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			deleteBatchRuleParamShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDeleteVisible = true;
				}
	 		},

			handleDeleteRuleParam() {
				for(var i in this.multipleSelection){
					this.ruleParamIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleParamIdList || null};
				deleteBatchRuleParamApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
		        		this.$notify({
							title: '成功',
							message: '删除规则参数成功',
							type: 'success',
							duration: 1000
						});
						this.ruleParamIdList = [];
						this.dialogDeleteVisible = false;
						this.getRuleParamList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},


			enableBatchRuleParamShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogEnabledVisible = true;
				}
	 		},

			handleEnableRuleParam() {
				for(var i in this.multipleSelection){
					this.ruleParamIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleParamIdList || null};
				enableBatchRuleParamApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
		        		this.$notify({
							title: '成功',
							message: '启用规则参数成功',
							type: 'success',
							duration: 1000
						});
						this.ruleParamIdList = [];
						this.dialogEnabledVisible = false;
						this.getRuleParamList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},
			

			disableBatchRuleParamShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDisabledVisible = true;
				}
	 		},

			handleDisableRuleParam() {
				for(var i in this.multipleSelection){
					this.ruleParamIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleParamIdList || null};
				disableBatchRuleParamApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
		        		this.$notify({
							title: '成功',
							message: '禁用规则参数成功',
							type: 'success',
							duration: 1000
						});
						this.ruleParamIdList = [];
						this.dialogDisabledVisible = false;
						this.getRuleParamList(this.currentPage);
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

			queryRuleParamList() {
				this.getRuleParamList();
			},

			getRuleParamList(pageNo, isFirst) {
				const currentPage = pageNo || 1;
				const params = { pageNo: currentPage, pageSize: this.pageSize, paramName: this.form.paramName || null, variableName: this.form.variableName || null, paramType: this.form.paramType || null, status: this.form.status || null }
				ruleParamListApi({ params }).then(res => {
					this.totalRuleParams = res.result.totalCount;
					this.tableData = res.result.rows.filter((item) => {
						item.paramType = RULEPARAMTYPE[item.paramType];
						item.status = RULEPARAMSTATUS[item.status];
						return item;
					});
					this.loading = false;
					if (isFirst) {
			          const whichDialog = this.openModals.find(el => {
			            return el.pageId === this.pageId;
			          });
			          if ( whichDialog && whichDialog.openModal === 'dialogNewAddVisible') {
			            this.newAddRuleParam = whichDialog.data;
			            this[whichDialog.openModal] = true;
			          } else if (whichDialog) {
			            this.$nextTick(() => {
			              whichDialog.data.forEach(row => {
			                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
			              });
			              if (whichDialog.openModal === 'dialogCheckVisible') {
			                this.checkRuleParamInfo();
			              } else if(whichDialog.openModal === 'dialogModifyVisible') {
			                this.modifyRuleParamInfo();
			              } else if(whichDialog.openModal === 'dialogDeleteVisible') {
			                this.deleteBatchRuleParamShow();
			              } else if(whichDialog.openModal === 'dialogEnabledVisible') {
			                this.enableBatchRuleParamShow();
			              } else if(whichDialog.openModal === 'dialogDisabledVisible') {
			                this.disableBatchRuleParamShow();
			              }
			            })
			          }
			        }
				});
			},


			checkRuleParamInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkRuleParamApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.checkRuleParamInfoData = res.sysRuleParam;
							this.dialogCheckVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getRuleParamList(val);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getRuleParamList(this.currentPage);
			},
			clearNewAdd() {
				for(let key in this.newAddRuleParam) {
					this.newAddRuleParam[key] = '';
				}
				this.$refs.newAddRuleParam.resetFields();
				this.variableNameExist = false;
			},

			clearModifyRuleParamInfoData(){
		    	this.$refs.modifyRuleParamInfoData.resetFields();
		    	this.resetVariableNameExist();
		    },

			//重置参数变量名是否存在flag
		    resetVariableNameExist() {
		      this.variableNameExist = false;
		    },


			getRuleParamsType() {
				getSelectList({ params: { code: '1018' } }).then(res => {
					if (res.errcode === '0000') {
						this.ruleParamsTypeList = res.result;
					}
				});
			},
			getRuleParamsState() {
				getSelectList({ params: { code: '1023' } }).then(res => {
					if (res.errcode === '0000') {
						this.ruleParamsStateList = res.result;
					}
				});
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
				//查询伸缩
				shrinkQueryArea() {
					if (this.queryContainerShrink) {
							this.$refs.queryContainer.style.height = '110px';
							this.queryContainerShrink = false;
					} else {
							this.$refs.queryContainer.style.height = '60px';
							this.queryContainerShrink = true;
					}
				},
		    ...mapMutations({
		      addOpenModals: 'ADD_OPEN_MODALS',
		      removeOpenModals: 'REMOVE_OPEN_MODALS'
		    })
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
		        data = this.newAddRuleParam;
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