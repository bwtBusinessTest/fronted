import fetch from '@/utils/fetch'

// 获取用户列表
export function userListApi({ params }) {
  return fetch({
    url: '/user/list',
    method: 'post',
    data: params
  })
}

// 获取用户信息
export function userDetailApi({ params }) {
  return fetch({
    url: `/user/detail/${params}`,
    method: 'get'
  })
}

// 新增 用户
export function newAddUserApi({ params }) {
  return fetch({
    url: 'user/add',
    method: 'post',
    data: params
  })
}

// 验证用户名是否重复
export function validateUserApi({ params }) {
  return fetch({
    url: `user/exist/${params}`,
    method: 'get'
  });
}

// 修改用户
export function modifyUserApi({ params }) {
  return fetch({
    url: 'user/modify',
    method: 'post',
    data: params
  })
}

// 注销用户
export function cancelUserApi({ params }) {
  return fetch({
    url: 'user/cancel',
    method: 'post',
    data: params
  })
}

// 冻结用户
export function freezeUserApi({ params }) {
  return fetch({
    url: 'user/disable',
    method: 'post',
    data: params
  })
}

// 解冻用户
export function unFreezeUserApi({ params }) {
  return fetch({
    url: 'user/enable',
    method: 'post',
    data: params
  })
}

// 密码重置
export function resetPasswordApi({ params }) {
  return fetch({
    url: `user/resetPwd/${params}`,
    method: 'get'
  });
}

//设置密码
export function setNewPwdApi({ params }) {
  return fetch({
    url: 'user/setNewPwd',
    method: 'post',
    data: params
  })
}

//获取用户角色权限
export function rolePermissionApi({ params }) {
  return fetch({
    url: `user/role/${params}`,
    method: 'get'
  })
}

//获取用户菜单权限
export function menuPermissionApi({ params }) {
  return fetch({
    url: `user/menu/${params}`,
    method: 'get'
  })
}

//设置用户角色权限
export function setRolePermissionApi({ params }) {
  return fetch({
    url: 'user/setRolePermission',
    method: 'post',
    data: params
  })
}

//设置用户菜单权限
export function setMenuPermissionApi({ params }) {
  return fetch({
    url: 'user/setMenuPermission',
    method: 'post',
    data: params
  })
}

//获取字典数据
export function getDictApi({ params }) {
  return fetch({
    url: 'dict/getDictByCode',
    method: 'post',
    data: params
  })
}

export function getUserDetail({ params }) {
  return fetch({
    url: `user/detail/${params}`,
    method: 'get'
  })
}

export function getSelectList({ params }) {
  return fetch({
    url: '/dict/getDictByCode',
    method: 'post',
    data: params
  })
}