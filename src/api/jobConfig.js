import fetch from '@/utils/fetch';

export function getJobByName({ params }) {
  return fetch({
    url: `/scheduler/scheduler/job/exist/${params}`,
    method: 'get'
  })
}

export function getTaskListByType({ params }) {
  return fetch({
    url: `/scheduler/task/listByType`,
    method: 'post',
    data: params
  })
}

export function getJobList({ params }) {
  return fetch({
    url: `/scheduler/scheduler/job/list`,
    method: 'post',
    data: params
  })
}

export function addJob({ params }) {
  return fetch({
    url: '/scheduler/scheduler/job/add',
    method: 'post',
    data: params
  })
}

export function removeJob({ params }) {
  return fetch({
    url: '/scheduler/scheduler/job/remove',
    method: 'post',
    data: params
  })
}
