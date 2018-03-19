import fetch from '@/utils/fetch'

//接口调用
//查询手机号数据列表
export function queryUnicomPhoneList({ params }) {
	return fetch({
		url: '/activity/phone/list',
		method: 'post',
		data: params
	})
}
//导出手机号数据文件
export function exportUnicomPhoneList() {
	return process.env.BASE_API + '/activity/phone/download';
}
//获取城市字典数据接口
export function getCityList({ params }) {
	return fetch({
		url: '/treeDict/getCityTreeDictTree',
		method: 'post',
		data: params
	})
}
//获取数据字典接口
export function getMenuByCode({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}
// 上架
export function upJia({ params }) {
	return fetch({
		url: '/activity/phone/putOn',
		method: 'post',
		data: params
	})
}
// 下架
export function downJia({ params }) {
	return fetch({
		url: '/activity/phone/putOff',
		method: 'post',
		data: params
	})
}