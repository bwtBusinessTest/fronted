import fetch from '@/utils/fetch'

export function loginLogQueryApi({ params }) {
	return fetch({
		url: '/loginLog/pageQuery',
		method: 'post',
		data: params
	})
}