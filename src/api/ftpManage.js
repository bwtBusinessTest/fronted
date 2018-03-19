import fetch from '@/utils/fetch'

//分页条件查询ftp列表
export function queryFtpList({ params }) {
	return fetch({
		url: '/ftpConfig/pageQuery',
		method: 'post',
		data: params
	})
}

//新增ftp配置
export function queryFtpAdd({ params }) {
	return fetch({
		url: '/ftpConfig/insert',
		method: 'post',
		data: params
	})
}

//修改ftp配置
export function queryFtpEdit({ params }) {
	return fetch({
		url: '/ftpConfig/update',
		method: 'post',
		data: params
	})
}

//删除ftp配置
export function queryFtpDelet({ params }) {
	return fetch({
		url: '/ftpConfig/batchDelete',
		method: 'post',
		data: params
	})
}

//获取配置类型数字典
export function getFtpTypeList({ params }) {
	return fetch({
		url: '/dict/getDictByCode',
		method: 'post',
		data: params
	})
}