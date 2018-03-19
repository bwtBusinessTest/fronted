import fetch from '@/utils/fetch'

export function fileConfigQueryApi({ params }) {
	return fetch({
		url: '/fileConfig/pageQuery',
		method: 'post',
		data: params
	})
}

export function insertFileConfigApi({ params }) {
	return fetch({
		url: '/fileConfig/insert',
		method: 'post',
		data: params
	})
}

export function updateFileConfigApi({ params }) {
	return fetch({
		url: '/fileConfig/update',
		method: 'post',
		data: params
	})
}

export function deleteBatchFileConfigApi({ params }) {
	return fetch({
		url: '/fileConfig/deleteBatch',
		method: 'post',
		data: params
	})
}

export function getBeanFileConfigApi({ params }) {
	return fetch({
		url: '/fileConfig/getBean',
		method: 'post',
		data: params
	})
}

export function validateFtpPathApi({ params }) {
	return fetch({
		url: '/fileConfig/validateFtpPath',
		method: 'post',
		data: params
	})
}

export function validateVisitPathApi({ params }) {
	return fetch({
		url: '/fileConfig/validateVisitPath',
		method: 'post',
		data: params
	})
}

export function validateConfigFtpTypeApi({ params }) {
	return fetch({
		url: '/fileConfig/validateConfigFtpType',
		method: 'post',
		async: true,
		data: params
	})
}