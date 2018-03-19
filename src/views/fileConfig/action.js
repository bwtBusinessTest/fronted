import { 
	fileConfigQueryApi,
	insertFileConfigApi,
	updateFileConfigApi,
	deleteBatchFileConfigApi,
	validateFtpPathApi,
	validateVisitPathApi,
	validateConfigFtpTypeApi,
	getBeanFileConfigApi
} from '../../api/fileConfig';
import butVisibleMixin from '../../utils/buttonVisible';
import { getSelectList } from '../../api/userManage';
import { mapState, mapMutations } from 'vuex';
import publicMethod from '../../utils/publicMethod';
const FILECONFIGTYPE = ['','模板', '业务规则','上传文件', '卡券业务下载模版', '广告上传文件'];

export default {
	mixins: [butVisibleMixin, publicMethod],
	data() {
		var validateInsertFtpPath = (rule, value, callback) => {
	      if (!(/\/$/.test(value))) {
	        callback('请以／结尾');
	      }else {
	          let ftpPath = '';
		      let id = null;
		      ftpPath = this.insertFileConfigInfo.ftpPath;
		      if (ftpPath) {
		      	const params = {ftpPath: ftpPath, id: id || null};
		        validateFtpPathApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback("生成路径已存在");
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
		   }
	    };
	    var validateUpdateFtpPath = (rule, value, callback) => {
	      if (!(/\/$/.test(value))) {
	        callback('请以／结尾');
	      }else {
	          let ftpPath = '';
		      let id = null;
		      ftpPath = this.updateFileConfigInfo.ftpPath;
		      id = this.updateFileConfigInfo.id;
		      if (ftpPath) {
		      	const params = {ftpPath: ftpPath, id: id || null};
		        validateFtpPathApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback("生成路径已存在");
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
		   }
	    };
	    var validateInsertVisitPath = (rule, value, callback) => {
	      if (!(/\/$/.test(value)) || !(/^\//).test(value) ) {
	        callback('请以／开头和结尾');
	      }else {
	          let visitPath = '';
		      let id = null;
		      visitPath = this.insertFileConfigInfo.visitPath;
		      
		      if (visitPath) {
		      	const params = {visitPath: visitPath, id: id || null};
		        validateVisitPathApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback("访问路径已存在");
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
	      }
	    };
	    var validateUpdateVisitPath = (rule, value, callback) => {
	      if (!(/\/$/.test(value)) || !(/^\//).test(value) ) {
	        callback('请以／开头和结尾');
	      }else {
	          let visitPath = '';
		      let id = null;
		      visitPath = this.updateFileConfigInfo.visitPath;
		      id = this.updateFileConfigInfo.id;
		      
		      if (visitPath) {
		      	const params = {visitPath: visitPath, id: id || null};
		        validateVisitPathApi({ params }).then(res => {
		          if (res.result.isExist) {
		            callback("访问路径已存在");
		          } else {
		            callback();
		          }
		        });
		      } else {
		        callback();
		      }
	      }
	    };
	    var validateInsertConfigFtpType = (rule, value, callback) => {
	      let configFtpType = '';
	      let id = null;
	      configFtpType = this.insertFileConfigInfo.configFtpType;
	      
	      if (configFtpType) {
	      	const params = {configFtpType: configFtpType, id: id || null};
	        validateConfigFtpTypeApi({ params }).then(res => {
	          if (res.result.isExist) {
	            callback("配置类型已存在");
	          } else {
	            callback();
	          }
	        });
	      } else {
	        callback();
	      }
	    };
	    var validateUpdateConfigFtpType = (rule, value, callback) => {
	      let configFtpType = '';
	      let id = null;
	      configFtpType = this.updateFileConfigInfo.configFtpType;
	      id = this.updateFileConfigInfo.id;
	      
	      if (configFtpType) {
	      	const params = {configFtpType: configFtpType, id: id || null};
	        validateConfigFtpTypeApi({ params }).then(res => {
	          if (res.result.isExist) {
	            callback("配置类型已存在");
	          } else {
	            callback();
	          }
	        });
	      } else {
	        callback();
	      }
	    };
	    return {
	    	pageId: '209',
	    	ftpPathExist: false,
	    	visitPathExist: false,
	    	configFtpTypeExist: false,
	    	addFileConfigRules: {
				configFtpType: [{ required: true, message: '请输入配置类型', trigger: 'blur' }, { validator: validateInsertConfigFtpType }],
				ftpPath: [{ required: true, message: '请输入生成路径', trigger: 'blur' }, { validator: validateInsertFtpPath, trigger: 'blur' }, { max: 200, message: '最多200个字符', trigger: 'blur' }],
				visitPath: [{ required: true, message: '请输入访问路径', trigger: 'blur' }, { validator: validateInsertVisitPath, trigger: 'blur' }, { max: 200, message: '最多200个字符', trigger: 'blur' }]
			},
			updateFileConfigRules: {
				configFtpType: [{ required: true, message: '请输入配置类型', trigger: 'blur' }, { validator: validateUpdateConfigFtpType }],
				ftpPath: [ { required: true, message: '请输入生成路径', trigger: 'blur' }, { validator: validateUpdateFtpPath, trigger: 'blur' }, { max: 200, message: '最多200个字符', trigger: 'blur' }],
				visitPath: [{ required: true, message: '请输入访问路径', trigger: 'blur' }, { validator: validateUpdateVisitPath, trigger: 'blur' }, { max: 200, message: '最多200个字符', trigger: 'blur' }]
			},
			tableData: [],
			totalRows: 0 ,
			currentPage: 1,
			pageSize: 10,
			multipleSelection: [],
			dialogCheckVisible: false,
			dialogInsertVisible: false,
			dialogUpdateVisible: false,
			dialogDeleteVisible: false,
			dialogShowVisible: false,
			dialogHideVisible: false,
			fileConfigInfo: {},
			insertFileConfigInfo: { configFtpType: '', ftpPath: '', visitPath: '' },
			fileConfigIdList: [],
			updateFileConfigInfo: {},
			configTypeList: [],
			dialogVisibles: [
				'dialogInsertVisible',
				'dialogUpdateVisible',
				'dialogDeleteVisible'
			],
			loading: true,
			noTableData: ' '
	    }
	 },
	 created(){
	 	this.queryFileConfig(undefined, true);
	 	this.getConfigTypeList();
	 },
	 methods: {
	 	...mapMutations({
	      addOpenModals: 'ADD_OPEN_MODALS',
	      removeOpenModals: 'REMOVE_OPEN_MODALS'
	    }),
	 	//验证配置类型是否存在
	    sendValidateConfigFtpType(type) {
	      let configFtpType = '';
	      let id = null;
	      if (type === 'insert') {
	        configFtpType = this.insertFileConfigInfo.configFtpType;
	      } else {
	        configFtpType = this.updateFileConfigInfo.configFtpType;
	        id = this.updateFileConfigInfo.id;
	      }
	      if (configFtpType) {
	      	const params = {configFtpType: configFtpType, id: id || null};
	        validateConfigFtpTypeApi({ params }).then(res => {
	          if (res.result.isExist) {
	            this.configFtpTypeExist = true;
	          } else {
	            this.configFtpTypeExist = false;
	          }
	        });
	      } else {
	        this.configFtpTypeExist = false;
	      }

	    },
	 	//验证上传路径是否存在
	    sendValidateFtpPath(type) {
	      let ftpPath = '';
	      let id = null;
	      if (type === 'insert') {
	        ftpPath = this.insertFileConfigInfo.ftpPath;
	      } else {
	        ftpPath = this.updateFileConfigInfo.ftpPath;
	        id = this.updateFileConfigInfo.id;
	      }
	      if (ftpPath) {
	      	const params = {ftpPath: ftpPath, id: id || null};
	        validateFtpPathApi({ params }).then(res => {
	          if (res.result.isExist) {
	            this.ftpPathExist = true;
	          } else {
	            this.ftpPathExist = false;
	          }
	        });
	      } else {
	        this.ftpPathExist = false;
	      }

	    },
	    //验证访问路径是否存在
	    sendValidateVisitPath(type) {
	      let visitPath = '';
	      let id = null;
	      if (type === 'insert') {
	        visitPath = this.insertFileConfigInfo.visitPath;
	      } else {
	        visitPath = this.updateFileConfigInfo.visitPath;
	        id = this.updateFileConfigInfo.id;
	      }
	      if (visitPath) {
	      	const params = {visitPath: visitPath, id: id || null};
	        validateVisitPathApi({ params }).then(res => {
	          if (res.result.isExist) {
	            this.visitPathExist = true;
	          } else {
	            this.visitPathExist = false;
	          }
	        });
	      } else {
	        this.visitPathExist = false;
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
	 	insertFileConfigShow(){
	 		this.dialogInsertVisible = true;
	 	},
	 	insertFileConfig(){
	 		this.$refs.insertForm.validate((valid) => {
	 			if (valid) {
			 		const params = {configFtpType: this.insertFileConfigInfo.configFtpType || null, ftpPath: this.insertFileConfigInfo.ftpPath || null, visitPath: this.insertFileConfigInfo.visitPath || null};
			 		insertFileConfigApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.alertSuccess("新增成功");
							this.dialogInsertVisible = false;
							this.queryFileConfig(this.currentPage);
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
			 	}
		 	});
	 	},
	 	updateFileConfigShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else if(this.multipleSelection.length > 1){
				this.alertFailed("只能选择一条数据");
			}else{
				const params = { id: this.multipleSelection[0].id || null};
				getBeanFileConfigApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.updateFileConfigInfo = res.result;
						this.dialogUpdateVisible = true;
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			}
	 	},
	 	updateFileConfig(){
	 		this.$refs.updateForm.validate((valid) => {
	 			if (valid) {
			 		const params = { id: this.updateFileConfigInfo.id ,configFtpType: this.updateFileConfigInfo.configFtpType || null, ftpPath: this.updateFileConfigInfo.ftpPath, visitPath: this.updateFileConfigInfo.visitPath || null};
			 		updateFileConfigApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.alertSuccess("修改成功");
					        this.updateFileConfigInfo = {};
							this.dialogUpdateVisible = false;
							this.queryFileConfig(this.currentPage);
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
			 	}
		 	});
	 	},
	 	deleteBatchFileConfigShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否删除这些文件配置？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.deleteBatchFileConfig();
					}).catch(() => {

					});
			}
	 	},
	 	deleteBatchFileConfig(){
			for(var i in this.multipleSelection){
				this.fileConfigIdList.push(this.multipleSelection[i].id);
			}
			const params = { idList: this.fileConfigIdList || null};
			deleteBatchFileConfigApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("删除成功");
			        this.fileConfigIdList = [];
			        this.dialogDeleteVisible = false;
			        this.queryFileConfig(this.currentPage);
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	
	 	handleSelectionChange(val) {
			this.multipleSelection = val;
		},
	    queryFileConfigList() {
	        this.queryFileConfig();
	    },
	 	handleCurrentChange(val) {
	      this.currentPage = val;
	      this.queryFileConfig(val);
	    },
	    handleSizeChange(val) {
			this.pageSize = val;
			this.queryFileConfig(this.currentPage);
		},
	 	queryFileConfig(pageNo, isFirst) {
	      const currentPage = pageNo || 1;
	      const params = { pageNo: currentPage, pageSize: this.pageSize};
	      fileConfigQueryApi({ params }).then(res => {
	        if (res.errcode === '0000') {
	          this.tableData = res.result.rows.filter((item) => {
	          	item.configFtpType = FILECONFIGTYPE[item.configFtpType];
	            return item;
	          });
	          this.loading = false;
	          this.totalRows = res.result.totalCount;
	          if (isFirst) {
		          const whichDialog = this.openModals.find(el => {
		            return el.pageId === this.pageId;
		          });
		          if ( whichDialog && whichDialog.openModal === 'dialogInsertVisible') {
		            this.insertFileConfigInfo = whichDialog.data;
		            this[whichDialog.openModal] = true;
		          } else if (whichDialog) {
		            this.$nextTick(() => {
		              whichDialog.data.forEach(row => {
		                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
		              });
		              if (whichDialog.openModal === 'dialogUpdateVisible') {
		                this.updateFileConfigShow();
		              } else if(whichDialog.openModal === 'dialogDeleteVisible') {
		                this.deleteBatchFileConfigShow();
		              }
		            })
		          }
		        }
	        }
	      });
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
	    getConfigTypeList() {
	    	getSelectList({ params: { code: '1024' } }).then(res => {
        		if (res.errcode === '0000') {
          			this.configTypeList = res.result;
        		}
      		});
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
	        data = this.insertFileConfigInfo;
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