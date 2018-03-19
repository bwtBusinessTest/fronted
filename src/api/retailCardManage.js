import fetch from '@/utils/fetch'

export function getPublishList({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}

export function getRetailCardList({ params }) {
	return fetch({
		url: '/distributorCard/queryDistributorCardList',
		method: 'post',
		data: params
	})
}

//根据发行方查询卡券信息
export function publicGetCardList({ params }) {
	return fetch({
		url: '/distributorCard/queryStocksByPublish',
		method: 'post',
		data: params
	})
}

//新增
export function queryAddRetailCard({ params }) {
	return fetch({
		url: '/distributorCard/add',
		method: 'post',
		data: params
	})
}

//编辑
export function queryRetailCardEdit({ params }) {
	return fetch({
		url: '/distributorCard/modify',
		method: 'post',
		data: params
	})
}
