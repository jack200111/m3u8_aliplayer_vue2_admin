import request from '@/utils/request'

export default {
  // getUserMemberList(searchModel) {
  //   return request({
  //     url: '/user/pageListMemberCarInOutRecord',
  //     method: 'post',
  //     params: {
  //       page: searchModel.page,
  //       pageSize: searchModel.pageSize,
  //       name: searchModel.name,
  //       mobile: searchModel.mobile
  //     }
  //   });
  // },
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

  // addUser(user) {
  //   return request({
  //     url: '/user/add',
  //     method: 'post',
  //     data: user
  //   });
  // },
  // 更新菜单
  updateUser({ user_id, menu_ids }) {
    return request({
      url: '/menu/updateUserMenu',
      method: 'post',
      data: { menu_ids, user_id }
    });
  },
  // saveUser(user) {
  //   // if(user.id == null && user.id == undefined){
  //   //   return this.addUser(user);
  //   // }
  //   if (!user.id) {
  //     return this.addUser(user);
  //   }
  //   return this.updateUser(user);
  // },
  // 获取用户菜单ids
  getUserMenuIds(user_id) {
    // return request({
    //   // url: '/user/' + id,
    //   url: `/menu/getUserMenuIds`,
    //   method: 'post',
    //   data: { user_id }
    // });
    return new Promise((resolve, reject) => {
      resolve(window.idsData)
      // return window.loginData
    })
  },
  // 菜单全树
  getMenuTreeAll() {
    // return request({
    //   url: `/menu/menuTreeAll`,
    //   method: 'post'
    // });
    return new Promise((resolve, reject) => {
      resolve(window.routerData)
      // return window.loginData
    })
  },
  // 用户菜单树
  getMenuTreeUser() {
    return request({
      url: `/menu/menuTreeUser`,
      method: 'post'
    });
  },

  // deleteUserById(id) {
  //   return request({
  //     url: `/user/${id}`,
  //     method: 'delete'
  //   });
  // },
}
