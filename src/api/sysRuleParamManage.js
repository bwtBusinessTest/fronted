import fetch from '@/utils/fetch';

export function ruleParamListApi({ params }) {
    return fetch({
        url: '/sysRuleParam/queryRuleParamList',
        method: 'post',
        data: params
    });
}

export function newAddRuleParamApi({ params }) {
    return fetch({
        url: '/sysRuleParam/add',
        method: 'post',
        data: params
    });
}

export function modifyRuleParamApi({ params }) {
    return fetch({
        url: '/sysRuleParam/modify',
        method: 'post',
        data: params
    });
}

export function deleteBatchRuleParamApi({ params }) {
    return fetch({
        url: '/sysRuleParam/delete',
        method: 'post',
        data: params
    });
}

export function enableBatchRuleParamApi({ params }) {
    return fetch({
        url: '/sysRuleParam/enable',
        method: 'post',
        data: params
    });
}

export function disableBatchRuleParamApi({ params }) {
    return fetch({
        url: '/sysRuleParam/disable',
        method: 'post',
        data: params
    });
}

// export function disableRuleParamApi({ params }) {
//  return fetch({
//      url: `sysRuleParam/disable/${params}`,
//      method: 'get',
//      data: params
//  })
// }

export function checkRuleParamApi({ params }) {
    return fetch({
        url: `/sysRuleParam/check/${params}`,
        method: 'get',
        data: params
    });
}

// 验证变量名是否重复
export function validateVariableNameApi({ params }) {
    return fetch({
        url: `/sysRuleParam/exist/${params}`,
        method: 'get'
    });
}
