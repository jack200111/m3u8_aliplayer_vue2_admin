import axios from 'axios'
// MessageBox,Loading
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
// import { getToken } from '@/utils/auth'
import router from '@/router'
// import { tansParams, blobValidate } from "@/utils";
// import { saveAs } from 'file-saver'
// import errorCode from '@/utils/errorCode'
// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://localhost:3003', // url = base url + request url
  baseURL: '/api',
  withCredentials: true, // send cookies when cross-domain requests 以便允许在跨域请求中携带 cookie
  timeout: 1000 * 10 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    // 账号未登录 重新登录

    if (res.code !== 200) {
      Message({
        message: res.msg || '失败',
        type: 'error',
        duration: 3 * 1000
      })

      if (res.code === 2001) {
        // to re-login
        if (router.currentRoute.path !== '/login' && router.currentRoute.path !== '/') {
          MessageBox.confirm('您已退出登录, 您可以取消以留在此页面, 或重新登录', '确认退出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // store.dispatch('user/resetToken').then(() => {
            //   location.reload()
            // })
            store.dispatch('user/logout')
            router.push('/login')
          })
        }
        // MessageBox.confirm('您已退出登录, 您可以取消以留在此页面, 或重新登录', '确认退出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/logout')
        //   router.push('/login')
        // })
      }
      // console.log(router.currentRoute, 'router.currentRoute');
      // return Promise.reject(new Error(res.message || 'Error'))
      return Promise.reject(res.msg || 'Error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.msg || '失败',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

// let downloadLoadingInstance;
// 通用下载方法
// export function download(url, params, filename, config) {
//   downloadLoadingInstance = Loading.service({ text: "正在下载数据，请稍候", spinner: "el-icon-loading", background: "rgba(0, 0, 0, 0.7)", })
//   return service.post(url, params, {
//     transformRequest: [(params) => { return tansParams(params) }],
//     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     responseType: 'blob',
//     ...config
//   }).then(async(data) => {
//     const isBlob = blobValidate(data);
//     if (isBlob) {
//       const blob = new Blob([data])
//       saveAs(blob, filename)
//     } else {
//       const resText = await data.text();
//       const rspObj = JSON.parse(resText);
//       const errMsg = rspObj.msg
//       Message.error(errMsg);
//     }
//     downloadLoadingInstance.close();
//   }).catch((r) => {
//     console.error(r)
//     Message.error('下载文件出现错误，请联系管理员！')
//     downloadLoadingInstance.close();
//   })
// }
export default service
