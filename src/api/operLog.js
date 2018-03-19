import fetch from '@/utils/fetch'

export function operLogQueryApi({ params }) {
	return fetch({
		url: '/operLog/pageQuery',
		method: 'post',
		data: params
	})
}

export function getBusinFlagListApi({ params }) {
	return fetch({
		url: '/operLog/getBusinFlagList',
		method: 'post',
		data: params
	})
}

export function getMenuListApi({ params }) {
	return fetch({
		url: '/operLog/getMenuList',
		method: 'post',
		data: params
	})
}