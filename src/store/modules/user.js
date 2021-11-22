import UserApi from '@/api/user'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    menus: []
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
  SET_MENUS: (state, menus) => {
    state.menus = menus
  }
}

const actions = {
  // user login
  login({ commit }, formData) {
    return new Promise((resolve, reject) => {
      UserApi.login(formData).then(async response => {
        const { content } = response
        commit('SET_TOKEN', content.accessToken)
        setToken(content.accessToken)
        setRefreshToken(content.refreshToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      UserApi.getInfo(state.token).then(response => {
        const { content } = response

        if (!content) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = content

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(content)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      UserApi.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeRefreshToken()
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
  },

  resetMenus({ commit }) {
    return new Promise((resolve, reject) => {
      UserApi.getInfo().then(res => {
        if (res.code == 0){
          commit('SET_MENUS', res.content.menus)
        }
        resolve(res)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

