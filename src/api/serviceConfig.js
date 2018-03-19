import fetch from '@/utils/fetch';

export function getfServiceConfig({ params }) {
  return fetch({
    url: `/scheduler/task/${params}`,
    method: 'get'
  })
}

export function getServiceConfigList({ params }) {
  return fetch({
    url: '/scheduler/task/list',
    method: 'post',
    data: params
  })
}

export function addServiceConfig({ params }) {
  return fetch({
    url: '/scheduler/task/add',
    method: 'post',
    data: params
  })
}

export function modifyServiceConfig({ params }) {
  return fetch({
    url: '/scheduler/task/modify',
    method: 'post',
    data: params
  })
}
