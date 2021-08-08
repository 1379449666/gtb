
// import storage from 'store'
// import { login, getInfo } from '@/api/login'
// import { loginOut } from '@/api/logins'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
// import { welcome } from '@/utils/util'

const listData = {
  state: {
    search: '',
    typelist: [],
    userStat: {}
  },

  mutations: {
    SET_SEARCH: (state, search) => {
      state.search = search
    },
    // SET_NAME: (state, { name, welcome }) => {
    //   state.name = name
    //   state.welcome = welcome
    // },
    SET_TYPE_LIST: (state, typelist) => {
      state.typelist = typelist
    },
    SET_USER_STAT: (state, userStat) => {
      state.userStat = userStat
    }
    // SET_INFO: (state, info) => {
    //   state.info = info
    // },
    // SET_INFOS: (state, info) => {
    //   state.infos = info
    // }
  },

  actions: {

  }
}

export default listData
