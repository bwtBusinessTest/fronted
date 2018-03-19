const getters = {
  sidebar: state => state.app.sidebar,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.userInfo.userName,
  role: state => state.user.userInfo.roleName,
  firstLogin: state => state.user.userInfo.firstLogin,
  menuAuth: state => state.user.authorization.menuAuth,
  buttonAuth: state => state.user.authorization.buttonAuth,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
