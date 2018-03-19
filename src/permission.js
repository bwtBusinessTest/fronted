import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else if (to.path === '/modifyPassword') {
      next();
    } else {
      /*if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          if (store.getters.name === 'admin') {
            console.log('首次登录跳转修改密码页面')
            // next({  path: '/modifyPassword' })
            next();
          } else {
            next()
          }
        }).catch(() => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('验证失败,请重新登录')
            next({ path: '/login' })
          })
        })
        next();
      } else {
        next()
      }*/
      if (!store.state.user.userInfo.id) {
        store.commit('SET_USERINFO', JSON.parse(localStorage.getItem('userInfo')));
        store.dispatch('GetAuthorization').then(() => {
          store.dispatch('GenerateRouters').then(() => {
            router.addRoutes(store.getters.addRouters);
            next({ ...to });

            if(store.getters.firstLogin === '1' && from.path === '/login') {
              next({  path: '/modifyPassword' })
            } else {
              next();
            }

          });
        }).catch((res) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error('权限验证失败，请重新登录');
            // next({ path: '/login' });
            next();
          })
        });
      } else {  next() }

      // if(store.getters.firstLogin === '1' && from.path === '/login') {
      //   next({  path: '/modifyPassword' })
      // } else {
      //   next();
      // }

    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
