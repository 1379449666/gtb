
import request from '@/utils/request'

const userApi = {
  Login_: '/login/web',
  loginOut: '/user/loginOut',
  testLogin: '/login/testlogin',
  verifiedUser: '/verified/verifiedUser',
  getVerfied: '/verified/getVerfied',
  getUserInfo: '/user/getUserInfo',
  editUser: '/user/editUser'
}

/**
 * login func
 * parameter: {
 * }
 * @param parameter
 * @returns {*}
 */
export function Login_ (parameter) { return request({ url: userApi.Login_, method: 'post', data: parameter }) }
export function loginOut (parameter) { return request({ url: userApi.loginOut, method: 'post', data: parameter }) }
export function testLogin (parameter) { return request({ url: userApi.testLogin, method: 'post', data: parameter }) }
export function verifiedUser (parameter) { return request({ url: userApi.verifiedUser, method: 'post', data: parameter }) }
export function getVerfied (parameter) { return request({ url: userApi.getVerfied, method: 'post', data: parameter }) }
export function getUserInfo (parameter) { return request({ url: userApi.getUserInfo, method: 'post', data: parameter }) }
export function editUser (parameter) { return request({ url: userApi.editUser, method: 'post', data: parameter }) }
