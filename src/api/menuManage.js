import fetch from '@/utils/fetch'

export function getMenuTreeApi({ params }) {
	return fetch({
		url: '/menu/getMenuTree',
		method: 'post',
		data: params
	})
}

export function insertMenuApi({ params }) {
	return fetch({
		url: '/menu/insert',
		method: 'post',
		data: params
	})
}

export function updateMenuApi({ params }) {
	return fetch({
		url: '/menu/update',
		method: 'post',
		data: params
	})
}

export function deleteBatchMenuApi({ params }) {
	return fetch({
		url: '/menu/deleteBatch',
		method: 'post',
		data: params
	})
}

export function showBatchMenuApi({ params }) {
	return fetch({
		url: '/menu/showBatch',
		method: 'post',
		data: params
	})
}

export function hideBatchMenuApi({ params }) {
	return fetch({
		url: '/menu/hideBatch',
		method: 'post',
		data: params
	})
}

export function getBeanMenuApi({ params }) {
	return fetch({
		url: '/menu/getBean',
		method: 'post',
		data: params
	})
}

export function validateMenuCodeApi({ params }) {
	return fetch({
		url: '/menu/validateMenuCode',
		method: 'post',
		data: params
	})
}