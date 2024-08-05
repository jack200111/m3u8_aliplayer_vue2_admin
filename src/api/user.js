import request from '@/utils/request'

export function login(data) {
  // return request({
  //   url: '/user/login',
  //   method: 'post',
  //   data
  // })
  return new Promise((resolve, reject) => {
    resolve(window.loginData)
    // return window.loginData
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  // return request({
  //   url: '/user/logout',
  //   method: 'post'
  // })
  return new Promise((resolve, reject) => {
    resolve()
    // return window.loginData
  })
}

// // 用户管理 分页列表
// export function userPageList(data) {
//   return request({
//     url: '/user/pageList',
//     method: 'post',
//     data
//   })
// }

// export function getUserList(searchModel) {
//   const params = JSON.stringify({
//     page: searchModel.page,
//     pageSize: searchModel.pageSize,
//     search_key: searchModel.search_key
//   })
//   console.log(params);
//   return request({
//     url: '/user/pageList',
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     data: params
//   });
//   // return request({
//   //   url: '/user/pageList',
//   //   method: 'post',
//   //   params: {
//   //     page: searchModel.page,
//   //     pageSize: searchModel.pageSize,
//   //     name: searchModel.name,
//   //     account: searchModel.account,
//   //     mobile: searchModel.mobile,
//   //     status: searchModel.status
//   //   }
//   // });
// }
