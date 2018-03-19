import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import router from '../router'
import { getToken } from '@/utils/auth'
import loginModal from '../components/loginModal/modal'

console.log(process.env.BASE_API)
// axios.defaults.headers.post['Content-Type'] = 'application/json';
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000

})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
  /**
  * code为非0000是抛错
  */
    const res = response.data
    if (res.errcode !== '0000') {
      Message({
        message: res.errmsg,
        type: 'error',
        duration: 3 * 1000,
        showClose: true
      })

      if (res.errcode === '0005' && store.getters.token) {
        /*MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        })*/
        /*store.dispatch('FedLogOut').then(() => {
          location.reload()
        })*/
        
        if (!document.getElementById('loginModal')) {
            loginModal();
        }
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
