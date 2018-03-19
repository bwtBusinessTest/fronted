import fetch from '@/utils/fetch';

// 接口调用
// 获取物料数据列表
export function queryAdMaterialList({ params }) {
	return fetch({
		url: 'ad/adMateriel/queryPage',
		method: 'post',
		data: params
	})
}

// 添加物料
export function addMaterialApi({ params }) {
	return fetch({
		url: 'ad/adMateriel/add',
		method: 'post',
		data: params
	})
}
// 删除物料
export function deleteMaterial({ params }) {
	return fetch({
		url: 'ad/adMateriel/delete',
		method: 'post',
		data: params
	})
}

// 编辑物料
export function editMaterialApi({ params }) {
	return fetch({
		url: 'ad/adMateriel/update',
		method: 'post',
		data: params
	})
}
// 编辑物料是检查物料是否对应有已上架的广告
export function checkAdMeterialCanEdit({ params }) {
	return fetch({
		url: 'ad/adMateriel/checkAdmateriel',
		method: 'post',
		data: params
	})
}
// 图片上传接口
export function adPositionUploadUrl() {
	return process.env.BASE_API + 'ad/resource/addResource';
}
// 下拉框数据字典
export function getMenuList({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}
// 获取管理员城市属性
export function getManagerCity({ params }) {
	return fetch({
		url: '/treeDict/getCityByUserCityId',
		method: 'post',
		data: params
	})
}
// 获取管理员城市下拉列表
export function getManagerCityMenu({ params }) {
	return fetch({
		url: '/treeDict/getCityTreeByUserCityId',
		method: 'post',
		data: params
	})
}


