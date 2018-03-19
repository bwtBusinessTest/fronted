import fetch from '@/utils/fetch'

export function ruleListApi({ params }) {
	return fetch({
		url: '/sysRule/queryRuleList',
		method: 'post',
		data: params
	})
}

export function newAddRuleApi({ params }) {
	return fetch({
		url: '/sysRule/add',
		method: 'post',
		data: params
	})
}


export function modifyRuleApi({ params }) {
	return fetch({
		url: '/sysRule/modify',
		method: 'post',
		data: params
	})
}

export function deleteBatchRuleApi({ params }) {
	return fetch({
		url: `/sysRule/delete`,
		method: 'post',
		data: params
	})
}

// export function deleteRuleApi({ params }) {
// 	return fetch({
// 		url: `sysRule/delete/${params}`,
// 		method: 'get',
// 		data: params
// 	})
// }

export function disableBatchRuleApi({ params }) {
	return fetch({
		url: '/sysRule/disable',
		method: 'post',
		data: params
	})
}


// export function disableRuleApi({ params }) {
// 	return fetch({
// 		url: `sysRule/disable/${params}`,
// 		method: 'get',
// 		data: params
// 	})
// }

export function enableBatchRuleApi({ params }) {
	return fetch({
		url: '/sysRule/enable',
		method: 'post',
		data: params
	})
}

// export function enableRuleApi({ params }) {
// 	return fetch({
// 		url: `sysRule/enable/${params}`,
// 		method: 'get',
// 		data: params
// 	})
// }

export function generateRuleJsApi({ params }) {
	return fetch({
		url: `/sysRule/generateJs/${params}`,
		method: 'get',
		data: params
	})
}

export function viewJsApi({ params }) {
	return fetch({
		url: `/sysRule/viewJs/${params}`,
		method: 'get',
		data: params
	})
}

export function testJsApi({ params }) {
	return fetch({
		url: `/sysRule/jsTest/${params}`,
		method: 'get',
		data: params
	})
}


export function checkRuleApi({ params }) {
	return fetch({
		url: `/sysRule/check/${params}`,
		method: 'get',
		data: params
	})
}

// 验证规则函数名是否重复
export function validateFunctionNameApi({ params }) {
  	return fetch({
	    url: `/sysRule/exist/${params}`,
	    method: 'get'
	 });
}