/*
 * @Author: wangChao
 * @Date: 2021-06-09 16:42:16
 * @LastEditTime: 2021-06-15 21:44:55
 * @LastEditors: wangChao
 * @Description: 主页
 * @FilePath: /guTengBao/src/api/index.js
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
 */

import request from '@/utils/request'

const indexApi = {
  typelist: '/project/typelist', // 分类列表
  index: '/project/index', // 方案列表
  add: '/project/add', // 分类新增
  edit: '/project/edit', // 方案修改
  info: '/project/info', // 方案详情
  like: '/project/like', // 方案点赞/取消
  download: '/project/download', // 方案下载
  addTag: '/project/addTag', // 标签新增
  deleteTag: '/project/deleteTag' // 标签删除
}

/**
 * login func
 * parameter: {
 * }
 * @param parameter
 * @returns {*}
 */
 export function typelist (parameter) { return request({ url: indexApi.typelist, method: 'post', data: parameter }) }
 export function index (parameter) { return request({ url: indexApi.index, method: 'post', data: parameter }) }
 export function sadd (parameter) { return request({ url: indexApi.add, method: 'post', data: parameter, header: { 'content-type': 'multipart/form-data' } }) }
 export function edit (parameter) { return request({ url: indexApi.edit, method: 'post', data: parameter }) }
 export function info (parameter) { return request({ url: indexApi.info, method: 'post', data: parameter }) }
 export function like (parameter) { return request({ url: indexApi.like, method: 'post', data: parameter }) }
 export function download (parameter) { return request({ url: indexApi.download, method: 'post', data: parameter }) }
 export function addTag (parameter) { return request({ url: indexApi.addTag, method: 'post', data: parameter }) }
 export function deleteTag (parameter) { return request({ url: indexApi.deleteTag, method: 'post', data: parameter }) }
