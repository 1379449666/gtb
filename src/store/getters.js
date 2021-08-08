const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  userInfos: state => state.user.infos,
  addRouters: state => state.permission.addRouters,
  search: state => state.list.search,
  userStat: state => state.list.userStat,
  typelist: state => state.list.typelist,
  multiTab: state => state.app.multiTab
}

export default getters
