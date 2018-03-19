import fetch from '@/utils/fetch';

// 获取广告位列表
export function getAdPositionLists({ params }) {
    return fetch({
        url: 'ad/adSense/queryAdSensesPage',
        method: 'post',
        data: params
    })
}
// 根据广告位id和城市查询列表
export function getAdLists({ params }) {
    return fetch({
        url: 'ad/adSense/queryAdsByAdSenseIdAndCityId',
        method: 'post',
        data: params
    })
}
// 修改权重
export function editWeightValue({ params }) {
    return fetch({
        url: 'ad/adSense/modifyWeight',
        method: 'post',
        data: params
    })
}
// 修改排序值
export function editSortNo({ params }) {
    return fetch({
        url: 'ad/adSense/modifySortNo',
        method: 'post',
        data: params
    })
}
// 起用
export function beginUsingApi({ params }) {
    return fetch({
        url: 'ad/adSense/enableAd',
        method: 'post',
        data: params
    })
}
// 禁用
export function endUsingApi({ params }) {
    return fetch({
        url: '/ad/adSense/disableAd',
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