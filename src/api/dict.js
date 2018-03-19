import fetch from '@/utils/fetch'

export function dictQueryApi({ params }) {
	return fetch({
		url: '/dict/pageQuery',
		method: 'post',
		data: params
	})
}

export function geteDictBeanApi({ params }) {
	return fetch({
		url: '/dict/getBean',
		method: 'post',
		data: params
	})
}

export function insertDictApi({ params }) {
	return fetch({
		url: '/dict/insert',
		method: 'post',
		data: params
	})
}

export function updateDictApi({ params }) {
	return fetch({
		url: '/dict/update',
		method: 'post',
		data: params
	})
}

export function deleteBatchDictApi({ params }) {
	return fetch({
		url: '/dict/deleteBatch',
		method: 'post',
		data: params
	})
}

export function showBatchDictApi({ params }) {
	return fetch({
		url: '/dict/showBatch',
		method: 'post',
		data: params
	})
}

export function hideBatchDictApi({ params }) {
	return fetch({
		url: '/dict/hideBatch',
		method: 'post',
		data: params
	})
}