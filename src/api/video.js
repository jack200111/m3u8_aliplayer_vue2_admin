import request from "@/utils/request";

export default {
  // 获取在线设备列表
  getUserList(searchModel) {
    return request({
      url: "/eHome/getUserList",
      method: "get",
      data: { }
    });
  },

  // 获取设备列表
  // params userId设备id
  getDeviceInfoList(searchModel) {
    return request({
      url: "/eHome/getDeviceInfo?userId=" + searchModel.userId,
      method: "get",
      data: { }
    });
  },

  // 获取设备基本信息
  getDeviceCfg(searchModel) {
    return request({
      url: "/eHome/getDeviceCfg?userId=" + searchModel?.userId,
      method: "get",
      data: { }
    });
  },

  // 获取通道信息
  getPicCfg(searchModel) {
    return request({
      url: `/eHome/getPicCfg?userId=${searchModel?.userId}&channel=${searchModel?.channel}`,
      method: "get",
    });
  },

  // 获取视频流列表
  getLiveList() {
    return request({
      url: `/eHome/getLiveList`,
      method: "get",
    });
  },
  // 根据设备id和通道编号获取视频流
  getStartPush(searchModel) {
    return request({
      url: `/eHome/startPush/${searchModel?.userId}?channel=${searchModel?.channel}&streamType=${searchModel?.streamType}`,
      method: "get",
    });
  },
  // 停止视频流
  stopPush(searchModel) {
    return request({
      url: `/eHome/stopPush/${searchModel?.userId}?sessionID=${searchModel?.sessionID}&channel=${searchModel?.channel}`,
      method: "get",
    });
  },

  getUserMemberList(searchModel) {
    const encodedSearchKey = searchModel.search_key;
    const params = JSON.stringify({
      page: searchModel.page,
      pageSize: searchModel.pageSize,
      search_key: encodedSearchKey,
    });
    console.log(params);
    return request({
      url: "/user/pageListMember",
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: params,
    });
  },
  // 会员车辆进出记录
  getCarInOutRecord(searchModel) {
    const encodedSearchKey = searchModel.search_key;
    const params = JSON.stringify({
      page: searchModel.page,
      pageSize: searchModel.pageSize,
      search_key: {
        plate_number: encodedSearchKey.plate_number,
        car_in_at: encodedSearchKey.car_in_at,
        car_in_equip_name: encodedSearchKey.car_in_equip_name,
        car_out_at: encodedSearchKey.car_out_at,
        car_out_equip_name: encodedSearchKey.car_out_equip_name,
        car_out_manual_memo: encodedSearchKey.car_out_manual_memo,
        //
        member_id:
          Number(encodedSearchKey.member_id) === 0
            ? null
            : Number(encodedSearchKey.member_id),
        openid: encodedSearchKey.openid,
        openid_mp: encodedSearchKey.openid_mp,
        mobile: encodedSearchKey.mobile,
        name: encodedSearchKey.name,
        sex: encodedSearchKey.sex,
        check_car_out: encodedSearchKey.check_car_out
          ? encodedSearchKey.check_car_out
          : 0,
      },
      // ...encodedSearchKey
    });
    console.log(params);
    return request({
      url: "/user/pageListMemberCarInOutRecord",
      method: "post",
      data: params,
      headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        "Content-Type": "application/json",
      },
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

  // 更新会员状态
  updateMemberStatus(user) {
    return request({
      url: "/user/updateMemberStatus",
      method: "post",
      data: { status: user.status, member_id: user.id },
    });
  },
  // 更新会员免费停车有效期  updateMemberFreeParking
  updateUser(user) {
    return request({
      url: '/user/updateMemberFreeParking',
      method: 'post',
      data: { free_parking_expire_at: user.free_parking_expire_at, member_id: user.id }
    });
  },
  // 分页列表，会员
  // /api/user/pageListMember
  getUserMemberPageList(searchModel) {
    return request({
      url: "/user/pageListMember",
      method: "post",
      params: {
        page: searchModel.page,
        pageSize: searchModel.pageSize,
        status: searchModel.status,
        sex: searchModel.sex,
        mobile: searchModel.mobile,
        member_car_plate_number: searchModel.member_car_plate_number,
      },
    });
  },
  //
  getCarList(member_id) {
    return request({
      url: "/user/listMemberCarLog",
      method: "post",
      data: { member_id },
    });
  },

  // 更新手动出场
  updateMemberCarOutManual(user) {
    return request({
      url: "/user/updateMemberCarOutManual",
      method: "post",
      data: { car_out_at: user.car_out_at, id: user.id, memo: user.memo },
    });
  },

  saveUser(user) {
    // if(user.id == null && user.id == undefined){
    //   return this.addUser(user);
    // }
    // 添加
    // if (!user.id) {
    //   return this.addUser(user);
    // }
    return this.updateUser(user);
  },
};
