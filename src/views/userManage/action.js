import {
  userListApi,
  newAddUserApi,
  validateUserApi,
  modifyUserApi,
  cancelUserApi,
  freezeUserApi,
  unFreezeUserApi,
  resetPasswordApi,
  setMenuPermissionApi,
  setRolePermissionApi,
  menuPermissionApi,
  rolePermissionApi,
  getDictApi,
  getUserDetail,
  getSelectList
} from '../../api/userManage';
import {
  roleListApi
} from '../../api/roleManage';
import { getCityList } from '../../api/cardManage';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
import loginModal from '../../components/loginModal/modal';
import { mapState, mapMutations } from 'vuex';
import { removeToken } from '@/utils/auth';
const USERSTATUS = ['', '启用', '禁用', '注销'];

export default {
  name: 'userManage',
  mixins: [butVisibleMixin, publicMethod],
  data() {
    var validateUserTitle = (rule, value, callback) => {
      /*if (this.userNameExist) {
        callback('用户名存在');
      } else {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback('用户名不能有汉字');
        } else {
          callback();
        }
      } */
      if (value) {
        if (/[\u4e00-\u9fa5]/.test(value)) {
          callback('用户名不能有汉字');
        } else {
          validateUserApi({ params: value }).then(res => {
            if (res.result.isExist) {
              callback('用户名存在');
            } else {
              callback();
            }
          });
        }
      } else {
        callback('用户名不能为空');
      }
    };
    return {
      pageId: '201',
      form: {
        userNum: '',
        userName: '',
        userRole: '',
        userState: ''
      },
      tableData: [],
      totalUsers: 0,
      currentPage: 1,
      pageSize: 20,
      multipleSelection: [],
      dialogNewAddVisible: false,
      dialogCheckVisible: false,
      dialogModifyVisible: false,
      dialogCancelVisible: false,
      dialogPassResetVisible: false,
      dialogFreezeVisible: false,
      dialogUnfreezeVisible: false,
      dialogRoleDistributeVisible: false,
      dialogRightModifyVisible: false,
      newAddUser: {
        userTitle: '',
        userName: '',
        telephone: '',
        callNum: '',
        email: '',
        activeCity: undefined,
        remark: ''
      },
      newAddUserRules: {
        userTitle: [{ validator: validateUserTitle, trigger: 'blur' }, { required: true, message: '请输入用户名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        telephone: [{ message: '手机号码长度不符合要求', min: 11, max: 11, trigger: 'blur' }],
        callNum: [{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }, { min: 6, max: 50, message: '最少6个字符最多50个字符', trigger: 'blur' }],
        activeCity: [{ required: true, message: '请选择城市', trigger: 'change' }],
        remark: [{ min: 1, max: 10, message: '最少1个字符最多，最多100个字符', trigger: 'blur' }]
      },
      modifyUserRules: {
        userName: [{ validator: validateUserTitle, trigger: 'blur' }, { required: true, message: '请输入用户名称', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }, { max: 20, message: '最长20个字符', trigger: 'blur' }],
        mobile: [{ message: '手机号码长度不符合要求', min: 11, max: 11, trigger: 'blur' }],
        phone: [{ trigger: 'blur', message: '最少1个字符最多20个字符', min: 1, max: 20 }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }, { min: 6, max: 50, message: '最少6个字符最多50个字符', trigger: 'blur' }],
        cityId: [{ required: true, message: '请选择城市', trigger: 'change' }],
        remark: [{ min: 1, max: 10, message: '最少1个字符最多，最多100个字符', trigger: 'blur' }]
      },
      userNameExist: false,
      checkUserInfoData: {},
      modifyUserInfoData: {},
      cancelUserInfoData: {},
      labelPosition: 'right',
      multipleSelectionRoleDis: [],
      roleDistributeData: [],
      checkedRoleData: [],

      rightsModifyData: [],
      //默认选择的数据集：角色当前拥有的权限ids
      checkedKeysData: [],
      //菜单列表
      menuList: [],
      userRoleOptions: [],
      userStateList: [],
      currentPage1: 1,
      isCancel: false,
      dialogVisibles: [
        'dialogNewAddVisible',
        'dialogCheckVisible',
        'dialogModifyVisible',
        'dialogCancelVisible',
        'dialogPassResetVisible',
        'dialogFreezeVisible',
        'dialogUnfreezeVisible',
        'dialogRoleDistributeVisible',
        'dialogRightModifyVisible'
      ],
      loading: true,
      noTableData: ' ',
      cityMenu: []
    }
  },
  created() {
    this.getPostList();
    this.getUserList(undefined, true);
    this.getUserStateList();
    this.getCityMenu();
    console.log(1);
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo,
      openModals: state => state.app.openModals
    })
  },
  methods: {
    getPostList() {
      const params = { pageSize: 9999 };
      roleListApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.userRoleOptions = res.result.rows;
        }
      });
    },
    addUserInfo() {
      this.dialogNewAddVisible = true;
    },
    //添加用户
    handleNewAddUser() {
      this.$refs.newAddUser.validate((valid) => {
        if (valid) {
          const params = { userName: this.newAddUser.userTitle, realName: this.newAddUser.userName, mobile: this.newAddUser.telephone || null, phone: this.newAddUser.callNum || null, email: this.newAddUser.email || null, cityId: this.newAddUser.activeCity, remark: this.newAddUser.others || null };
          newAddUserApi({ params }).then(res => {
            if (res.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '添加用户成功',
                type: 'success',
                duration: 1000
              });
              this.dialogNewAddVisible = false;
              this.getUserList();
            }
          });
        } else {
          return false;
        }
      });
    },
    //查看用户
    checkUserInfo() {
      if (this.multipleSelection.length === 1) {
        getUserDetail({ params: this.multipleSelection[0].id }).then(res => {
          if (res.errcode === '0000') {
            this.checkUserInfoData = res.result;
            this.dialogCheckVisible = true;
          }
        });
      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户查看' : '只能选择一条用户查看',
          duration: 600
        });
      }
    },
    //修改用户信息
    modifyUserInfo() {
      if (this.multipleSelection.length === 1) {
        getUserDetail({ params: this.multipleSelection[0].id }).then(res => {
          if (res.errcode === '0000') {
            this.modifyUserInfoData = res.result;
            this.modifyUserInfoData.cityId = this.modifyUserInfoData.cityId;
            this.dialogModifyVisible = true;
          }
        });
      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户修改' : '只能选择一条用户修改',
          duration: 600
        });
      }
    },
    //修改用户
    handleModifyUser() {
      this.$refs.modifyUserForm.validate((valid) => {
        if (valid) {
          const params = { id: this.modifyUserInfoData.id, realName: this.modifyUserInfoData.realName, mobile: this.modifyUserInfoData.mobile, phone: this.modifyUserInfoData.phone, email: this.modifyUserInfoData.email, cityId: this.modifyUserInfoData.cityId, remark: this.modifyUserInfoData.remark };
          modifyUserApi({ params }).then(res => {
            if (res.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '修改用户成功',
                type: 'success',
                duration: 1000
              });
              this.dialogModifyVisible = false;
              this.getUserList(this.currentPage);
            }
          });
        } else {
          return false;
        }
      })
    },
    //启用、禁用、注销用户
    cancleUserInfo(type) {
      if (this.multipleSelection.length === 1) {
        this.cancelUserInfoData = { ...this.multipleSelection[0] };
        if (type === 'cancel') {
          if (this.cancelUserInfoData.status === '3') {
            this.$notify({
              title: '警告',
              message: '此用户已注销',
              type: 'warning',
              duration: 1000
            });
          } else {
            this.cancelUserInfoData.reason = '';
            this.dialogCancelVisible = true;
          }
        } else if (type === 'freeze') {
          if (this.cancelUserInfoData.status === '2') {
            this.$notify({
              title: '警告',
              message: '此用户已冻结',
              type: 'warning',
              duration: 1000
            });
          } else {
            this.cancelUserInfoData.reason = '';
            this.dialogFreezeVisible = true;
          }
        } else {
          if (this.cancelUserInfoData.status === '2') {
            this.cancelUserInfoData.reason = '';
            this.dialogUnfreezeVisible = true;
          } else {
            this.$notify({
              title: '警告',
              message: '此用户不需要解冻',
              type: 'warning',
              duration: 1000
            });
          }
        }

      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户修改' : '只能选择一条用户修改',
          duration: 600
        });
      }
    },
    //注销用户
    handleCancelUser() {
      const params = { id: this.cancelUserInfoData.id, reason: this.cancelUserInfoData.reason || '' };
      cancelUserApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '注销用户成功',
            type: 'success',
            duration: 1000
          });
          this.dialogCancelVisible = false;
          this.getUserList(this.currentPage);
        }
      });
    },
    //禁用用户
    handleFreezeUser() {
      const params = { id: this.cancelUserInfoData.id, reason: this.cancelUserInfoData.reason || '' };
      freezeUserApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '冻结用户成功',
            type: 'success',
            duration: 1000
          });
          this.dialogFreezeVisible = false;
          /*this.$store.dispatch('LogOut').then(() => {
            location.reload();   // freeze user can not any api
          })*/
          removeToken();
          this.$router.push('/login');
          return;
          this.getUserList(this.currentPage);
        }
      });
    },
    //启用用户
    handleUnfreezeUser() {
      const params = { id: this.cancelUserInfoData.id, reason: this.cancelUserInfoData.reason || '' };
      unFreezeUserApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '解冻用户成功',
            type: 'success',
            duration: 1000
          });
          this.dialogUnfreezeVisible = false;
          this.getUserList(this.currentPage);
        }
      });
    },
    //重置密码
    resetPassword() {
      if (this.multipleSelection.length === 1) {
        this.dialogPassResetVisible = true;
      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户修改' : '只能选择一条用户修改',
          duration: 600
        });
      }
    },
    //重置密码
    handleResetPassword() {
      resetPasswordApi({ params: this.multipleSelection[0].id }).then(res => {
        if (res.errcode = '0000') {
          this.$notify({
            title: '成功',
            message: '重置密码成功',
            type: 'success',
            duration: 1000
          });
          this.dialogPassResetVisible = false;
        }
      });
    },
    //查询用户列表
    queryUserList() {
      this.getUserList(this.currentPage);
    },
    //获取用户列表
    getUserList(pageNo,isFirst) {
      const currentPage = pageNo || 1;
      const params = { pageNo: currentPage, pageSize: this.pageSize, id: this.form.userNum || null, userName: this.form.userName || null, status: this.form.userState || null, roleId: this.form.userRole }
      userListApi({ params }).then(res => {
        this.totalUsers = res.result.totalCount;
        this.tableData = res.result.rows.filter((item) => {
          return item;
        });
        this.loading = false;
        if (isFirst) {
          const whichDialog = this.openModals.find(el => {
            return el.pageId === this.pageId;
          });
          if ( whichDialog && whichDialog.openModal === 'dialogNewAddVisible') {
            this.newAddUser = whichDialog.data;
            this[whichDialog.openModal] = true;
          } else if (whichDialog) {
            this.$nextTick(() => {
              whichDialog.data.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
              });
              if (whichDialog.openModal === 'dialogCheckVisible') {
                this.checkUserInfo();
              } else if(whichDialog.openModal === 'dialogModifyVisible') {
                this.modifyUserInfo();
              } else if(whichDialog.openModal === 'dialogCancelVisible') {
                this.cancleUserInfo('cancel');
              } else if(whichDialog.openModal === 'dialogPassResetVisible') {
                this.resetPassword();
              } else if(whichDialog.openModal === 'dialogFreezeVisible') {
                this.cancleUserInfo('freeze');
              } else if(whichDialog.openModal === 'dialogUnfreezeVisible') {
                this.cancleUserInfo('unfreeze');
              } else if(whichDialog.openModal === 'dialogRoleDistributeVisible') {
                this.roleDistribute();
              } else if(whichDialog.openModal === 'dialogRightModifyVisible') {
                this.modifyRights();
              }
            })
          }
        }
      });
    },
    getUserStateList() {
      getSelectList({ params: { code: '1011' } }).then(res => {
        if (res.errcode === '0000') {
          this.userStateList = res.result;
        }
      });
    },
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
    //清除查询条件
    clearQueryParams() {
      for (let key in this.form) {
        this.form[key] = ''
      }
    },
    //用户table，选择时触发事件
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //角色table，选择时触发事件
    handleSelectionRoleDisChange(val) {
      this.multipleSelectionRoleDis = val;
    },
    //分页栏，点击页码时触发事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList(val);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList(this.currentPage);
    },
    //清除新增用户model
    clearNewAdd() {
      for (let key in this.newAddUser) {
        this.newAddUser[key] = '';
      }
      this.$refs.newAddUser.resetFields();
      this.userNameExist = false;
    },
    //重置用户名是否存在flag
    resetUserNameExist() {
      this.userNameExist = false;
    },

    //角色分配
    roleDistribute() {
      if (this.multipleSelection.length === 1) {
        //获取用户id
        const id = this.multipleSelection[0].id;
        //查询角色列表及用户角色权限
        rolePermissionApi({ params: id }).then(res => {
          if (res.errcode === '0000') {
            this.dialogRoleDistributeVisible = true;
            this.roleDistributeData = res.result.roles;
            this.checkedRoleData = res.result.permissionIds;
            this.$nextTick(function() {
              this.checkedRole(); //初始化用户角色权限
            });
          }
        });

      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户修改' : '只能选择一条用户修改',
          duration: 600
        });
      }
    },

    //初始化用户角色权限：设置默认值
    checkedRole() {
      this.roleDistributeData.forEach(row => {
        if (this.isDistributeRole(row.id)) {
          this.$refs.roleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.roleTable.toggleRowSelection(row, false);
        }
      });
    },

    //判断用户是否分配了角色
    isDistributeRole(roleId) {
      for (var i = 0; i < this.checkedRoleData.length; i++) {
        if (this.checkedRoleData[i] == roleId) {
          return true;
        }
      }
      return false;
    },

    //设置角色权限
    setRolePermission() {
      let userId = this.multipleSelection[0].id;
      let roleIds = this.buildRoleIds();
      const params = { userId: userId, roleIds: roleIds };
      setRolePermissionApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '角色分配成功',
            type: 'success',
            duration: 1000
          });
          this.getUserList(this.currentPage);
          this.dialogRoleDistributeVisible = false;
        }
      });
    },
    //菜单树，选择节点时触发事件
    handleRightsModifyChange(data, checked, indeterminate) {},

    buildRoleIds() {
      var roleIds = new Array();
      for (var i = 0; i < this.multipleSelectionRoleDis.length; i++) {
        roleIds.push(this.multipleSelectionRoleDis[i].id);
      }
      return roleIds.join(',');
    },
    //修改菜单权限
    modifyRights() {
      if (this.multipleSelection.length === 1) {
        let userId = this.multipleSelection[0].id;

        menuPermissionApi({ params: userId }).then(res => {
          if (res.errcode === '0000') {
            this.dialogRightModifyVisible = true;
            this.rightsModifyData = [];
            this.rightsModifyData[0] = res.result.menuTree;
            this.checkedKeysData = res.result.permissionIds;
            this.menuList = res.result.menuList;
            this.$nextTick(function() {
              this.$refs.permissionDialog.scrollTop = 0;
              this.checkedMenu();
            });
          }
        });

      } else {
        this.$notify.warning({
          title: '消息',
          message: this.multipleSelection.length === 0 ? '请选择一条用户修改' : '只能选择一条用户修改',
          duration: 600
        });
      }
    },
    //设置用户菜单权限：设置默认值
    checkedMenu() {
      for (var i = 0; i < this.menuList.length; i++) {
        this.$refs.tree.setChecked(this.menuList[i].id, false);
      }
      for (var i = 0; i < this.checkedKeysData.length; i++) {
        this.$refs.tree.setChecked(this.checkedKeysData[i], true);
      }
    },

    //根据menuCode查找menuId
    findMenuId(menuCode) {
      return this.menuList.filter((item) => {
        return item.code === menuCode;
      })[0].id;
    },

    //设置菜单权限
    setMenuPermission() {
      let userId = this.multipleSelection[0].id;
      var menuIds = this.$refs.tree.getCheckedKeys().join(",");
      var params = { userId: userId, menuIds: menuIds };
      setMenuPermissionApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '权限设置成功',
            type: 'success',
            duration: 1000
          });
          this.dialogRightModifyVisible = false;
        }
      });
    },

    //禁用某行
    checkSelectable(row, index) {
      if (row.disabled && this.isDistributeRole(row.id)) {
        return false;
      }
      return true;
    },
    getCityMenu() {
        const params = { level: '2' };
        getCityList({ params }).then(res => {
            this.cityMenu = res.result;
            this.cityMenu.unshift({ id: 0, label: '全国', children: [{ id: 0, code: '0', label: '全国'}]});
        });
    },
    ...mapMutations({
      addOpenModals: 'ADD_OPEN_MODALS',
      removeOpenModals: 'REMOVE_OPEN_MODALS'
    })
  },
  watch: {
    multipleSelection(newValue) {
      if (newValue.length === 0) {
        this.isCancel = false;
      } else {
        if (newValue.some((e) => {
          return e.status === '3';
        })) {
          this.isCancel = true;
        } else {
          this.isCancel = false;
        }
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      // const whichDialog = vm.openModals.find(el => {
      //   return el.pageId === vm.pageId;
      // });
      // if ( whichDialog && whichDialog.openModal === 'dialogNewAddVisible') {
      //   vm.newAddUser = whichDialog.data;
      //   vm[whichDialog.openModal] = true;
      // } else if (whichDialog) {
      //   whichDialog.data.forEach(row => {
      //     vm.$refs.multipleTable.toggleRowSelection(row);
      //   });
      //   vm[whichDialog.openModal] = true;
      // }
    })
  },
  beforeRouteLeave(to, from, next) {
    const dialogVisible = this.dialogVisibles.find(el => {
      return this[el];
    });
    var data;
    if (dialogVisible) {
      if (dialogVisible === this.dialogVisibles[0]) {
        data = this.newAddUser;
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
