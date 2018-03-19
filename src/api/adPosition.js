import fetch from '@/utils/fetch';

// 接口调用
// 获取广告位数据列表
export function queryAdPositionList({ params }) {
	return fetch({
		url: 'ad/adSense/queryPage',
		method: 'post',
		data: params
	})
}

// 添加广告位
export function addAdPosition({ params }) {
	return fetch({
		url: 'ad/adSense/add',
		method: 'post',
		data: params
	})
}
// 修改广告位
export function editAdPosition({ params }) {
	return fetch({
		url: 'ad/adSense/update',
		method: 'post',
		data: params
	})
}
// 启用广告位
export function startUsing({ params }) {
	return fetch({
		url: 'ad/adSense/enableAds',
		method: 'post',
		data: params
	})
}
// 停用广告位
export function endUsing({ params }) {
	return fetch({
		url: 'ad/adSense/disableAds',
		method: 'post',
		data: params
	})
}
// 图片上传接口
export function adPositionUploadUrl() {
	return process.env.BASE_API + 'ad/resource/addResource';
}
// 校验广告位code是否有重复
export function adPositionIsExit({ params }) {
	return fetch({
		url: 'ad/adSense/validateAdSenseCode',
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

