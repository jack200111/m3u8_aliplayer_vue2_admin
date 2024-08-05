/*
 * @Author: your name
 * @Date: 2020-04-26 11:49:44
 * @LastEditTime: 2020-07-16 16:13:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \sanitation-web\src\utils\request.js
 */
import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
// import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'

const http = axios.create({
  // baseURL: process.env.APP_API,
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 1000 * 10,
  withCredentials: true
})

let requestInterceptor = (config) => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers['token'] = Cookies.get('communityApiToken') || ''
  // 默认参数
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ '_t': new Date().getTime() }
    }
  }
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}

let errorInterceptor = (error) => {
  return Promise.reject(error)
}

/**
 * 请求拦截
 */
http.interceptors.request.use(requestInterceptor, errorInterceptor)

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data.code === 402) {
    // clearLoginInfo()
    router.replace({ name: 'login' })
    return Promise.reject(response.data.msg)
  }
  return response
}, error => {
  console.error(error)
  return Promise.reject(error)
})

/**
 * 创建http
 */
function createHttp (config, reqIntercepter, respIntercepter) {
  let defaultConfig = {
    withCredentials: true
  }
  config = {
    ...defaultConfig,
    ...config
  }
  let http = axios.create(config)
  http.interceptors.request.use(reqIntercepter || requestInterceptor, errorInterceptor)
  http.interceptors.response.use(respIntercepter || (() => { }), errorInterceptor)
  return http
}

export { http, createHttp }
