import fetch from '@/utils/fetch'

export function apiLogQueryApi({ params }) {
	return fetch({
		url: '/apiLog/pageQuery',
		method: 'post',
		data: params
	})
}