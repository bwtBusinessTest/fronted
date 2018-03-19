/**
 * Created by rongyao on 2017/12/22.
 */

 import {queryRetailList,queryAddRetail,queryRetailEdit,secretKey} from '../../api/retailManage';
 import butVisibleMixin from '../../utils/buttonVisible';
 import  publicMethod from '../../utils/publicMethod';
 import { mapState, mapMutations } from 'vuex';
export default{
  data(){
    var checkCode = (rule, value, callback) => {
      let reg = /^[1-9]\d*$/;
      if (!reg.test(value)) {
        return callback(new Error('只能输入数字'));
      }else if(value-661801<0){
        return callback(new Error('分销商代码必须大于661801,并且依次排序'));
      }else{
        return callback()
      }
    }
    return {
      pageId: '30301',
      dialogAddVisible:false,
      dialogEditVisible:false,
      centerDialogVisible:false,
      //表格数据
      total:0,
      tableData:[],
      noTableData:'',
      loading:true,
      //表单数据
      labelPosition:'right',
      multipleSelection:[],
      newAddForm:{
        name:'',
        shortName:'',
        status:''
      },
      editForm:{
        code:'',
        name:'',
        shortName:'',
        appId:'',
        appSecret:'',
        status:''
      },
      searchData:{
        pageNo:1,
        pageSize:20
      },
      //表单验证
      newRetailRules: {
        code: [{ required: true, message: '请输入用户分销商代码', trigger: 'blur' }, { validator: checkCode, trigger: 'blur' },{ max: 6, message: '最长6位数字', trigger: 'blur' }],
        name: [{ required: true, message: '请输入分销商名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入分销商简称', trigger: 'blur' },{ message: '简称最多10字符', max: 10, trigger: 'blur' }],
        appId: [{ required: true, message: '请输入appId', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
        status: [{ required: true, message: '请选择分销商状态', trigger: 'change' }],
      },
      editRetailRules: {
        code: [{ required: true, message: '请输入用户分销商代码', trigger: 'blur' }, { validator: checkCode, trigger: 'blur' },{ max: 20, message: '最长20个字符', trigger: 'blur' }],
        name: [{ required: true, message: '请输入分销商名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入分销商简称', trigger: 'blur' },{ message: '简称最多11字符', max: 11, trigger: 'blur' }],
        // appId: [{ required: true, message: '请输入appId', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
        status: [{ required: true, message: '请选择分销商状态', trigger: 'change' }],
      },
      dialogVisibles: [
        'dialogAddVisible',
        'dialogEditVisible'
      ]
    }
  },
  created(){
    this.getRetailList(true);
  },
  computed: {
    ...mapState({
      openModals: state => state.app.openModals
    })
  },
  methods:{
    getRetailList(isFirst){
      this.searchData.pageNo = 1;
      const params = this.searchData;
      queryRetailList({params}).then(res=>{
        if(res.errcode==="0000"){
          this.total = res.result.totalCount;
          this.tableData = res.result.rows;
          this.changeUse();
          this.loading = false;
          if (isFirst) {
            const whichDialog = this.openModals.find(el => {
              return el.pageId === this.pageId;
            });
            if ( whichDialog && whichDialog.openModal === 'dialogAddVisible') {
              this.newAddForm = whichDialog.data;
              this[whichDialog.openModal] = true;
            } else if (whichDialog) {
              this.$nextTick(() => {
                whichDialog.data.forEach(row => {
                  this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
                });
                if (whichDialog.openModal === 'dialogEditVisible') {
                  this.retailEdit();
                }
              })
            }
          }
        }
      })
    },

    //1:启用 0：停用
    changeUse(){
      for(var i=0;i<this.tableData.length;i++){
        if(this.tableData[i].status==="1"){
          this.tableData[i].status="启用"
        }else{
          this.tableData[i].status="停用";
        }  
       }
    },

    //分页
    currentChange(val){
      this.searchData.pageNo = val;
      const params = this.searchData
      queryRetailList({params}).then(res=>{
        if(res.errcode === '0000'){
           this.tableData = res.result.rows;
           this.changeUse();
        }
      })
    },
    sizeChange(val){
      this.searchData.pageSize = val;
      const params = this.searchData;
      queryRetailList({params}).then(res=>{
        if(res.errcode === '0000'){
           this.tableData = res.result.rows;
           this.changeUse();
        }
      })
    },

    //当前选中发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.editForm.appSecret='';
      if(val&&val.length>0){
        for (var key in this.editForm) {
          if(key=='status'){
            if(this.multipleSelection[0][key]==="启用"){
                this.editForm[key]='1'
            }else{
                this.editForm[key]='0'
            }
          }else{
            this.editForm[key] = this.multipleSelection[0][key]
          }
        }
      }
    },

    //新增card  
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.newAddForm;
          queryAddRetail({params}).then(res=>{
            if(res.errcode === '0000'){
              this.$notify.success({
                title: '消息',
                message: '添加成功',
                duration: 600
              });
              this.dialogAddVisible = false;
              this.getRetailList();
           }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //弹出confirm框确认是否修改
    openConfirm() {
      if(this.multipleSelection&&this.multipleSelection.length===1){
        this.$confirm('请确认重新生成秘钥，修改后原秘钥将失效！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.getKeyGenerator();
        }).catch(()=>{})
        var self = this;
        setTimeout(function(){
          self.openComfirmCallback()
        },100)
      }else{
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条数据生成密钥' : '只能选择一条数据生成密钥',
          duration: 600
        });
      }  

    },
    //打开confirm后回掉
    openComfirmCallback(){
      if (!this.isCollapse) {
        this.$nextTick(() => {
            document.querySelector('.v-modal').style.left = '36px';
        }); 
      }
      if (document.querySelector('.v-modal')) {
        this.scrollHeight = $(document).scrollTop();
        if(this.scrollHeight>=0&&this.scrollHeight<50){
          document.querySelector('.v-modal').style.top = (50-this.scrollHeight)+'px';
        }else{
          document.querySelector('.v-modal').style.top = 0+'px';
        }
      }
    },
    //编辑分销商
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // delete this.editForm.code;
          this.dialogEditVisible = false;
          this.editSubmit();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //提交编辑内容
    editSubmit(){
      delete this.editForm.appSecret;
      const params = this.editForm;
      queryRetailEdit({params}).then(res=>{
        if(res.errcode === '0000'){
          this.$notify.success({
            title: '消息',
            message: '编辑成功',
            duration: 600
          });
          this.getRetailList();
       }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogAddVisible = false;
      this.dialogEditVisible = false;
    },

    //打开对话框
    retailAdd(){
      this.dialogAddVisible=true;
    },
    retailEdit(){
      if(this.multipleSelection&&this.multipleSelection.length===1){
        this.dialogEditVisible=true;
      }else{
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条数据修改' : '只能选择一条数据修改',
          duration: 600
        });
      }
    },
    //生成密钥
    getKeyGenerator(){
      const params = {code:this.multipleSelection[0].code}
      secretKey({params}).then(res=>{
        if(res.errcode === '0000'){
          this.$notify.success({
            title: '消息',
            message: '密钥生成成功',
            duration: 600
          });
       }
      })
      
    },
    ...mapMutations({
      addOpenModals: 'ADD_OPEN_MODALS',
      removeOpenModals: 'REMOVE_OPEN_MODALS'
    })
  },
  mixins: [butVisibleMixin,publicMethod],
  beforeRouteLeave(to, from, next) {
    const dialogVisible = this.dialogVisibles.find(el => {
      return this[el];
    });
    var data;
    if (dialogVisible) {
      if (dialogVisible === this.dialogVisibles[0]) {
        data = this.newAddForm;
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
