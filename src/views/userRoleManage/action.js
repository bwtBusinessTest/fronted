import {
  roleListApi,
  addRoleApi,
  validateRoleNoApi,
  validateRoleNameApi,
  modifyRoleApi,
  deleteRoleApi,
  menuPermissionApi,
  setPermissionApi
} from '../../api/roleManage';
import { mapState, mapMutations } from 'vuex';
import butVisibleMixin from '../../utils/buttonVisible';
import publicMethod from '../../utils/publicMethod';
export default {
  name: 'roleManage',
  mixins: [butVisibleMixin, publicMethod],
  data() {
    //验证器：角色编号唯一
    var validateRoleNo = (rule, value, callback) => {
      if (value) {
        if (/[\u4e00-\u9fa5]+/g.test(value)) {
            callback('不能输入汉字');
          } else {
            if (/[A-Za-z0-9]+_[A-Za-z0-9]+_[A-Za-z0-9]+/g.test(value)) {
              validateRoleNoApi({ params: value}).then(res => {
                if (res.result.isExist) {
                  callback('角色编号已存在');
                } else {
                  callback()
                }
              });
            } else {
              callback('请输入类似xx_xx_xx格式');
            }
          }
      } else {
        callback('请输入角色编号');
      }
    };
    //验证器：角色名称唯一
    var validateRoleName = (rule, value, callback) => {
      if (value) {
        validateRoleNameApi({ params: value }).then(res => {
          if (res.result.isExist) {
            callback('角色名称已存在');
          } else {
            callback();
          }
        });
      } else {
        callback('请输入角色名称');
      }
    };
    return {
      //添加角色、修改角色字段验证规则
      addRoleRules: {
        roleNo: [{ validator: validateRoleNo, trigger: 'blur' }, { required: true, message: '请输入角色编号,最多20个字符', min: 1, max: 20, trigger: 'blur' }],
        roleName: [{ validator: validateRoleName, trigger: 'blur' }, { required: true, message: '请输入角色名称,最多20个字符', min: 1, max: 20, trigger: 'blur' }],
        remark: [{ required: false, message: '备注最多50个字符', min: 0, max: 50, trigger: 'blur' }]
      },
      modifyRoleRules: {
        roleNo: [{ validator: validateRoleNo, trigger: 'blur' }, { required: true, message: '请输入角色编号,最多20个字符', min: 1, max: 20, trigger: 'blur' }],
        roleName: [{ validator: validateRoleName, trigger: 'blur' }, { required: true, message: '请输入角色名称,最多20个字符', min: 1, max: 20, trigger: 'blur' }],
        remark: [{ required: false, message: '备注最多50个字符', min: 0, max: 50, trigger: 'blur' }]
      },
      //查询参数model
      queryCondition: {
        roleName: ''
      },
      //添加角色model
      addRoleData: {
        roleNo: '',
        roleName: '',
        remark: ''
      },
      //修改角色model
      modifyRoleData: {
        roleNo: '',
        roleName: '',
        remark: ''
      },
      //角色列表model
      tableData: [],
      //分页model：总数、当前页面
      total: 0,
      currentPage: 1,
      pageSize: 10,
      //当前选择的数据集
      multipleSelection: [],
      //角色名称是否存在flag
      roleNameExist: false,
      //角色编号是否存在flag
      roleNoExist: false,
      //是否显示新增窗口
      dialogAddVisible: false,
      //是否显示修改窗口
      dialogModifyVisible: false,
      //是否显示删除窗口
      dialogDeleteVisible: false,
      //是否显示权限分配窗口
      dialogRightDistributeVisible: false,
      //权限数据集
      rightsModifyData: [],
      //默认选择的数据集：角色当前拥有的权限ids
      checkedKeysData: [],
      //菜单列表
      menuList: [],
      pageId: '202',
      dialogVisibles: [
        'dialogAddVisible',
        'dialogModifyVisible',
        'dialogDeleteVisible',
        'dialogRightDistributeVisible'
      ],
      loading: true,
      noTableData: ' '
    }
  },
  //初始化查询角色列表
  created() {
    this.getRoleList(undefined, true);
  },
  methods: {
    //选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页栏点击事件
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRoleList(val);
    },
    //清除新增角色的model
    clearAddModel() {
      this.$refs["addRoleForm"].resetFields();
      for (let key in this.addRoleData) {
        this.addRoleData[key] = '';
      }
      this.roleNameExist = false;
      this.roleNoExist = false;
    },
    //清除新增角色的model
    clearModifyModel() {
      this.$refs["modifyRoleForm"].resetFields();
      for (let key in this.modifyRoleData) {
        this.modifyRoleData[key] = '';
      }
      this.roleNameExist = false;
      this.roleNoExist = false;
    },
    //添加角色
    handleAddRole() {
      this.$refs.addRoleForm.validate((valid) => {
        if (valid) {
          const params = {
            roleNo: this.addRoleData.roleNo,
            roleName: this.addRoleData.roleName,
            remark: this.addRoleData.remark == '' ? null : this.addRoleData.remark
          };
          addRoleApi({ params }).then(res => {
            if (res.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '添加角色成功',
                type: 'success',
                duration: 1000
              });
              this.dialogAddVisible = false;
              this.getRoleList(this.currentPage);
            }
          });
        } else {
          return false;
        }
      });

    },
    //修改角色
    modifyRole() {
      if (this.multipleSelection.length < 1) {
        this.showSelectDataMsg();
      } else if (this.multipleSelection.length > 1) {
        this.showSelectMoreDataMsg();
      } else {
        this.modifyRoleData = { ...this.multipleSelection[0] };
        this.dialogModifyVisible = true;
      }
    },
    //修改角色
    handleModifyRole() {
      this.$refs.modifyRoleForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.modifyRoleData.id,
            roleNo: this.modifyRoleData.roleNo,
            roleName: this.modifyRoleData.roleName,
            remark: this.modifyRoleData.remark
          };
          modifyRoleApi({ params }).then(res => {
            if (res.errcode === '0000') {
              this.$notify({
                title: '成功',
                message: '修改角色成功',
                type: 'success',
                duration: 1000
              });
              this.dialogModifyVisible = false;
              this.getRoleList(this.currentPage);
            }
          });
        } else {
          return false;
        }
      });
    },
    //删除角色
    removeRole() {
      if (this.multipleSelection.length < 1) {
        this.showSelectDataMsg();
      } else if (this.multipleSelection.length > 1) {
        this.showSelectMoreDataMsg();
      } else {
        this.dialogDeleteVisible = true;
      }
    },
    //删除角色
    handleRemoveRole() {
      if (this.multipleSelection.length > 0) {

        const id = this.multipleSelection[0].id;
        if (id == 1 || id == 2) {
          this.$notify({
            title: '提示',
            message: '基础角色，禁止删除',
            type: 'warning',
            duration: 1000
          });
          this.dialogDeleteVisible = false;
          return;
        }
        deleteRoleApi({ params: id }).then(res => {
          if (res.errcode === '0000') {
            this.$notify({
              title: '成功',
              message: '删除角色成功',
              type: 'success',
              duration: 1000
            });
            this.dialogDeleteVisible = false;
            this.getRoleList(this.currentPage);
          }
        });
      } else {
        this.showSelectDataMsg();
      }
    },

    //获取菜单权限
    getMenuPermission() {
      if (this.multipleSelection.length < 1) {
        this.showSelectDataMsg();
      } else if (this.multipleSelection.length > 1) {
        this.showSelectMoreDataMsg();
      } else {
        const id = this.multipleSelection[0].id;
        menuPermissionApi({ params: id }).then(res => {
          if (res.errcode === '0000') {
            this.dialogRightDistributeVisible = true;
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

      }
    },

    //菜单点击事件
    handleRightsModifyChange(data, checked, indeterminate) {},

    //查找menuId
    findMenuId(menuCode) {
      return this.menuList.filter((item) => {
        return item.code === menuCode;
      })[0].id;
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

    //设置角色权限
    handleSetPermission() {
      const id = this.multipleSelection[0].id;
      const menuIds = this.$refs.tree.getCheckedKeys().join(",");
      const params = { roleId: id, menuIds: menuIds };
      setPermissionApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.$notify({
            title: '成功',
            message: '权限分配成功',
            type: 'success',
            duration: 1000
          });
          this.dialogRightDistributeVisible = false;
          this.getRoleList(this.currentPage);
        }
      });
    },

    //查询角色列表
    queryRoleList() {
      this.getRoleList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRoleList(this.currentPage);
    },
    //获取角色列表
    getRoleList(pageNo, isFirst) {
      const currentPage = pageNo || 1;
      const params = { pageNo: currentPage, pageSize: this.pageSize, roleName: this.queryCondition.roleName || null };
      roleListApi({ params }).then(res => {
        this.total = res.result.totalCount;
        this.tableData = res.result.rows;
        this.loading = false;
        if (isFirst) {
          const whichDialog = this.openModals.find(el => {
            return el.pageId === this.pageId;
          });
          if ( whichDialog && whichDialog.openModal === 'dialogAddVisible') {
            this.addRoleData = whichDialog.data;
            this[whichDialog.openModal] = true;
          } else if (whichDialog) {
            this.$nextTick(() => {
              whichDialog.data.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(this.tableData.find((ele) => { return ele.id === row.id }));
              });
              if (whichDialog.openModal === 'dialogModifyVisible') {
                this.modifyRole();
              } else if(whichDialog.openModal === 'dialogDeleteVisible') {
                this.removeRole();
              } else if(whichDialog.openModal === 'dialogRightDistributeVisible') {
                this.getMenuPermission();
              }
            })
          }
        }
      });
    },
    //验证角色编号是否重复
    sendValidateRoleNo(type) {
      let roleNo = ''
      if (type === 'newAdd') {
        roleNo = this.addRoleData.roleNo;
      } else {
        roleNo = this.modifyRoleData.roleNo;
        if (roleNo === this.multipleSelection[0].roleNo) {
          this.roleNoExist = false;
          return;
        }
      }
      if (roleNo) {
        validateRoleNoApi({ params: roleNo }).then(res => {
          if (res.result.isExist) {
            this.roleNoExist = true;
          } else {
            this.roleNoExist = false;
          }
        });
      } else {
        this.roleNoExist = false;
      }

    },
    //验证角色名称是否重复
    sendValidateRoleName(type) {
      let roleName = ''
      if (type === 'newAdd') {
        roleName = this.addRoleData.roleName;
      } else {
        roleName = this.modifyRoleData.roleName;
        if (roleName === this.multipleSelection[0].roleName) {
          this.roleNameExist = false;
          return;
        }
      }
      if (roleName) {
        validateRoleNameApi({ params: roleName }).then(res => {
          if (res.result.isExist) {
            this.roleNameExist = true;
          } else {
            this.roleNameExist = false;
          }
        });
      } else {
        this.roleNameExist = false;
      }

    },
    //清除查询条件
    clearQueryParams() {
      for (let key in this.queryCondition) {
        this.queryCondition[key] = ''
      }
    },
    //显示未选择数据消息提醒
    showSelectDataMsg() {
      this.$notify({
        title: '提示',
        message: '请选择数据',
        type: 'warning',
        duration: 1000
      });
    },
    //显示选择多条数据消息提醒
    showSelectMoreDataMsg() {
      this.$notify({
        title: '提示',
        message: '只能选择一条数据',
        type: 'warning',
        duration: 1000
      });
    },
    ...mapMutations({
      addOpenModals: 'ADD_OPEN_MODALS',
      removeOpenModals: 'REMOVE_OPEN_MODALS'
    })
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
        data = this.addRoleData;
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
