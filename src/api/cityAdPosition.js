import fetch from '@/utils/fetch';

// 接口调用
// 条件获取城市广告位数据列表
export function queryAdPositionByCity({ params }) {
	return fetch({
		url: 'ad/adSense/queryAdSenses',
		method: 'post',
		data: params
	})
}
//给对应的城市添加广告位
export function adPositionForCity({ params }) {
	return fetch({
		url: 'ad/adSense/addAdSensesByCity',
		method: 'post',
		data: params
	})
}
// 下拉框数据字典
export function getMenuList({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}
// 城市下拉框
export function getCityList({ params }) {
	return fetch({
		url: '/treeDict/getCityTreeDictTree',
		method: 'post',
		data: params
	})
}