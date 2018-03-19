import fetch from '@/utils/fetch'

export function queryRetailList({ params }) {
	return fetch({
		url: '/distributor/queryDistributorList',
		method: 'post',
		data: params
	})
}

export function queryAddRetail({ params }) {
	return fetch({
		url: '/distributor/add',
		method: 'post',
		data: params
	})
}

export function queryRetailEdit({ params }) {
	return fetch({
		url: '/distributor/modify',
		method: 'post',
		data: params
	})
}

//查询所有分销商
export function queryAllRetail({ params }) {
	return fetch({
		url: '/distributor/queryAllDistributors',
		method: 'post',
		data: params
	})
}

//生成密钥
export function secretKey({params}) {
	return fetch({
		url: '/distributor/setAppSecret',
		method: 'post',
		data: params
	})
}