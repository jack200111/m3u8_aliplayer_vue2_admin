import request from '@/utils/request'

export default {
  // 用户管理
  getUserList(searchModel) {
    const params = JSON.stringify({
      page: searchModel.page,
      pageSize: searchModel.pageSize,
      search_key: searchModel.search_key
    })
    console.log(params);
    return request({
      url: '/user/pageList',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: params
    });
  },
  // 用户管理 分页列表
  // export function userPageList(data) {
  //   return request({
  //     url: '/user/pageList',
  //     method: 'post',
  //     data
  //   })
  // },

  // 会员列表
  // /api/user/pageListMember
  // getUserMemberList(searchModel) {
  //   return request({
  //     url: '/user/pageListMember',
  //     method: 'post',
  //     params: {
  //       page: searchModel.page,
  //       pageSize: searchModel.pageSize,
  //       status: searchModel.status,
  //       sex: searchModel.sex,
  //       mobile: searchModel.mobile
  //     }
  //   });
  // },

  addUser(user) {
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    });
  },
  // 修改
  updateUser(user) {
    return request({
      url: '/user/update',
      method: 'post',
      data: { ...user, user_id: user.id }
    });
  },
  // 修改状态
  updateUserStatus(user) {
    return request({
      url: '/user/updateStatus',
      method: 'post',
      data: { status: user.status, user_id: user.id }
    });
  },
  saveUser(user) {
    // if(user.id == null && user.id == undefined){
    //   return this.addUser(user);
    // }
    // 添加
    if (!user.id) {
      return this.addUser(user);
    }
    return this.updateUser(user);
  },
  getUserById(id) {
    return request({
      // url: '/user/' + id,
      url: `/user/${id}`,
      method: 'get'
    });
  },
  // 删除
  deleteUserById(user_id) {
    return request({
      url: `/user/delete`,
      method: 'post',
      data: { user_id }
    });
  },
}
