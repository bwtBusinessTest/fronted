import { mapState } from 'vuex'
import { 
	setNewPwdApi
} from '../../api/userManage'
import butVisibleMixin from '../../utils/buttonVisible';
import getmd5 from '../../utils/encrypt';
import passwordStrongValidate from '../../components/passwordStrongValidate/index';

export default {
  mixins: [butVisibleMixin],
  data(){
    var validateEnsurePassword = (rule, value, callback) => {
      if (!this.passwordSameFlag) {
        callback('确认密码与新密码不一致');
      } else {
        callback();
      }
    };
  	return {
      modifyPasswordRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }],
        ensurePassword: [{ required: true, message: '请输入确认密码', trigger: 'blur' }, { validator: validateEnsurePassword, trigger: 'blur' },{ max: 50, message: '最多50个字符', trigger: 'blur' }]
      },
      pageId: '21202',
      passwordSameFlag: false,
  		passWord: {
        ensurePassword: '',
        newPassword: '',
        oldPassword: ''
      },
  	}
  },
  computed: {
    ...mapState({
    	userInfo: state => state.user.userInfo
    })
  },
  components: {
    passwordStrongValidate
  },
  methods:{
    inputPassword(){
      if(this.passWord.newPassword == this.passWord.ensurePassword){
        this.passwordSameFlag = true;
      }else{
        this.passwordSameFlag = false;
      }
    },
  	handleModifyPassword(){
      this.$refs.modifyUserInfoData.validate((valid) => {
        if (valid) {
          if(this.passWord.ensurePassword != this.passWord.newPassword){
            this.$notify({
                title: '失败',
                message: '确认密码与新密码不一致',
                type: 'fail',
                duration: 1000
              });
            return;
          }
      		const params = { id: this.userInfo.id, oldPwd: getmd5(this.passWord.oldPassword), newPwd: getmd5(this.passWord.newPassword) };
          	setNewPwdApi({ params }).then(res => {
    	        if (res.errcode === '0000') {
    	          this.$notify({
    	            title: '成功',
    	            message: '修改密码成功',
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