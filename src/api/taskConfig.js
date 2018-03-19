import fetch from '@/utils/fetch';

export function getTaskByName({ params }) {
  return fetch({
    url: `/scheduler/task/exist/${params}`,
    method: 'get'
  })
}

export function getTask({ params }) {
  return fetch({
    url: `/scheduler/task/detail/${params}`,
    method: 'get'
  })
}

export function getTaskList({ params }) {
  return fetch({
    url: '/scheduler/task/list',
    method: 'post',
    data: params
  })
}

export function addTask({ params }) {
  return fetch({
    url: '/scheduler/task/add',
    method: 'post',
    data: params
  })
}

export function modifyTask({ params }) {
  return fetch({
    url: '/scheduler/task/modify',
    method: 'post',
    data: params
  })
}
