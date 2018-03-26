	import { ruleListApi,
			 newAddRuleApi, 
			 modifyRuleApi,
			 deleteBatchRuleApi,
			 disableBatchRuleApi,
			 enableBatchRuleApi,
			 generateRuleJsApi,
			 viewJsApi,
			 testJsApi,
			 checkRuleApi,
			 validateFunctionNameApi
	} from '../../api/sysRuleManage';

	const RULECREATESTATUS = ['否', '是'];
	const RULESTATUS = ['未启用', '启用'];

	import UE from '../../components/ue/ue'
	import { mapState, mapMutations } from 'vuex';
	import butVisibleMixin from '../../utils/buttonVisible';
	import { getSelectList } from '../../api/userManage';
	import publicMethod from '../../utils/publicMethod';	
	export default {
		name: 'sysRuleParamManage',
		mixins: [butVisibleMixin,publicMethod],
		data() {
			var validateFunctionName = (rule, value, callback) => {
		      if (this.functionNameExist) {
		        callback('规则函数名称存在');
		      } else {
		        callback();
		      }
		    };
			return {
				pageId: '205',
				//条件查询
				form: {
					ruleName: '',
					enableStatus: ''
				},

				dialogNewAddVisible: false,
				dialogCheckVisible: false,
				dialogModifyVisible: false,
				dialogDeleteVisible: false,
				dialogEnabledVisible: false,
				dialogDisabledVisible: false,
				dialogGenerateJsVisible: false,
				dialogViewJsVisible: false,
				dialogJsTestVisible: false,

				ruleIdList: [],
				functionNameExist: false,
				totalRules: 0,
				tableData: [],
				viewJsData: {},
				jsTestData: { response: undefined },
				checkRuleInfoData: {},
				modifyRuleInfoData: {},
				newAddRuleInfoData: {
					ruleName: '',
					functionName: '',
					sysFunctionInParamDtos: [
						{ id: '', ruleId: '', paramType: '', paramName: '' }
					],
					ruleContent: ''
				},

				multipleSelection: [],
				defaultMsg: '请填写规则内容',
				config: {
					initialFrameWidth: null,
					initialFrameHeight: 200
				},
				ruleContent: '',
				ue1: 'ue1',
				ue2: 'ue2',
				ue3: 'ue3',
				ue4: 'ue4',
				ue5: 'ue5',

				newAddRuleInfoDataRules: {
			        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
			        functionName: [{ validator: validateFunctionName, trigger: 'blur' },{ required: true, message: '请输入规则函数名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
					ruleContent: [{ required: true, message: '请输入规则内容', trigger: 'blur' }]
			    },
			    checkRuleInfoDataRules: {
			        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
			        functionName: [{ required: true, message: '请输入规则函数名称', trigger: 'blur' }],
			        ruleContent: [{ required: true, message: '请输入规则名称', trigger: 'blur' }]

			    },
			    modifyRuleInfoDataRules: {
			        ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
			        functionName: [{ validator: validateFunctionName, trigger: 'blur' },{ required: true, message: '请输入规则函数名称', trigger: 'blur' },{ min: 1, max: 100, message: '最少1个字符最长100个字符', trigger: 'blur' }],
					ruleContent: [{ required: true, message: '请输入规则内容', trigger: 'blur' }]

			    },
			    ruleStateList: [],
			    functionInParamTypeList: [],
			    dialogVisibles: [
			    	'dialogNewAddVisible',
			    	'dialogCheckVisible',
			    	'dialogModifyVisible',
			    	'dialogDeleteVisible',
			    	'dialogEnabledVisible',
			    	'dialogDisabledVisible',
			    	'dialogGenerateJsVisible',
			    	'dialogViewJsVisible',
			    	'dialogJsTestVisible'
			    ],
			    loading: true,
			    noTableData: ' ',
			    pageSize: 20,
			}
		},
		created() {
			this.getRuleList(undefined, true);
			this.getRuleStateList();
			this.getFunctionInParamTypeList();
		},

		methods: {
			...mapMutations({
		      addOpenModals: 'ADD_OPEN_MODALS',
		      removeOpenModals: 'REMOVE_OPEN_MODALS'
		    }),
			checkNewAddRuleContentNull(){
			   if(this.newAddRuleInfoData.ruleContent.length===0){
			   		this.$notify({
						title: '失败',
						message: '规则内容不能为空',
						type: 'warning',
						duration: 1000
					});
			   }
			},

			checkModifyRuleContentNull(){
			   if(this.modifyRuleInfoData.ruleContent.length===0){
			   		this.$notify({
						title: '失败',
						message: '规则内容不能为空',
						type: 'warning',
						duration: 1000
					});
			   }
			},

			//验证规则函数名称是否存在
		    sendValidateFunctionName(type) {
		      let name = '';
		      if (type === 'newAdd') {
		        name = this.newAddRuleInfoData.functionName;
		      } else {
		        name = this.modifyRuleInfoData.functionName;
		      }
		      if (name) {
		        validateFunctionNameApi({ params: name }).then(res => {
		          if (res.result.isExist) {
		            this.functionNameExist = true;
		          } else {
		            this.functionNameExist = false;
		          }
		        });
		      } else {
		        this.functionNameExist = false;
		      }

		    },

			queryRuleList() {
				this.getRuleList();
			},

			getRuleList(pageNo, isFirst) {
				const currentPage = pageNo || 1;
				const params = { pageNo: currentPage, pageSize: this.pageSize, ruleName: this.form.ruleName || null, enableStatus: this.form.enableStatus || null}
				ruleListApi({ params }).then(res => {
					this.totalRules = res.result.totalCount;
					this.tableData = res.result.rows.filter((item) => {
						item.createStatus = RULECREATESTATUS[item.createStatus];
						item.enableStatus = RULESTATUS[item.enableStatus];
						return item;
					});
					this.loading = false;
					if (isFirst) {
			          const whichDialog = this.openModals.find(el => {
			            return el.pageId === this.pageId;
			          });
			          if ( whichDialog && whichDialog.openModal === 'dialogNewAddVisible') {
			            this.newAddRuleInfoData = whichDialog.data;
			            this[whichDialog.openModal] = true;
			          } else if (whichDialog) {
			            this.$nextTick(() => {
			              whichDialog.data.forEach(row => {
			                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
			              });
			              if (whichDialog.openModal === 'dialogCheckVisible') {
			                this.checkRuleInfo();
			              } else if(whichDialog.openModal === 'dialogModifyVisible') {
			                this.modifyRuleInfo();
			              } else if(whichDialog.openModal === 'dialogDeleteVisible') {
			                this.deleteBatchRuleShow();
			              } else if(whichDialog.openModal === 'dialogGenerateJsVisible') {
			                this.generateRuleJsShow();
			              } else if(whichDialog.openModal === 'dialogViewJsVisible') {
			                this.viewJs();
			              } else if (whichDialog.openModal === 'dialogJsTestVisible') {
			              	this.jsTest();
			              } else if (whichDialog.openModal === 'dialogEnabledVisible') {
			              	this.enableBatchRuleShow()
			              } else if (whichDialog.openModal === 'dialogDisabledVisible') {
			              	this.disableBatchRuleShow();
			              }
			            })
			          }
			        }
				});
			},


			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.getRuleList(val);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getRuleList(this.currentPage);
			},
			clearNewAdd() {
				for(let key in this.newAddRuleInfoData) {
					if (key === 'sysFunctionInParamDtos') {
						this.newAddRuleInfoData[key].map((item) => {
							item.id = '';
							item.ruleId = '';
							item.paramType = '';
							item.paramName = '';
						});
					} else {
						this.newAddRuleInfoData[key] = '';
					}
				}
				this.$refs.newAddRuleInfoData.resetFields();
				this.functionNameExist = false;
			},

			clearModifyRuleInfoData(){
		    	this.$refs.modifyRuleInfoData.resetFields();
		    	this.resetFunctionNameExist();
		    },

		    clearJsTest() {
		    	this.jsTestData.inParam='';
		    	this.jsTestData.response='';
				this.functionNameExist = false;
			},

			//重置规则函数名称是否存在flag
		    resetFunctionNameExist() {
		      this.functionNameExist = false;
		    },
		
			handleNewAddRule() {
				this.$refs.newAddRuleInfoData.validate((valid) => {
					if (valid) {
						const params = { ruleName: this.newAddRuleInfoData.ruleName, functionName: this.newAddRuleInfoData.functionName,sysFunctionInParamDtos: this.newAddRuleInfoData.sysFunctionInParamDtos, ruleContent: this.newAddRuleInfoData.ruleContent};
						newAddRuleApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '添加规则成功',
									type: 'success',
									duration: 1000
								});
								this.dialogNewAddVisible = false;
								this.getRuleList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});
					} else {
          				return false;
       				}
      			});
			},



			handleModifyRule() {
				this.$refs.modifyRuleInfoData.validate((valid) => {
					if (valid) {
						const params = { id: this.modifyRuleInfoData.id, ruleName: this.modifyRuleInfoData.ruleName, functionName: this.modifyRuleInfoData.functionName,sysFunctionInParamDtos: this.modifyRuleInfoData.sysFunctionInParamDtos, ruleContent: this.modifyRuleInfoData.ruleContent};
						modifyRuleApi({ params }).then(res => {
							if (res.errcode === '0000') {
								this.$notify({
									title: '成功',
									message: '修改规则成功',
									type: 'success',
									duration: 1000
								});
								this.dialogModifyVisible = false;
								this.getRuleList(this.currentPage);
							}else{
								this.alertFailed(res.errmsg);
							}
						});
					} else {
          				return false;
       				}
      			});
			},

			modifyRuleInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkRuleApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.modifyRuleInfoData = res.sysRuleDto;
							if (this.modifyRuleInfoData.sysFunctionInParamDtos.length === 0) {
								this.modifyRuleInfoData.sysFunctionInParamDtos.push({ paramType: '', paramName: '' });
							}
							this.dialogModifyVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			checkRuleInfo() {
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkRuleApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.checkRuleInfoData = res.sysRuleDto;
							if (this.checkRuleInfoData.sysFunctionInParamDtos.length === 0) {
								this.checkRuleInfoData.sysFunctionInParamDtos.push({ paramType: '', paramName: '' });
							}
							this.dialogCheckVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			//打开测试弹窗，并引入对应js文件
			jsTest(){
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					checkRuleApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.jsTestData = Object.assign(this.jsTestData, res.sysRuleDto);
							if (this.jsTestData.sysFunctionInParamDtos.length === 0) {
								this.jsTestData.sysFunctionInParamDtos.push({ paramType: '', paramName: '' });
							}
							this.script=document.createElement("script"); //创建script标签
							this.script.type="text/javascript";
							this.script.role="reload";
							this.script.src=process.env.BASE_API+"/static/rule/"+res.sysRuleDto.createRuleName;//将js文件路径赋给src，引入js文件
							//document.getElementsByTagName("head")[0].appendChild(this.script);
							this.dialogJsTestVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
					});
				}
			},

			test(){
				document.getElementsByTagName("head")[0].appendChild(this.script);
				let id = this.jsTestData.id ;
				viewJsApi({ params: id }).then(res => {
					if (res.errcode === '0000') {
						var fileRuleContent=res.result.ruleContent;
						try{
							eval(fileRuleContent+this.jsTestData.functionName+"("+this.jsTestData.inParam+")");
							this.jsTestData.response ='执行顺利';
						}catch(e){
							this.jsTestData.response ='执行错误:'+e;
						}
					}else{
						this.alertFailed(res.errmsg);
					}
				});
			},

			//点击测试，调后台测试js接口
			// test(){
			// 	let id = this.jsTestData.id ;
			// 	testJsApi({ params: id }).then(res => {
			// 		if (res.errcode === '0000') {
			// 			this.jsTestData.response = res.result; 
			// 			//this.dialogJsTestVisible = false;
			// 			//this.getRuleList(this.currentPage);
			// 		}else{
			// 			this.alertFailed(res.errmsg);
			// 		}
					
			// 	});
			// },


			deleteBatchRuleShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDeleteVisible = true;
				}
	 		},

			handleDeleteRule() {
				for(var i in this.multipleSelection){
					this.ruleIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleIdList || null};
				deleteBatchRuleApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '删除规则成功',
							type: 'success',
							duration: 1000
						});
						this.ruleIdList = [];
						this.dialogDeleteVisible = false;
						this.getRuleList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			},
			
			enableBatchRuleShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogEnabledVisible = true;
				}
	 		},

			handleEnableRule() {
				for(var i in this.multipleSelection){
					this.ruleIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleIdList || null};
				enableBatchRuleApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '启用规则成功',
							type: 'success',
							duration: 1000
						});
						this.ruleIdList = [];
						this.dialogEnabledVisible = false;
						this.getRuleList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
					
			},

			disableBatchRuleShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else{
					this.dialogDisabledVisible = true;
				}
	 		},

			handleDisableRule() {
				for(var i in this.multipleSelection){
					this.ruleIdList.push(this.multipleSelection[i].id);
				}
				const params = { idList: this.ruleIdList || null};
				disableBatchRuleApi({ params }).then(res => {
		        	if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '禁用规则成功',
							type: 'success',
							duration: 1000
						});
						this.ruleIdList = [];
						this.dialogDisabledVisible = false;
						this.getRuleList(this.currentPage);
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
					
			},

			generateRuleJsShow(){
	 			if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					this.dialogGenerateJsVisible = true;
				}
	 		},

			handleGenerateRuleJs(){
				let id = this.multipleSelection[0].id ;
				generateRuleJsApi({ params: id }).then(res => {
					if (res.errcode === '0000') {
						this.$notify({
							title: '成功',
							message: '生成规则成功',
							type: 'success',
							duration: 1000
						});
						this.dialogGenerateJsVisible = false;
						this.getRuleList(this.currentPage);
					}else{
						this.alertFailed(res.errmsg);
					}
				});
			},


			
			viewJs(){
				if (this.multipleSelection.length <= 0) {
					this.showSelectDataMsg();
				}else if(this.multipleSelection.length > 1){
					this.showSelectMoreDataMsg();
				}else{
					let id = this.multipleSelection[0].id ;
					viewJsApi({ params: id }).then(res => {
						if (res.errcode === '0000') {
							this.viewJsData.ruleName=res.result.ruleName;
							this.viewJsData.ruleContent=res.result.ruleContent;
							this.dialogViewJsVisible = true;
						}else{
							this.alertFailed(res.errmsg);
						}
						
					});
				}
			},
			

			clearQueryParams() {
				for (let key in this.form) {
					this.form[key] = ''
				}
			},


			addParamsWithAddRule() {
				this.newAddRuleInfoData.sysFunctionInParamDtos.push({ id: '',ruleId: '', paramType: '', paramName: '' });
			},
			deleteParamsWithAddRule(index) {
				this.newAddRuleInfoData.sysFunctionInParamDtos.splice(index, 1);
			},

			addParamsWithModifyRule() {
				this.modifyRuleInfoData.sysFunctionInParamDtos.push({ id: '',ruleId: '', paramType: '', paramName: '' });
			},
			deleteParamsWithModifyRule(index) {
				this.modifyRuleInfoData.sysFunctionInParamDtos.splice(index, 1);
			},
			getUEContent(ref) {
	        	let content = this.$refs[ref].getUEContent();
	     		return content;
	      	},
	      	getRuleStateList() {
	      		getSelectList({ params: { code: '1021' } }).then(res => {
					if (res.errcode === '0000') {
						this.ruleStateList = res.result;
					}
				});
	      	},

	      	getFunctionInParamTypeList() {
	      		getSelectList({ params: { code: '1019' } }).then(res => {
					if (res.errcode === '0000') {
						this.functionInParamTypeList = res.result;
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
		    }

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
		        data = this.newAddRuleInfoData;
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