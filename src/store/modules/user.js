import { login, logout, getInfo } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
// import menuApi from "@/api/menu";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    // 动态路由菜单
    menuList: [],
    // localStorage.getItem('isAddRouter'),
    isAddRouter: false,
    userMenu: [] // id菜单数组
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  // 动态路由菜单
  SET_MENU_LIST: (state, menuList) => {
    console.log(menuList, 'menuList');
    state.menuList = menuList
  },
  // 当前用户菜单
  SET_USER_MENU: (state, userMenu) => {
    console.log(userMenu, 'userMenu');
    state.userMenu = userMenu
  },
  SET_MENU_ROUTER: (state) => {
    state.isAddRouter = true
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { account, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ account: account.trim(), password: password }).then(response => {
        // const { data } = response
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getMenu({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_MENU_LIST', window.routerData.data)
      resolve()
    })
    // return new Promise((resolve, reject) => {
    //   menuApi.getMenuTreeAll().then((response) => {
    //     console.log(response, '动态路由菜单');
    //     // this.$message({
    //     //   type: "success",
    //     //   message: '请求成功',
    //     // });
    //     // this.getUserList();
    //     // 提交到仓库
    //     // this.$emit('SET_MENU_LIST', response.data)
    //     // commit('SET_MENU_LIST', response.data)
    //     commit('SET_MENU_LIST', window.routerData.data)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

