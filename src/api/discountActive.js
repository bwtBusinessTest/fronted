import fetch from '@/utils/fetch';

export function getQueryDiscountLists({ params }) {
    return fetch({
        url: '/activity/charge/queryDiscount',
        method: 'post',
        data: params
    })
}

export function addActive({ params }) {
    return fetch({
        url: '/activity/charge/addDiscount',
        method: 'post',
        data: params
    })
}

export function modifyActive({ params }) {
    return fetch({
        url: '/activity/charge/updateDiscount',
        method: 'post',
        data: params
    })
}

export function addCardBinApi({ addParams }) {
    return fetch({
        url: '/activity/charge/addDisctCard',
        method: 'post',
        data: addParams
    })
}

export function deleteCardBinApi({ deleteParams }) {
    return fetch({
        url: '/activity/charge/deleteDisctCard',
        method: 'post',
        data: deleteParams
    })
}

export function queryDisctCard({ params }) {
    return fetch({
        url: '/activity/charge/queryDisctCard',
        method: 'post',
        data: params
    })
}