import fetch from '@/utils/fetch';

export function sysTemplateListApi({ params }) {
    return fetch({
        url: '/sysTemplate/queryTemplateList',
        method: 'post',
        data: params
    });
}

export function newAddTemplateApi({ params }) {
    return fetch({
        url: '/sysTemplate/add',
        method: 'post',
        data: params
    });
}

export function deleteBatchTemplateApi({ params }) {
    return fetch({
        url: `/sysTemplate/delete`,
        method: 'post',
        data: params
    });
}

export function modifyTemplateApi({ params }) {
    return fetch({
        url: '/sysTemplate/modify',
        method: 'post',
        data: params
    });
}

export function disableBatchTemplateApi({ params }) {
    return fetch({
        url: `/sysTemplate/disable`,
        method: 'post',
        data: params
    });
}

export function enableBatchTemplateApi({ params }) {
    return fetch({
        url: `/sysTemplate/enable`,
        method: 'post',
        data: params
    });
}

export function createTemplateApi({ params }) {
    return fetch({
        url: `/sysTemplate/createTemplate/${params}`,
        method: 'get',
        data: params
    });
}

export function previewApi({ params }) {
    return fetch({
        url: `/sysTemplate/preview/${params}`,
        method: 'get',
        data: params
    });
}

// 验证模板名是否重复
export function validateTemplateNameApi({ params }) {
    return fetch({
        url: `/sysTemplate/exist/${params}`,
        method: 'get'
    });
}

export function checkTemplateApi({ params }) {
    return fetch({
        url: `/sysTemplate/check/${params}`,
        method: 'get',
        data: params
    });
}
