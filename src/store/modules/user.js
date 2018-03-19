import { login, logout, getInfo, getAuthorization } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import getmd5 from '@/utils/encrypt'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userInfo: {},
    authorization: {},
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    SET_AUTHORIZATION: (state, auth) => {
      state.authorization = auth;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, getmd5(userInfo.password)).then(response => {
          const data = response.result
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
          // commit('SET_USERINFO', data.userInfo)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_ROLES', data.role)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetAuthorization({ commit, state }) {
      return new Promise((resolve, reject) => {
        getAuthorization().then(res => {
          commit('SET_AUTHORIZATION', res.result)
          resolve();
        }).catch((error) => {
          reject(error);
        });
      });
    },
    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_USERINFO', {})
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        removeToken()
        resolve()
      })
    }
  }
}

export default user
