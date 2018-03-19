
import {queryFtpList,queryFtpAdd,getFtpTypeList,queryFtpEdit,queryFtpDelet} from '../../api/ftpManage';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
import { mapState, mapMutations } from 'vuex';

export default {
    data(){
        var checkNum = (rule, value, callback) => {
            let reg = /^[0-9]\d*$/;
            if (!reg.test(value)||!(parseInt(value)<=65536)) {
              return callback(new Error('输入正确的端口号'));
            }else{
              return callback()
            }
          }
          //IP校验
          var checkFtpIp = (rule, value, callback) => {
            let reg1 = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
            if (!reg1.test(value)) {
              return callback(new Error('输入正确的ftp地址'));
            }else{
              return callback()
            }
          }
          //路径校验
          var checkFtpRoad = (rule, value, callback) => {
            let reg1 = /^\//;
            if (!reg1.test(value)) {
              return callback(new Error('输入正确的生成路径'));
            }else{
              return callback()
            }
          }
          //校验不能含有特殊字符
        var checkSpecialCode = (rule, value, callback) => {
            let reg = /[\!@#\$%\^&\*]+/g;
            if (reg.test(value)) {
            return callback(new Error('不能含有特殊字符'));
            }else{
            return callback()
            }
        }
        return{
            pageId: '213',
            //表单数据
            //查询
            form:{
                pageNo:1,
                pageSize:20,
                configFtpType:'',
                ftpIp:'',
                port:'',
                status:''
            },
            //配置类型下拉菜单
            typeDownMenu:[],
            //表格数据
            tableData:[],
            loading:true,
            noTableData:'',
            multipleSelection:[],
            idList:[],
            //分页数据
            total:0,
            //对话框表单数据
            dialogAddVisible:false,
            dialogEditVisible:false,
            addForm:{
                configFtpType:'',
                ftpIp:'',
                port:'',
                user:'',
                pwd:'',
                path:''
            },
            editForm:{
                id:'',
                configFtpType:'',
                ftpIp:'',
                port:'',
                user:'',
                pwd:'',
                path:''
            },
            //表单验证
            formRules:{
                ftpIp: [{ validator: checkSpecialCode, trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
                port: [{ validator: checkSpecialCode, trigger: 'blur' },,{ trigger: 'blur', message: '最少1个字符最多5个字符', min: 1, max: 5 }]                
            },
            newFtpRules:{
                configFtpType: [{ required: true, message: '请选择配置类型', trigger: 'blur' }],
                ftpIp: [{ required: true, message: '请输入ftp地址', trigger: 'blur' },{ validator: checkFtpIp, trigger: 'blur' }],
                port: [{ required: true, message: '请输入端口', trigger: 'blur' },{ validator: checkNum, trigger: 'blur' },{ trigger: 'blur', message: '输入正确的端口号', min: 1, max: 5 }],
                user: [{ required: true, message: '请输入用户名', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' },{ validator: checkFtpRoad, trigger: 'blur' }],
            },
            editFtpRules:{
                configFtpType: [{ required: true, message: '请选择配置类型', trigger: 'blur' }],
                ftpIp: [{ required: true, message: '请输入ftp地址', trigger: 'blur' },{ validator: checkFtpIp, trigger: 'blur' }],
                port: [{ required: true, message: '请输入端口', trigger: 'blur' },{ validator: checkNum, trigger: 'blur' },{ trigger: 'blur', message: '输入正确的端口号', min: 1, max: 5 }],
                user: [{ required: true, message: '请输入用户名', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
                pwd: [{ required: true, message: '请输入密码', trigger: 'blur' },{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
                path: [{ required: true, message: '请输入路径', trigger: 'blur' },{ validator: checkFtpRoad, trigger: 'blur' }],
            },
            useFul:'',
            dialogVisibles: [
                'dialogAddVisible',
                'dialogEditVisible'
            ]
        }
    },
    created(){
        this.searchFtpList(true);
        this.getTypeList();
    },
    computed: {
        ...mapState({
          openModals: state => state.app.openModals,
          isCollapse: state => state.app.sidebar.opened
        })
    },
    methods:{
        //获取配置类型数据字典
        getTypeList(){
            const params = {code:'1035'}
            getFtpTypeList({params}).then(res=>{
                this.typeDownMenu = res.result;
            })
        },
        //查询
        cardSearchTerm(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.searchFtpList()
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        //获取ftp配置列表
        searchFtpList(isFirst){
            const params = this.form;
            queryFtpList({params}).then(res=>{
                this.tableData = res.result.rows;
                this.total = res.result.totalCount;
                this.loading = false;
                if (isFirst) {
                  const whichDialog = this.openModals.find(el => {
                    return el.pageId === this.pageId;
                  });
                  if ( whichDialog && whichDialog.openModal === 'dialogAddVisible') {
                    this.addForm = whichDialog.data;
                    this[whichDialog.openModal] = true;
                  } else if (whichDialog) {
                    this.$nextTick(() => {
                      whichDialog.data.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
                      });
                      if (whichDialog.openModal === 'dialogEditVisible') {
                        this.openEdit();
                      }
                    })
                  }
                }
            })
        },
        //打开对话框
        openAdd(){
            this.addForm = this.$options.data().addForm;
            this.dialogAddVisible=true;
        },
        //打开编辑对话框
        openEdit(){
            if(this.multipleSelection.length===1){
                this.dialogEditVisible = true;
            }else{
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条数据修改' : '只能选择一条数据修改',
                    duration: 600
                });
            }  
        },
        //新增ftp配置
        submitAddForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const params = this.addForm;
                queryFtpAdd({params}).then(res=>{
                if(res.errcode === '0000'){
                    this.$notify.success({
                    title: '消息',
                    message: '添加成功',
                    duration: 600
                    });
                    this.dialogAddVisible = false;
                    this.searchFtpList();
                    // this.resetForm(formName);
                }
                }).catch(()=>{})
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        //修改ftp
        submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                const params = this.editForm;
                queryFtpEdit({params}).then(res=>{
                  if(res.errcode === '0000'){
                    this.$notify.success({
                      title: '消息',
                      message: '编辑成功',
                      duration: 600
                    });
                    this.dialogEditVisible = false;
                    this.searchFtpList();
                 }
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
        //表单清空
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddVisible = false;
            this.dialogEditVisible = false;
        },
        //启禁用
        useAble(val){
            if(this.multipleSelection.length===1){
                const params = { id:this.editForm.id,status:val};
                if((val==='1'&&this.useFul==="禁用")||((val==='0'&&this.useFul==="启用"))){
                    if (!this.isCollapse) {
                        setTimeout(() => {
                            this.$nextTick(() => {
                                document.querySelector('.v-modal').style.left = '36px';
                            });
                        }, 100);
                    }
                    window.scrollTo(0, 0);
                    this.$confirm( '请确认改配置'+(val==='1'?'启用':'禁用')+',是否继续', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                      }).then(() => {
                        queryFtpEdit({params}).then(res=>{
                            if(res.errcode === '0000'){
                                this.$notify.success({
                                    title: '消息',
                                    message: val==='1'?'启用成功':'禁用成功',
                                    duration: 600
                                });
                            };
                            this.searchFtpList();   
                        })
                      }).catch(()=>{})
                }else{
                    this.$notify.warning({
                        title: '消息',
                        message: val==='1'?'已经是启用状态':'已经是禁用状态',
                        duration: 600
                    });
                } 
            }else{
                this.$notify.warning({
                    title: '消息',
                    message: this.multipleSelection.length === 0 ? '请选择一条要启用的配置' : '只能选择一条配置进行启用',
                    duration: 600
                });
            } 
        },
        //弹出确认删除confirm框
        openConfirm(message) {
            if (!this.isCollapse) {
                setTimeout(() => {
                    this.$nextTick(() => {
                        document.querySelector('.v-modal').style.left = '36px';
                    });
                }, 100);
            }
            window.scrollTo(0, 0);
            this.$confirm( message, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              this.deleteFtp();
            }).catch(()=>{})
        },
        //删除选中ftp(点击删除按钮时执行)
        removeFtp(){
            if(this.multipleSelection.length>0){
                this.openConfirm('此操作将永久删除该配置, 是否继续?');
            }else{
                this.$notify.warning({
                    title: '消息',
                    message: '请选择要删除的配置',
                    duration: 600
                });
            }  
        },
        //真正的删除数据(点击确认框确认时执行)
        deleteFtp(){
            const params = {idList:this.idList};
            queryFtpDelet({params}).then(res=>{
                this.searchFtpList();
                this.centerDialogVisible = false;
                this.$notify.success({
                    title: '消息',
                    message: '删除成功',
                    duration: 600
                });
            })
        },
        //当前选中发生变化
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if(val.length>0){
                this.useFul = val[0].status;
            }
            if(val&&val.length>0){
                this.idList = [];
                for(var i = 0;i<this.multipleSelection.length;i++){
                    this.idList.push(this.multipleSelection[i].id);
                }
                for (var key in this.editForm) {
                    if(key == 'configFtpType'){
                        this.editForm.configFtpType = this.multipleSelection[0].typeValue
                    }else{
                        this.editForm[key] = this.multipleSelection[0][key];
                    }
                }
            }else{
                this.multipleSelection = [];
            }
        },
        //分页
        currentChange(val){
            this.form.pageNo = val;
            const params = this.form;
            queryFtpList({params}).then(res=>{
                if(res.errcode === '0000'){
                    this.tableData = res.result.rows;
                }
            })
        },
        sizeChange(val){
            this.form.pageSize = val;
            const params = this.form;
            queryFtpList({params}).then(res=>{
                if(res.errcode === '0000'){
                    this.tableData = res.result.rows;
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
            data = this.addForm;
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