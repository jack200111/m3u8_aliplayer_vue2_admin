// /user/login
const loginData = {
  "code": 0,
  "msg": "登录成功",
  "data": {
    "id": 1,
    "account": "admin",
    "code": "U1",
    "name": "超级管理员",
    "mobile": null
  }
}
// /menu/menuTreeAll
const routerData = {
  "code": 0,
  "msg": "成功",
  "data": [
    {
      "id": 1,
      "pid": 0,
      "status": 1,
      "type": 0,
      "code": "A01",
      "name": "基础管理",
      "identification": null,
      "url": "sys",
      "icon": "base",
      "memo": "sys",
      "sort": 2,
      "creator_id": 1,
      "updater_id": 1,
      "created_at": "2023-11-24 15:44:08",
      "updated_at": "2023-11-24 15:44:08",
      "component": "Layout",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "status": 1,
          "type": 1,
          "code": "A0102",
          "name": "用户管理",
          "identification": null,
          "url": "/sys/user",
          "icon": "roleManage",
          "memo": null,
          "sort": 2,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 15:44:08",
          "updated_at": "2023-11-24 15:44:08",
          "component": null,
          "children": []
        },
        {
          "id": 6,
          "pid": 1,
          "status": 1,
          "type": 1,
          "code": "A0101",
          "name": "菜单管理",
          "identification": null,
          "url": "/sys/menu",
          "icon": "menu",
          "memo": null,
          "sort": 1,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 16:06:05",
          "updated_at": "2023-11-24 16:06:10",
          "component": null,
          "children": []
        }
      ]
    },
    {
      "id": 3,
      "pid": 0,
      "status": 1,
      "type": 0,
      "code": "B01",
      "name": "会员管理",
      "identification": null,
      "url": "member",
      "icon": "userManage",
      "memo": "member",
      "sort": 1,
      "creator_id": 1,
      "updater_id": 1,
      "created_at": "2023-11-24 15:44:08",
      "updated_at": "2023-11-24 15:44:08",
      "component": "Layout",
      "children": [
        {
          "id": 4,
          "pid": 3,
          "status": 1,
          "type": 1,
          "code": "B0101",
          "name": "会员列表",
          "identification": null,
          "url": "/member-car/member-list",
          "icon": "userManage",
          "memo": null,
          "sort": 2,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 15:44:08",
          "updated_at": "2023-11-24 15:44:08",
          "component": null,
          "children": []
        },
        {
          "id": 5,
          "pid": 3,
          "status": 1,
          "type": 1,
          "code": "B010101",
          "name": "车辆进出记录",
          "identification": null,
          "url": "/member-car/inout-record",
          "icon": "car",
          "memo": null,
          "sort": 1,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 15:44:08",
          "updated_at": "2023-11-24 15:44:08",
          "component": null,
          "children": []
        }
      ]
    },
    {
      "id": 7,
      "pid": 0,
      "status": 1,
      "type": 0,
      "code": "B01",
      "name": "监控管理",
      "identification": null,
      "url": "site",
      "icon": "userManage",
      "memo": "member",
      "sort": 1,
      "creator_id": 1,
      "updater_id": 1,
      "created_at": "2023-11-24 15:44:08",
      "updated_at": "2023-11-24 15:44:08",
      "component": "Layout",
      "children": [
        {
          "id": 8,
          "pid": 7,
          "status": 1,
          "type": 1,
          "code": "B0101",
          "name": "视频监控",
          "identification": null,
          "url": "/site/sit-video-playback-test",
          "icon": "userManage",
          "memo": null,
          "sort": 2,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 15:44:08",
          "updated_at": "2023-11-24 15:44:08",
          "component": null,
          "children": []
        },
        {
          "id": 9,
          "pid": 7,
          "status": 1,
          "type": 1,
          "code": "B010101",
          "name": "视频回放",
          "identification": null,
          "url": "/site/site-real-time-monitoring-test",
          "icon": "car",
          "memo": null,
          "sort": 1,
          "creator_id": 1,
          "updater_id": 1,
          "created_at": "2023-11-24 15:44:08",
          "updated_at": "2023-11-24 15:44:08",
          "component": null,
          "children": []
        }
      ]
    }
  ]
}
// /menu/getUserMenuIds
const idsData = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9
]
export default {
  loginData,
  routerData,
  idsData
}
window.loginData = loginData
window.routerData = routerData
window.idsData = idsData
