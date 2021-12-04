import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken(),
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken (state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken (state) {
    state.token = null // 删除vuex的token
    removeToken()
  },
  // 设置用户信息
  setUserInfo (state, userInfo) {
    state.userInfo = { ...userInfo }
  },
  // 删除用户信息
  reomveUserInfo (state) {
    state.userInfo = {}
  }
}

// 执行异步
const actions = {
  async login (context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // setTimeStamp()
  },
  async getUserInfo (context) {
    const result = await getUserInfo() // 获取返回值
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 将整个的个人信息设置到用户的vuex数据中
    return result
  },
  // 退出
  logout (context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
    context.dispatch('tagsView/delAllViews', null, { root: true })
  }
}

// ...........................
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

// ....................................

// ................................

// ...................................

