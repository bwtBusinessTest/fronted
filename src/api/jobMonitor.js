import fetch from '@/utils/fetch';

export function getSchedulerStatus() {
  return fetch({
    url: `/scheduler/scheduler/status`,
    method: 'get'
  })
}

export function startScheduler() {
  return fetch({
    url: `/scheduler/scheduler/start`,
    method: 'get'
  })
}

export function stopScheduler() {
  return fetch({
    url: '/scheduler/scheduler/stop',
    method: 'get'
  })
}

export function getJobTriggerList({ params }) {
  return fetch({
    url: '/scheduler/scheduler/trigger/list',
    method: 'post',
    data: params
  })
}

export function execJob({ params }) {
  return fetch({
    url: '/scheduler/scheduler/job/exec',
    method: 'post',
    data: params
  })
}

export function restartJob({ params }) {
  return fetch({
    url: '/scheduler/scheduler/job/reStart',
    method: 'post',
    data: params
  })
}

export function stopJob({ params }) {
  return fetch({
    url: '/scheduler/scheduler/job/stop',
    method: 'post',
    data: params
  })
}
