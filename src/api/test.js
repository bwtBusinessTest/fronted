import fetch from '@/utils/fetch'

export function test(params) {
  return fetch({
    url: '/api/user/check',
    method: 'post',
    data: {
      mobilePhone: '13675126391'
    }
  })
}
