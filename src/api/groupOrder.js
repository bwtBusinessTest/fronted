import fetch from '@/utils/fetch';
import { getToken } from '@/utils/auth'

export function getDistributors({ params }) {
	return fetch({
		url: '/distributor/queryAllDistributors',
		method: 'post',
		data: params
	})
}

export function getStatusLists() {
	return fetch({
		url: `card/groupOrder/getOrderStatusDict`,
		method: 'get'
	})
}

export function getUploadProcess({ params }) {
	return fetch({
		url: `/card/groupOrder/processRate/${ params }`,
		method: 'get'
	})
}

export function getImportResult({ params }) {
	return fetch({
		url: '/card/groupOrder/importResult',
		method: 'post',
		data: params
	})
}

export function IRApplication({ params }) {
	return fetch({
		url: `/card/groupOrder/confirmApply/${params}`,
		method: 'get'
	})
}

export function getGroupOrders({ params }) {
	return fetch({
		url: '/card/groupOrder/list',
		method: 'post',
		data: params
	})
}

export function checkOrder({ params }) {
	return fetch({
		url: '/card/groupOrder/verify',
		method: 'post',
		data: params
	})
}

export function orderCancel({ params }) {
	return fetch({
		url: `/card/groupOrder/revoke/${params}`,
		method: 'get'
	})
}

export function orderCharge({ params }) {
	return fetch({
		url: `/card/groupOrder/charge/${params}`,
		method: 'get'
	})
}

export function getOrderDetail({ params }) {
	return fetch({
		url: '/card/groupOrder/detail/list',
		method: 'post',
		data: params
	})
}

export function againGive({ params }) {
	return fetch({
		url: `/card/groupOrder/detail/charge`,
		method: 'post',
		data: params
	})
}

export function groupOrderUploadUrl() {
	return process.env.BASE_API + '/card/groupOrder/add';
}

export function groupOrderDownloadUrl() {
	return process.env.BASE_API + '/card/groupOrder/download';
}

export function orderDetailDownloadUrl() {
	return process.env.BASE_API + '/card/groupOrder/detail/download';
}

export function IRDownloadUrl({ params }) {
	return process.env.BASE_API + '/card/groupOrder/importResult/download/' + params;
}

export function downloadTemplateUrl() {
	return process.env.BASE_API + `card/groupOrder/template/download?Authorization=` + getToken();
}

export function cancelImport({ params }) {
	return fetch({
		url: `/card/groupOrder/cancelImport/${params}`,
		method: 'get'
	})
}

export function getImportStatus({ params }) {
	return fetch({
		url: `/card/groupOrder/importStatus/${params}`,
		method: 'get'
	})
}