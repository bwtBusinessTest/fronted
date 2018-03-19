/**
 * Created by rongyao on 2017/12/22.
 */
import {queryCardList,queryCardAdd,queryCardEdit,getPublishList,getCityList} from '../../api/cardManage';
import { mapState, mapMutations } from 'vuex';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
import $ from 'jquery'
export default {
  name: 'cardManage',
  data() {
    var checkNum = (rule, value, callback) => {
      let reg = /^[0-9]\d*$/;
      if (!reg.test(value)&&!value=='') {
        return callback(new Error('只能输入数字'));
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
        if (parseInt(value)>999) {
          return callback(new Error('最大三位数'));
        }else{
          return callback()
        }
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
    //小数或整数
    var checkNumAndSmall = (rule, value, callback) => {
      let reg = /^[0-9]+([.]{1}[0-9]{1,2}){0,1}$/;
      if (!reg.test(value)&&!value=='') {
        return callback(new Error('只能输数字且不能超过两位小数'));
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
    return {
      pageId: '301',
      total:0, 
      dialogAddVisible:false,
      dialogEditVisible:false,
      labelPosition: 'right',
      newAddCard:{
        cardName:'',
        cardPublish:'',
        cityId:'',
        cardCount:'',
        cardBalance:'',
        cardAmount:'',
        status:''
      },
      selectedOptions:[],
      editCard:{
        id:'',
        cardName:'',
        cardPublish:'',
        cityId:'',
        cityName:'',
        cardCount:'',
        cardBalance:'',
        cardAmount:'',
        cardPublishAmount:'',
        status:'1',
        addCount:''
      },
      //下拉数据字典
      publicMenu:[],
      cityMenu:[{
        caption:"无锡",
        value:906
      },{
        caption:"福州",
        value:1277
      }],

      form:{
        cardPublish:'',
        cardName:'',
        pageNo:1,
        pageSize:20
      },
      tableData: [],
      loading: true,
      noTableData: '',

      multipleSelection:[],
      
      formRules:{
        cardName: [{ validator: checkSpecialCode, trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }]
      },
      newAddCardRules: {
        cardName: [{ required: true, message: '请输入卡券名', trigger: 'blur' },{ validator: checkSpecialCode, trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        cardPublish: [{ required: true, message: '请选择发行方' }],
        cityId: [{ required: true, message: '请选择发行城市' }],
        cardCount: [{ required: true, type: "number", message: '请输入规格次数且必须是整数', trigger: 'blur' },{ validator: checkNum, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
        cardBalance: [{ required: true, message: '请输入单价', trigger: 'blur' },{ validator: checkNumAndSmall, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'blur' }],
        cardAmount: [{required:true, trigger: 'blur', message: '请输入库存数量'},{ validator: checkNum, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态'}]
      },
      editCardRules: {
        cardName: [{ required:true,message: '请输入卡券名', trigger: 'blur' },{ validator: checkSpecialCode, trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        cardBalance: [{required:true,message:'请输入单价' },{ validator: checkNumAndSmall, trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
        addCount: [{ validator: checkAddCount, trigger: 'blur' }, { max: 10, message: '最长10个字符', trigger: 'blur' },{ validator: checkCardCountMax, trigger: 'blur' }],
        status: [{ required: true, message: '请选择卡券状态', trigger: 'blur' }],
      },
      dialogVisibles: [
        'dialogAddVisible',
        'dialogEditVisible'
      ],
      
    }
  },
  created(){
    this.cardSearch(true);
    this.getPulicMenu();
    this.getCityMenu();
  },
  computed: {
    ...mapState({
      openModals: state => state.app.openModals
    })
  },
  methods:{
    //查询
    cardSearchTerm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.cardSearch()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //列表
    cardSearch(isFirst){
      const params = this.form;
      queryCardList({params}).then(res=>{
        if(res.errcode === '0000'){
           this.total = res.result.totalCount;
           this.tableData = res.result.rows
           this.changUse();
           this.loading = false;
           if (isFirst) {
            const whichDialog = this.openModals.find(el => {
              return el.pageId === this.pageId;
            });
            if ( whichDialog && whichDialog.openModal === 'dialogAddVisible') {
              this.newAddCard = whichDialog.data;
              this[whichDialog.openModal] = true;
            } else if (whichDialog) {
              this.$nextTick(() => {
                whichDialog.data.forEach(row => {
                  this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
                });
                if (whichDialog.openModal === 'dialogEditVisible') {
                  this.cardEdit();
                }
              })
            }
          }
        }
      })
    },
    //1:启用 0：停用
    changUse(){
      for(var i=0;i<this.tableData.length;i++){
        if(this.tableData[i].status==="1"){
          this.tableData[i].status="启用"
        }else{
          this.tableData[i].status="停用";
        }  
       }
    },
    //清空
    cardClear(){
      this.form = this.$options.data().form;
    },

    //分页
    currentChange(val){
      this.form.pageNo = val;
      const params = this.form
      queryCardList({params}).then(res=>{
        if(res.errcode === '0000'){
           this.tableData = res.result.rows;
           this.changUse();
        }
      })
    },
    sizeChange(val){
      this.form.pageSize = val;
      const params = this.form;
      queryCardList({params}).then(res=>{
        if(res.errcode === '0000'){
           this.tableData = res.result.rows;
           this.changUse();
        }
      })
    },

    cardNewAdd(){
      this.dialogAddVisible = true;
    },
    cardEdit(){
      if(this.multipleSelection&&this.multipleSelection.length===1){
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
      this.editCard.cityName = '';
      this.editCard.addCount = '';
      if(val&&val.length>0){
        for (var key in this.editCard) {
          if(key!='addCount'){
            if(key=='status'){
              if(this.multipleSelection[0][key]==="启用"){
                this.editCard[key]='1'
              }else{
                this.editCard[key]='0'
              }
            }else{
              this.editCard[key] = this.multipleSelection[0][key]
            }
          }
        }
      }
    },

//新增card
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.newAddCard;
          queryCardAdd({params}).then(res=>{
            if(res.errcode === '0000'){
              this.$notify.success({
                title: '消息',
                message: '添加成功',
                duration: 600
              });
              this.dialogAddVisible = false;
              // this.form.pageNo = 1;
              this.cardSearch();
           }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialogEditVisible = false;
      this.dialogAddVisible = false;
    },

    //编辑
    submitEditForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editCard.cardAmount += +this.editCard.addCount;
          this.editCard.cardPublishAmount =(this.editCard.cardPublishAmount-0)+(this.editCard.addCount-0);          
          delete this.editCard.addCount;
          delete this.editCard.cityName;
          const params = this.editCard;
          queryCardEdit({params}).then(res=>{
            if(res.errcode === '0000'){
              this.$notify.success({
                title: '消息',
                message: '编辑成功',
                duration: 600
              });
              this.dialogEditVisible = false;
              this.cardSearch();
           }
          })
          this.dialogEditVisible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //获取发行方数据字典
    getPulicMenu(){
      const params = {code:'1036'}
      getPublishList({params}).then(res=>{
        if(res.errcode==="0000"){
          this.publicMenu = res.result;
        }
      })
    },
    //获取城市数据字典
    getCityMenu(){
      const params = {level:"2"}
      getCityList({params}).then(res=>{
        // if(res.errcode==="0000"){
          this.cityMenu = res.result;
        // }
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
        data = this.newAddCard;
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
