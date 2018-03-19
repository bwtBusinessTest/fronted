import fetch from '@/utils/fetch'

export function login(username, password) {
  return fetch({
    url: 'login',
    method: 'post',
    data: {
      userName: username,
      password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function modifyPassword({ params }) {
  return fetch({
    url: '/user/setNewPwd',
    method: 'post',
    data: params
  });
}

export function getAuthorization() {
  return fetch({
    url: '/user/getUserAuth',
    method: 'post'
  });
}

export function logout() {
  return fetch({
    url: '/logout',
    method: 'get'
  })
}
