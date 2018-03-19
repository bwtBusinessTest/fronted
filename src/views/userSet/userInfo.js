import { mapState } from 'vuex'
import { 
	modifyUserApi,
  validateUserApi,
	userDetailApi
} from '../../api/userManage'
import butVisibleMixin from '../../utils/buttonVisible';

export default {
  mixins: [butVisibleMixin],
  data(){
    var validateUserTitle = (rule, value, callback) => {
      if (this.userNameExist) {
        callback('用户名存在');
      } else {
        callback();
      }
    };
  	return {
      modifyUserRules: {
        userName: [{ validator: validateUserTitle, trigger: 'blur' }, { required: true, message: '请输入用户名称', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        phone: [{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        mobile: [{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        remark: [{ max: 500, message: '最多500个字符', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },{ max: 100, message: '最多100个字符', trigger: 'blur' }]
      },
      pageId: '21201',
  		modifyUserInfoData: {},
  		userId: ''
  	}
  },
  created(){
  	this.getUserDetailInfo();
  },
  computed: {
    ...mapState({
    	userInfo: state => state.user.userInfo
    })
  },
  methods:{
    //验证用户名是否存在
    sendValidateUser(type) {
      let name = '';
      if (type === 'newAdd') {
        name = this.newAddUser.userTitle;
      } else {
        name = this.modifyUserInfoData.userName;
      }
      if (name) {
        validateUserApi({ params: name }).then(res => {
          if (res.result.isExist) {
            this.userNameExist = true;
          } else {
            this.userNameExist = false;
          }
        });
      } else {
        this.userNameExist = false;
      }

    },
  	getUserDetailInfo(){
  		this.userId = this.userInfo.id;
  		userDetailApi({params: this.userId}).then(res =>{
			if (res.errcode === '0000') {
				this.modifyUserInfoData = res.result;
	        }
  		});
  	},
  	handleModifyUser(){
      this.$refs.modifyUserForm.validate((valid) => {
        if (valid) {
      		const params = { id: this.modifyUserInfoData.id, realName: this.modifyUserInfoData.realName, mobile: this.modifyUserInfoData.mobile, 
      			phone: this.modifyUserInfoData.phone, email: this.modifyUserInfoData.email, remark: this.modifyUserInfoData.remark };
          	modifyUserApi({ params }).then(res => {
              if (res.errcode === '0000') {
                this.$notify({
                  title: '成功',
                  message: '修改用户成功',
                  type: 'success',
                  duration: 1000
                });
              }
          	});
          }
        });
	}
  }
}