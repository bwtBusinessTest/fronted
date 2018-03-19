import { 
	getTreeDataApi,
	insertTreeDictApi,
	updateTreeDictApi,
	deleteBatchTreeDictApi,
	showBatchTreeDictApi,
	hideBatchTreeDictApi,
	getBeanTreeDictApi,
	getTreeRootNodesApi,
	getTreeChildNodesApi
} from '../../api/treeDictManage';
import butVisibleMixin from '../../utils/buttonVisible';
import { mapState, mapMutations } from 'vuex';
const BOTTOMFLAGTYPE = [false, true];
import publicMethod from '../../utils/publicMethod';
export default {
	name: 'treeDictManage',
	mixins: [butVisibleMixin, publicMethod],
	data() {
		return{
			pageId: '207',
			addRules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' }, { max: 32, message: '最多32个字符', trigger: 'blur' }],
				type: [{ required: true, message: '请输入节点编号', trigger: 'blur' }, { max: 32, message: '最多32个字符', trigger: 'blur' }],
				caption: [{ required: true, message: '请输入节点名称', trigger: 'blur' }, { max: 50, message: '最多50个字符', trigger: 'blur' }],
				parentCode: [{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				level: [{ required: true, message: '请输入节点层级'}, 
							{validator:(rule,value,callback)=>{
			                if(/^\d+$/.test(value) == false){
			                    callback(new Error("只能输入数字"));
			                }else if(value > 65535){
			                    callback(new Error("不得超过65535"));
			                }else{
			                    callback();
			                }
			            	}, trigger:'blur'}
			            	]
			},
			updateRules: {
				code: [{ required: true, message: '请输入字典编号', trigger: 'blur' }, { max: 32, message: '最多32个字符', trigger: 'blur' }],
				type: [{ required: true, message: '请输入节点编号', trigger: 'blur' }, { max: 32, message: '最多32个字符', trigger: 'blur' }],
				caption: [{ required: true, message: '请输入节点名称', trigger: 'blur' }, { max: 50, message: '最多50个字符', trigger: 'blur' }],
				parentCode: [{ max: 32, message: '最多32个字符', trigger: 'blur' }],
				level: [{ required: true, message: '请输入节点层级'}, 
							{validator:(rule,value,callback)=>{
			                if(/^\d+$/.test(value) == false){
			                    callback(new Error("只能输入数字"));
			                }else if(value > 65535){
			                    callback(new Error("不得超过65535"));
			                }else{
			                    callback();
			                }
			            	}, trigger:'blur'}
			            	]
			},
			treeDataView : [],
			filterText: '',
			defaultProps: {
	          children: 'children',
	          label: 'label',
	          isLeaf: 'bottomFlag'
	        },
	        dialogInsertVisible: false,
			dialogUpdateVisible: false,
			dialogDeleteVisible: false,
			dialogShowVisible: false,
			dialogHideVisible: false,
			treeDicInfo: {},
			insertTreeDicInfo: {},
			treeDicIdList: [],
			updateTreeDicInfo: {},
			checkedNodes: [],
			childNodesData: [],
			pullNode: {},
			dialogVisibles: [
				'dialogInsertVisible',
				'dialogUpdateVisible'
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
		retractTree(){
			this.getTreeData();
		},
		expandTree(){
			this.getExpandTreeData();
		},
		closeInsert(){
			this.$refs["insertForm"].resetFields();
			this.dialogInsertVisible = false;
		},
		closeUpdate(){
			this.$refs["updateForm"].resetFields();
			this.dialogUpdateVisible = false;
		},
		lazyLoad(node, resolve){
			if(node.level == 0){
				return ;
			}
			this.pullNode = node.data;
			const params = {status: null, parentCode: this.pullNode.code, code: this.pullNode.dicClass};
			getTreeChildNodesApi({ params }).then(res => {
				if (res.errcode === '0000') {
					this.childNodesData = res.result.filter((item) => {
			          item.bottomFlag = BOTTOMFLAGTYPE[item.bottomFlag];
			          return item;
			        });;
					resolve(this.childNodesData);
				}
			});
		},
		insertTreeDicShow(){
	 		this.insertTreeDicInfo = {code: '', type: '', caption: '', parentCode: '', level: '', bottomFlag: '', summary: '', status: '1'};
	 		this.dialogInsertVisible = true;
	 	},
	 	insertTreeDic(){
	 		this.$refs.insertForm.validate((valid) => {
	 			if (valid) {
			 		const params = {code: this.insertTreeDicInfo.code || null, type: this.insertTreeDicInfo.type || null, caption: this.insertTreeDicInfo.caption || null, parentCode: this.insertTreeDicInfo.parentCode || null, level: this.insertTreeDicInfo.level || null, bottomFlag: this.insertTreeDicInfo.bottomFlag || null, summary: this.insertTreeDicInfo.summary || null, status: this.insertTreeDicInfo.status || null};
			 		insertTreeDictApi({ params }).then(res => {
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
	 	updateTreeDicShow(){
	 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
				this.alertFailed("请选择数据");
			}else if(this.$refs.tree.getCheckedNodes().length > 1){
				this.alertFailed("只能选择一条数据");
			}else{
				this.checkedNodes = this.$refs.tree.getCheckedNodes();
				const params = { id: this.checkedNodes[0].id || null};
				getBeanTreeDictApi({ params }).then(res => {
			        if (res.errcode === '0000') {
				        this.updateTreeDicInfo = res.result;
						this.dialogUpdateVisible = true;
				    }else{
				    	this.alertFailed(res.errmsg);
				    }
				});
			}
	 	},
	 	updateTreeDic(){
	 		this.$refs.updateForm.validate((valid) => {
	 			if (valid) {
			 		const params = {id: this.updateTreeDicInfo.id || null, code: this.updateTreeDicInfo.code || null, type: this.updateTreeDicInfo.type || null, caption: this.updateTreeDicInfo.caption || null, parentCode: this.updateTreeDicInfo.parentCode || null, level: this.updateTreeDicInfo.level || null, bottomFlag: this.updateTreeDicInfo.bottomFlag || null, summary: this.updateTreeDicInfo.summary || null, status: this.updateTreeDicInfo.status || null};
			 		updateTreeDictApi({ params }).then(res => {
				        if (res.errcode === '0000') {
					        this.alertSuccess("修改成功");
					        this.updateTreeDicInfo = {};
							this.dialogUpdateVisible = false;
							this.getTreeData();
					    }else{
					    	this.alertFailed(res.errmsg);
					    }
					});
			 	}
		 	});
	 	},
	 	deleteBatchTreeDicShow(){
	 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否删除这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.deleteBatchTreeDic();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	deleteBatchTreeDic(){
			for(var i in this.$refs.tree.getCheckedNodes()){
				this.treeDicIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
			}
			const params = { idList: this.treeDicIdList || null};
			deleteBatchTreeDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("删除成功");
			        this.treeDicIdList = [];
			        this.dialogDeleteVisible = false;
			        this.getTreeData();
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	showBatchTreeDicShow(){
	 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否显示这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.showBatchTreeDic();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	showBatchTreeDic(){
	 		for(var i in this.$refs.tree.getCheckedNodes()){
				this.treeDicIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
			}
			const params = { idList: this.treeDicIdList || null};
			showBatchTreeDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("显示成功");
			        this.treeDicIdList = [];
			        this.dialogShowVisible = false;
			        this.getTreeData();
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
	 	hideBatchTreeDicShow(){
	 		if (this.$refs.tree.getCheckedNodes().length <= 0) {
				this.alertFailed("请选择数据");
			}else{
				this.$confirm('确认是否隐藏这些数据字典？', '提示', {
						confirmButtonText: '确定',
	          			cancelButtonText: '取消',
	          			type: 'warning',
	          			center: true
					}).then(() => {
						this.hideBatchTreeDic();
					}).catch(() => {

					});
					var self = this;
					setTimeout(function(){
					  self.openComfirmCallback()
					},100)
			}
	 	},
	 	hideBatchTreeDic(){
	 		for(var i in this.$refs.tree.getCheckedNodes()){
				this.treeDicIdList.push(this.$refs.tree.getCheckedNodes()[i].id);
			}
			const params = { idList: this.treeDicIdList || null};
			hideBatchTreeDictApi({ params }).then(res => {
		        if (res.errcode === '0000') {
			        this.alertSuccess("隐藏成功");
			        this.treeDicIdList = [];
			        this.dialogHideVisible = false;
			        this.getTreeData();
			    }else{
			    	this.alertFailed(res.errmsg);
			    }
			});
	 	},
		getTreeData(isFirst){
			const params = {status: null};
			//getTreeDataApi({ params }).then(res => {//------改为懒加载
			getTreeRootNodesApi({ params }).then(res => {
				if (res.errcode === '0000') {
					this.treeDataView = res.result;
					if (isFirst) {
						const whichDialog = this.openModals.find(el => {
			            return el.pageId === this.pageId;
			          });
						if ( whichDialog && whichDialog.openModal === 'dialogInsertVisible') {
				            this.insertTreeDicInfo = whichDialog.data;
				            this[whichDialog.openModal] = true;
				          }
					}
					return res.result;
				}
			});
		},
		getExpandTreeData(){
			const params = {status: null};
			getTreeDataApi({ params }).then(res => {
				if (res.errcode === '0000') {
					this.treeDataView = res.result;
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
	        data = this.insertTreeDicInfo;
	      }
	      this.removeOpenModals({ pageId: this.pageId });
	      this.addOpenModals({ pageId: this.pageId, openModal: dialogVisible, data});
	    } else {
	      this.removeOpenModals({ pageId: this.pageId });
	    }
	    next();
	}
}