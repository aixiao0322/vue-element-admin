import request from '@/utils/request'
// 登录
export function login (data) {
  return request({
    // 因为所有的接口都要跨域 表示所有的接口要带 /api
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户的基本资料
export function getUserInfo () {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}
// 获取用户的基本信息
export function getUserDetailById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}
// ..
export function getInfo (token) {
  // return request({
  //   url: '/vue-admin-template/user/info',
  //   method: 'get',
  //   params: { token }
  // })
}

export function logout () {
  // return request({
  //   url: '/vue-admin-template/user/logout',
  //   method: 'post'
  // })
}
// ...............

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {}
}

