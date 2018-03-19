import fetch from '@/utils/fetch';

export function getAdLists({ params }) {
    return fetch({
        url: '/ad/ad/queryAdList',
        method: 'post',
        data: params
    })
}

export function getAdvertiser({ params }) {
    return fetch({
        url: '/ad/ad/getAdvertiser',
        method: 'post',
        data: params
    })
}

export function getAdDetail({ params }) {
    return fetch({
        url: '/ad/ad/detail/' + params,
        method: 'get'
    })
}

export function adUndercarriage({ params }) {
    return fetch({
        url: '/ad/ad/offShelf',
        method: 'post',
        data: params
    })
}

export function adUpcarriageApply({ params }) {
    return fetch({
        url: '/ad/ad/upShelf',
        method: 'post',
        data: params
    })
}

export function adWithdraw({ params }) {
    return fetch({
        url: '/ad/ad/revocation',
        method: 'post',
        data: params
    })
}

export function getAdMaterial({ params }) {
    return fetch({
        url: '/ad/adMateriel/queryPage',
        method: 'post',
        data: params
    })
}

export function getAdPosition({ params }) {
    return fetch({
        url: '/ad/adSense/queryPage',
        method: 'post',
        data: params
    })
}

export function getCity({ params }) {
    return fetch({
        url: '/treeDict/getCityByUserCityId',
        method: 'post',
        data: params
    })
}

export function getCityListByUser({ params }) {
    return fetch({
        url: '/treeDict/getCityTreeByUserCityId',
        method: 'post',
        data: params
    })
}

export function addAdvertise({ params }) {
    return fetch({
        url: '/ad/ad/add',
        method: 'post',
        data: params
    })
}

export function addAndApplyShelveAdvertise({ params }) {
    return fetch({
        url: '/ad/ad/addAndUpShelf',
        method: 'post',
        data: params
    })
}

export function getAdSensesByAdId({ params }) {
    return fetch({
        url: '/ad/adSense/queryAdSensesByAdId',
        method: 'post',
        data: params
    })
}

export function getAdSensesByAdIdNoPage({ params }) {
    return fetch({
        url: '/ad/adSense/queryAdSenseListByAdId',
        method: 'post',
        data: params
    })
}

export function modifyAdvertise({ params }) {
    return fetch({
        url: '/ad/ad/modify',
        method: 'post',
        data: params
    })
}

export function modifyAndApplay({ params }) {
    return fetch({
        url: '/ad/ad/modifyAndUpShelf',
        method: 'post',
        data: params
    })
}

export function adCheck({ params }) {
    return fetch({
        url: '/ad/ad/check',
        method: 'post',
        data: params
    })
}

export function disabledAdPosition({ params }) {
    return fetch({
        url: '/ad/adSense/disableAd',
        method: 'post',
        data: params
    })
}

export function enabledAdPosition({ params }) {
    return fetch({
        url: '/ad/adSense/enableAd',
        method: 'post',
        data: params
    })
}

export function getAdSenseById({ params }) {
    return fetch({
        url: '/ad/adSense/queryAdSenseById',
        method: 'post',
        data: params
    })
}

export function getAdSenseByIdAndCityId({ params }) {
    return fetch({
        url: '/ad/adSense/queryAsByIdAndCityId',
        method: 'post',
        data: params
    })
}

export function validateAdNameIsSame({ params }) {
    return fetch({
        url: `/ad/ad/exist/${params}`,
        method: 'get'
    })
}