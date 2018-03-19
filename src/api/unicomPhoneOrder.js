import fetch from '@/utils/fetch'

//接口调用
//查询手机号订单数据列表
export function queryUnicomPhoneOrderList({ params }) {
	return fetch({
		url: '/activity/phoneOrder/list',
		method: 'post',
		data: params
	})
}
//导出手机号数据文件
export function exportPhoneOrderList() {
	return process.env.BASE_API + '/activity/phoneOrder/download';
}
//确认售出
export function confirmSale({ params }) {
	return fetch({
		url: '/activity/phoneOrder/confirm',
		method: 'post',
		data: params
	})
}
//取消预定
export function cancleReservation({ params }) {
	return fetch({
		url: '/activity/phoneOrder/cancel',
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
//获取数据字典接口
export function getMenuByCode({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}