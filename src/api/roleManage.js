import fetch from '@/utils/fetch';

// 获取角色列表
export function roleListApi({ params }) {
    return fetch({
        url: '/role/list',
        method: 'post',
        data: params
    });
}

// 添加角色
export function addRoleApi({ params }) {
    return fetch({
        url: 'role/add',
        method: 'post',
        data: params
    });
}

// 验证角色编号是否存在
export function validateRoleNoApi({ params }) {
    return fetch({
        url: `role/existNo/${params}`,
        method: 'get'
    });
}

// 验证角色名称是否存在
export function validateRoleNameApi({ params }) {
    return fetch({
        url: `role/existName/${params}`,
        method: 'get'
    });
}

// 修改角色
export function modifyRoleApi({ params }) {
    return fetch({
        url: 'role/modify',
        method: 'post',
        data: params
    });
}

// 删除角色
export function deleteRoleApi({ params }) {
    return fetch({
        url: `role/remove/${params}`,
        method: 'get'
    });
}

// 获取角色菜单权限
export function menuPermissionApi({ params }) {
    return fetch({
        url: `role/menu/${params}`,
        method: 'get'
    });
}

// 设置角色菜单权限
export function setPermissionApi({ params }) {
    return fetch({
        url: 'role/setPermission',
        method: 'post',
        data: params
    });
}
