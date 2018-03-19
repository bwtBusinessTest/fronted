import fetch from '@/utils/fetch'

export function getRetailOrders({ params }) {
	return fetch({
		url: '/distributorCardOrder/queryCardOrderList',
		method: 'post',
		data: params
	})
}

export function getRefundOrders({ params }) {
    return fetch({
        url: '/distributorCardOrder/queryBackCardOrderList',
        method: 'post',
        data: params
    })
}

export function getRetailOrderInfo({ params }) {
    return fetch({
        url: '/distributorCardOrder/queryCardOrderById',
        method: 'post',
        data: params
    })
}

export function retailOrderDownloadUrl() {
    return process.env.BASE_API + '/distributorCardOrder/download';
}

export function refundOrderDownloadUrl() {
    return process.env.BASE_API + '/distributorCardOrder/downloadBackOrder';
}

export function returnGoodsSubmit({ params }) {
    return fetch({
        url: '/distributorCardOrder/addBackCardOrder',
        method: 'post',
        data: params
    })
}

export function getReturnGoodsApplicationInfo({ params }) {
    return fetch({
        url: '/distributorCardOrder/queryBackCardOrderById',
        method: 'post',
        data: params
    })
}

export function returnGoodsApplicationSubmit({ params }) {
    return fetch({
        url: '/distributorCardOrder/verifyBackOrder',
        method: 'post',
        data: params
    })
}

export function confirmReturnGoodsApi({ params }) {
    return fetch({
        url: '/distributorCardOrder/confirmBackCardOrder',
        method: 'post',
        data: params
    })
}