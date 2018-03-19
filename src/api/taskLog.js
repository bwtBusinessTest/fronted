import fetch from '@/utils/fetch';

export function getTaskLogLists({ params }) {
    return fetch({
        url: '/schedule/tasklog/list',
        method: 'post',
        data: params
    })
}

export function againExecuteApi({ params }) {
    return fetch({
        url: `/schedule/tasklog/exec/${params}`,
        method: 'get'
    })
}

export function confirmExecuteApi({ params }, url) {
    return fetch({
        url: url,
        method: 'post',
        data: params
    })
}