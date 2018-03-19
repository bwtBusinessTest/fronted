import fetch from '@/utils/fetch'


//接口调用
//获取卡券数据列表
export function queryCardList({ params }) {
	return fetch({
		url: '/card/queryCardList',
		method: 'post',
		data: params
	})
}

//新增卡券接口调用
export function queryCardAdd({ params }) {
	return fetch({
		url: '/card/add',
		method: 'post',
		data: params
	})
}
//编辑卡券
export function queryCardEdit({ params }) {
	return fetch({
		url: '/card/modify',
		method: 'post',
		data: params
	})
}
//获取发行方数据字典接口
export function getPublishList({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}
//获取城市字典数据接口
export function getCityList({ params }) {
	return fetch({
		url: '/treeDict/getCityTreeDictTree',
		method: 'post',
		data: params
	})
}

