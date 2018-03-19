
import {getPublishList,getRetailCardList,publicGetCardList,queryAddRetailCard,queryRetailCardEdit} from '../../api/retailCardManage'
import {queryAllRetail} from '../../api/retailManage'
import {queryCardList} from '../../api/cardManage';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
import { mapState, mapMutations } from 'vuex';
export default {
    data(){
        var checkCode = (rule, value, callback) => {
            let reg = /^[0-9]\d*$/;
            if (!reg.test(value)&&!value=='') {
              return callback(new Error('只能输入正整数且不能为空'));
            }else{
              return callback()
            }
          }
          var checkAddCount = (rule, value, callback) => {
            let reg = /^[0-9]\d*$/;
            let reg1 = /^-[1-9]\d*$/;
            if(reg1.test(value)){
                return callback()
            }else if (!reg.test(value)&&!value=="") {
              return callback(new Error('只能输入数字且不能为空'));
            } else{
              return callback()
            }
          } 
          var validatePass = (rule, value, callback) => {
            if (parseInt((value-0)) > parseInt(this.cardData.cardAmount)) {
              callback(new Error('不能大于总库存量'));
            }else {
              callback();
            }
          };
          //小数或整数
        var checkNumAndSmall = (rule, value, callback) => {
            let reg =  /^[0-9]+([.]{1}[0-9]{1,3}){0,1}$/;
            if (!reg.test(value)&&!value=='') {
            return callback(new Error('输数字且不能超过三位小数'));
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
         //限制规格次数最大值以及数据长度限制
        var checkCardCountMax = (rule, value, callback) => {
            if((typeof value)==='string'){
                if(value.length>=10){
                    return callback(new Error('不能超过十个字符'));
                }else{
                    return callback()
                }
            }else{
                if (parseInt(value)>9999999999) {
                    return callback(new Error('最大十位数'));
                }else{
                    return callback()
                }
            } 
        }
        return{
            pageId: '30302',
            //对话框
            dialogAddVisible:false,
            dialogEditVisible:false,
            //选中数据
            multipleSelection:[{}],
            retailCardData:{
                distributorName:'',
                cardPublish:''
            },
            //表格数据
            tableData:[],
            loading:false,
            noTableData:'',
            total:0,
            loading:true,
            // loading:false,
             //下拉数据字典
            publicMenu:[],
            retailMenu:[],
            cardNameMenu:[],
            //表单数据
            //查询表单
            form:{
                cardPublish:'',
                cardName:'',
                distributorInfoCode:'',
                pageNo:1,
                pageSize:20
            },
            //新增表单
            cardPublish:'',
            addForm:{
                cardId:'',
                distributorInfoCode:'',
                cardAmount:'',
                settlementBalance:'',
                saleLimitDay:'0',
                thresholdAmount:'',
                status:''
            },
            cardData:{
                cardCount:'',
                cardBalance:'',
                cardAmount:''
            },
            //编辑表单
            editForm:{
                id:'',
                cardId:'',
                distributorInfoCode:'',
                cardAmount:'',
                settlementBalance:'',
                saleLimitDay:0,
                thresholdAmount:0,
                status:'',
                addCount:''
            },
            //新增时改变卡券时请求结束前不允许输入
            able:false,
            //表单验证
            formRules:{
                cardName: [{ validator: checkSpecialCode, trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }]
            },
            newRetailCardRules: {
                distributorInfoCode: [{ required: true, message: '请选择分销商', trigger: 'change' }],
                cardId:[{ required: true, message:'暂无该发行方的发行卡券' }],
                settlementBalance: [{ required:true, message: '请输入结算价', trigger: 'blur' },{ validator: checkNumAndSmall, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'change' }],
                cardAmount: [{ required:true, message: '请输入分配库存', trigger: 'blur' },{ validator: checkCode, trigger: 'blur' },{ validator: validatePass, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'change' }],
                thresholdAmount: [{ required:true, message: '请输入库存阈值', trigger: 'blur' },{ validator: checkCode, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'change' }],
                saleLimitDay: [{ required:true, message: '请输入日售限额', trigger: 'blur' },{ validator: checkCode, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'change' }],
                status: [{ required: true, message: '请选择分销商状态', trigger: 'blur' }],
            },
            editRetailRules: {
                settlementBalance: [{ required:true, message: '请输入结算价' },{ validator: checkNumAndSmall, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
                addCount: [{ validator: checkAddCount, trigger: 'blur' },{ validator: validatePass, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
                thresholdAmount: [{ required:true, message: '请输入库存阈值' },{ validator: checkCode, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
                saleLimitDay: [{ required:true, message: '请输入日售限额' },{ validator: checkCode, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
                status: [{ required: true, message: '请选择分销商状态' }],
            },
            dialogVisibles: [
                'dialogAddVisible',
                'dialogEditVisible'
            ],
            //滚动条高度
            scrollHeight:0
        }
    },
    created(){
        this.getPulicMenu();
        this.getRetailMenu();
        this.getDataList(true);
        this.accordingPublicGetCard();
    },
    computed: {
        ...mapState({
          openModals: state => state.app.openModals
        })
    },
    methods:{
        //获取发行方下拉菜单
        getPulicMenu(){
            const params = {code:'1036'}
            getPublishList({params}).then(res=>{
              if(res.errcode==="0000"){
                this.publicMenu = res.result;
                if(this.publicMenu.length>0){
                    this.cardPublish = this.publicMenu[0].caption
                }
              }
            })
        },
        //获取分销商下拉菜单
        getRetailMenu(){
            const params = {};
            queryAllRetail({params}).then(res=>{
                if(res.errcode==="0000"){
                    this.retailMenu = res.result;
                }
            })
        },
        //查询
        cardSearchTerm(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.searchData()
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        //获取表格数据
        getDataList(isFirst){
            const params = this.form;
            getRetailCardList({params}).then(res=>{
                if(res.errcode==="0000"){
                    this.total = res.result.totalCount;
                    this.tableData = res.result.rows;
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
                              this.retailCardEdit();
                            }
                          })
                        }
                      }
                }
            })
        },
        //查询数据
        searchData(){
            this.form.pageNo=1;
            this.getDataList();
        },
        //分页
        currentChange(val){
            this.form.pageNo = val;
            const params = this.form;
            getRetailCardList({params}).then(res=>{
            if(res.errcode === '0000'){
                this.tableData = res.result.rows;
            }
            })
        },
        sizeChange(val){
            this.form.pageSize = val;
            const params = this.form;
            getRetailCardList({params}).then(res=>{
            if(res.errcode === '0000'){
                this.tableData = res.result.rows;
            }
            })
        },
        //根据发行方查询卡券数据
        accordingPublicGetCard(){
            const params = {cardPublish:this.cardPublish};
            publicGetCardList({params}).then(res=>{
                if(res.errcode==="0000"){
                    this.cardNameMenu = res.result;
                    if(this.cardNameMenu.length>0){
                        this.addForm.cardId = this.cardNameMenu[0].id;
                        this.getCarDataById(this.addForm.cardId);
                    }else{
                        this.addForm.cardId = "";
                        this.cardData = {};
                    }
                }
            })
        },
        //根据Id查询卡券数据
        getCarDataById(id){
            const params={id:id}
            this.able = true;
            queryCardList({params}).then(res=>{
                this.cardData = res.result.rows[0];
                this.able = false;
            })
        },
        //下拉变化
        changeCardId(){
            this.addForm.cardAmount='';
            this.addForm.settlementBalance='';
            this.addForm.saleLimitDay='0';
            this.addForm.thresholdAmount='';
            if(this.addForm.cardId) {
                this.getCarDataById(this.addForm.cardId);
            }
        },
        //添加打开对话框
        retailCardNewAdd(){
            this.accordingPublicGetCard();
            this.dialogAddVisible = true;
        },
        //新增retailCard
        submitAddForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                const params = this.addForm;
                queryAddRetailCard({params}).then(res=>{
                if(res.errcode === '0000'){
                    this.$notify.success({
                    title: '消息',
                    message: '添加成功',
                    duration: 600
                    });
                    this.dialogAddVisible = false;
                    this.searchData();
                    this.resetForm(formName);
                }
                }).catch(()=>{})
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        //编辑retailCard
        submitEditForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.editForm.cardAmount += +this.editForm.addCount;
                this.editForm.cardAmount.toString();
                delete this.editForm.addCount;
                const params = this.editForm;
                queryRetailCardEdit({params}).then(res=>{
                  if(res.errcode === '0000'){
                    this.$notify.success({
                      title: '消息',
                      message: '编辑成功',
                      duration: 600
                    });
                    this.dialogEditVisible = false;
                    this.searchData();
                    this.centerDialogVisible=true;
                 }
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
        //编辑打开对话框
        retailCardEdit(){
            if(this.multipleSelection.length===1&&this.multipleSelection[0].cardId){
                this.editForm.addCount = "";    
                this.getCarDataById(this.multipleSelection[0].cardId)
                this.dialogEditVisible = true;
            }else{
                this.$notify.warning({
                  title: '消息',
                  message: this.multipleSelection.length === 0 ? '请选择一条数据修改' : '只能选择一条数据修改',
                  duration: 600
                });
            }
        },
        //当前选中发生变化
        handleSelectionChange(val) {
            this.multipleSelection = val;
            if(val&&val.length>0){
                for (var key in this.editForm) {
                    this.editForm[key] = this.multipleSelection[0][key]
                }
            }else{
                this.multipleSelection = [{}];
            }
        },
        //表单清空
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dialogAddVisible = false;
            this.dialogEditVisible = false;
        },
        //表格状态 低于阈值显黄色
        tableRowClassName(row, rowIndex) {
            if (row.thresholdAmount-row.cardAmount>0) {
                return 'warning-row';
            } else{
                return '';
            }
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