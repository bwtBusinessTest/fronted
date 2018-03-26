import { 
	dictQueryApi,
	geteDictBeanApi,
	insertDictApi,
	updateDictApi,
	deleteBatchDictApi,
	showBatchDictApi,
	hideBatchDictApi
} from '../../api/dict';
import butVisibleMixin from '../../utils/buttonVisible';
import { mapState, mapMutations } from 'vuex';
import publicMethod from '../../utils/publicMethod';
const DICTSTATUS = ['是', '否'];

export default {
	mixins: [butVisibleMixin, publicMethod],
	data() {
	    return {
	    	pageId: '206',
	    	viewRules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				value: [{ required: true, message: '请输入字典值', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				caption: [{ required: true, message: '请输入字典名称', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
				status: [{ required: true, message: '请输入是否隐藏', trigger: 'blur' }]
			},
	    	addRules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				value: [{ required: true, message: '请输入字典值', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				caption: [{ required: true, message: '请输入字典名称', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
				status: [{ required: true, message: '请输入是否隐藏', trigger: 'blur' }]
			},
			updateRules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				value: [{ required: true, message: '请输入字典值', trigger: 'blur' },{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				caption: [{ required: true, message: '请输入字典名称', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
				status: [{ required: true, message: '请输入是否隐藏', trigger: 'blur' }]
			},
			form: {
				id: '',
			code: '',
			value: '',
			caption: ''
			},
			tableData: [],
			totalRows: 0 ,
			currentPage: 1,
			pageSize: 20,
			multipleSelection: [],
			dialogCheckVisible: false,
			dialogInsertVisible: false,
			dialogUpdateVisible: false,
			dialogDeleteVisible: false,
			dialogShowVisible: false,
			dialogHideVisible: false,
			dictInfo: {},
			insertDictInfo: {},
			dictIdList: [],
			updateDictInfo: {},
			dialogVisibles: [
				'dialogInsertVisible',
				'dialogCheckVisible',
				'dialogUpdateVisible',
				'dialogDeleteVisible',
				'dialogShowVisible',
				'dialogHideVisible'
			],
			loading: true,
			noTableData: ' '
	    }
	 },
	 created(){
	 	this.queryDict(undefined, true);
	 	
	 },
	 methods: {
	 	...mapMutations({
		    addOpenModals: 'ADD_OPEN_MODALS',
		    removeOpenModals: 'REMOVE_OPEN_MODALS'
		}),
	 	closeInsert(){
			this.$refs["insertForm"].resetFields();
			this.dialogInsertVisible = false;
		},
		closeUpdate(){
			this.$refs["updateForm"].resetFields();
			this.dialogUpdateVisible = false;
		},
	 	insertDictShow(){
	 		this.insertDictInfo = {code: '', value: '', caption: '', status: ''};
	 		this.dialogInsertVisible = true;
	 	},
	 	insertDict(){
	 		this.$refs.insertForm.validate((valid) => {
	 			if (valid) {
			 		const params = {code: this.insertDictInfo.code || null, value: this.insertDictInfo.value || null, caption: this.insertDictInfo.caption || null, status: this.insertDictInfo.status || null};
			 		insertDictApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.alertSuccess("新增成功");
							this.dialogInsertVisible = false;
							this.queryDict(this.currentPage);
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
			 	}
		 	});
	 	},
	 	updateDictShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else if(this.multipleSelection.length > 1){
				this.alertFailed("只能选择一条数据");
			}else{
				const params = { id: this.multipleSelection[0].id || null};
				geteDictBeanApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.updateDictInfo = res.result;
						this.dialogUpdateVisible = true;
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			}
	 	},
	 	updateDict(){
	 		this.$refs.updateForm.validate((valid) => {
	 			if (valid) {
			 		const params = { id: this.updateDictInfo.id ,code: this.updateDictInfo.code || null, value: this.updateDictInfo.value || null, caption: this.updateDictInfo.caption || null, status: this.updateDictInfo.status || null};
			 		updateDictApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.alertSuccess("修改成功");
					        this.updateDictInfo = {};
							this.dialogUpdateVisible = false;
							this.queryDict(this.currentPage);
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
			 	}
		 	});
	 	},
	 	deleteBatchDictShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否删除这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.deleteBatchDict();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	deleteBatchDict(){
			for(var i in this.multipleSelection){
				this.dictIdList.push(this.multipleSelection[i].id);
			}
			const params = { idList: this.dictIdList || null};
			deleteBatchDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("删除成功");
			        this.dictIdList = [];
			        this.dialogDeleteVisible = false;
			        this.queryDict(this.currentPage);
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	showBatchDictShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否显示这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.showBatchDict();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	showBatchDict(){
	 		for(var i in this.multipleSelection){
				this.dictIdList.push(this.multipleSelection[i].id);
			}
			const params = { idList: this.dictIdList || null};
			showBatchDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("显示成功");
			        this.dictIdList = [];
			        this.dialogShowVisible = false;
			        this.queryDict(this.currentPage);
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	hideBatchDictShow(){
	 		if (this.multipleSelection.length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否隐藏这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.hideBatchDict();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	hideBatchDict(){
	 		for(var i in this.multipleSelection){
				this.dictIdList.push(this.multipleSelection[i].id);
			}
			const params = { idList: this.dictIdList || null};
			hideBatchDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("隐藏成功");
			        this.dictIdList = [];
			        this.dialogHideVisible = false;
			        this.queryDict(this.currentPage);
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	handleSelectionChange(val) {
			this.multipleSelection = val;
		},
	 	clearQueryParams() {
	      for (let key in this.form) {
	        this.form[key] = ''
	      }
	    },
	    getBeanDict() {
			if (this.multipleSelection.length <= 0) {
				this.alertFalied("请选择数据");
			}else if(this.multipleSelection.length > 1){
				this.alertFailed("只能选择一条数据");
			}else{
				const params = { id: this.multipleSelection[0].id || null};
				geteDictBeanApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.dictInfo = { ...this.multipleSelection[0]};
						this.dialogCheckVisible = true;
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			}
		},
	    queryDictList() {
	        this.queryDict();
	    },
	 	handleCurrentChange(val) {
		    this.currentPage = val;
		    this.queryDict(val);
	    },
	    handleSizeChange(val) {
			this.pageSize = val;
			this.queryDict(this.currentPage);
		},
	 	queryDict(pageNo, isFirst) {
		    const currentPage = pageNo || 1;
		    const params = { pageNo: currentPage, pageSize: this.pageSize, code: this.form.code || null, value: this.form.value || null, caption: this.form.caption || null};
		    dictQueryApi({ params }).then(res => {
		      if (res.errcode === '0000') {
		      	this.tableData = res.result.rows.filter((item) => {
		        	item.status = DICTSTATUS[item.status];
		          return item;
		        });
		        this.loading = false;
		        this.totalRows = res.result.totalCount;
		        if (isFirst) {
		          const whichDialog = this.openModals.find(el => {
		            return el.pageId === this.pageId;
		          });
		          if ( whichDialog && whichDialog.openModal === 'dialogInsertVisible') {
		            this.insertDictInfo = whichDialog.data;
		            this[whichDialog.openModal] = true;
		          } else if (whichDialog) {
		            this.$nextTick(() => {
		              whichDialog.data.forEach(row => {
		                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
		              });
		              if (whichDialog.openModal === 'dialogCheckVisible') {
		                this.getBeanDict();
		              } else if(whichDialog.openModal === 'dialogUpdateVisible') {
		                this.updateDictShow();
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
			//打开confirm后回掉
			openComfirmCallback(){
				$('.el-dialog__wrapper').css('left','0px');
				$('.v-modal').css('left','0px');
				$('.el-dialog__wrapper').css('top','0px');
				$('.v-modal').css('top','0px');
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
	        data = this.insertDictInfo;
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