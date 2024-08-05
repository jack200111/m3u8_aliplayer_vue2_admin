import {
  getUUID
} from '@/utils'

export default {
  data() {
    // 最大视频数量maxVideoCount不需要响应式，所以没放到return里
    this.maxVideoCount = 5
    return {
      videoList: [],
      playedStationVideo: {} // 记录当前站点播放的视频的数量
    }
  },
  // computed: {
  //   siteName () {
  //     return (val) => {
  //       const type = val.nsSign === 1 ? '南区' : '北区'
  //       return `${val.name} (${type})`
  //     }
  //   }
  // },
  methods: {
    // 获取站点信息
    getSiteList() {
      let promise = new Promise((resolve, reject) => {
        this.getData('/tb/district/queryAll').then((res) => {
          if (res.code !== 0) {
            return
          }
          res.data.map(item => {
            this.$set(item, 'ref', `tree${item.id}`)
            // item.cameraList.map((cameraItem, index) => {
            let arr = []
            arr.push({
              id: item.id,
              stationId: item.id,
              label: item.siteName,
              nodeNum: 0,
              isRequest: true,
              isChecked: true
            })
            this.$set(item, 'cameraList', arr)
            // })
          })
          this.dataListLoading = false
          this.dataList1 = res.data
          resolve(res)
        })
        // this.getDataList().then(res => {
        //   if (res.code !== 0) { return }
        //   // res.data.map(item => {
        //   //   this.$set(item, 'ref', `tree${item.id}`)
        //   //   item.cameraList.map((cameraItem, index) => {
        //   //     this.$set(cameraItem, 'label', cameraItem.cameraName)
        //   //     this.$set(cameraItem, 'nodeNum', index)
        //   //     this.$set(cameraItem, 'isRequest', true)
        //   //     this.$set(cameraItem, 'isChecked', true)
        //   //   })
        //   // })
        //   resolve(res)
        // })
      })
      return promise
    },
    // 获取点击站点的视频
    getSiteVideo(val, isCheck, streamStatus) {
      let el = ''
      // ischeck为true, 且当前视频的清晰度一致,则不需要重新执行后面的操作
      if (this.getVideoById(val.id) && isCheck && streamStatus) {
        return
      }

      if (val.isSelectAll) {
        // 当前点击的是全选checkbox
        this.handleSelectAll(val, isCheck)
        return
      }

      // eslint-disable-next-line eqeqeq
      if (val.stream == undefined) {
        val.stream = 1
      }

      // let data = {
      //   cameraId: val.id,
      //   stream: val.stream
      // }

      if (!val.isRequest) {
        // this.$refs[`tree${val.stationId}`][0].setChecked(val.id, false)
        // 如果当前数据还在请求中且用户改变checkBox状态，如果取消选中后续数据响应则不做处理
        val.isChecked = isCheck
        this.deleteVideoById(val.id)
        return
      }

      if (isCheck) {
        let videoItem = this.videoList.filter(item => item.id === val.id)

        // 判断当前选择的节点在videoList中是否存在
        if (!videoItem.length) {
          videoItem = this.getEmptyVideo()
        } else {
          videoItem = videoItem[0]
        }

        if (!videoItem) {
          // 如果不存在，则表明已到达视频最大播放数，目前是5个
          this.$message.warning('已到达最大播放数量')
          this.setCheckByCheckItem(val, false)
          return
        }
        // isOccupy标记当前videoItem已经被使用
        videoItem.isOccupy = true
        val.isRequest = false
        // 在playedStationVideo对象里添加视频信息，如目前站点播放了的视频数量、以及当前checkbox的nodeKey用户后续同步checkbox
        // 筛选出对应摄像头视频的播放器 ref 值
        const videoPlayerRefName = this.videoList.filter(item => item.id === val.id)
        if (videoPlayerRefName.length) {
          el = this.$refs[videoPlayerRefName[0].uuid].uuid ? this.$refs[videoPlayerRefName[0].uuid] : this.$refs[videoPlayerRefName[0].uuid][0]
          el.reset()
        }
        var url = ''
        if (val.manufacturers === 4) {
          this.$http.get(`/tb/camera/getLiveHlvStream?deviceId=${val.deviceId}`).then(({
            data: res
          }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            let rtmpUrl = res.data.replace('/openUrl', '').split('//')[1].replace(':', '/')
            console.log(rtmpUrl, 999)
            // rtmp: //192.168.1.205:1935/live/openUrl/MGGCruw
            url = `${process.env.VUE_APP_VIDEO_WS_URL}/rtmp/${rtmpUrl}`
          })
        } else {
          console.log(11, `${process.env.VUE_APP_VIDEO_WS_URL}/rtsp/${val.versionNo}/${val.username}/${val.password}/${val.ip}/${val.channelNo}/${val.stream}`)
          // ws://61.145.180.139:21935/rtsp/{type}/{username}/{password}/{ip}/{passway}/{subtype}
          // const url = `ws://61.145.180.139:21935/rtsp/0/admin/rootabc.123/192.168.53.2/1/1`
          // const url = `ws://192.168.0.221:21935/rtsp/2/admin/21680186pc/192.168.30.35/1/1`
          url = `${process.env.VUE_APP_VIDEO_WS_URL}/rtsp/${val.versionNo}/${val.username}/${val.password}/${val.ip}/${val.channelNo}/${val.stream}`
          // const url = `ws://${process.env.VUE_APP_VIDEO_WS_URL}:21935/rtsp/${val.cameraType}/${val.username}/${val.passwd}/${val.ipAddress}/${val.passwayId}/${val.stream}`
        }
        val.isRequest = true
        if (!val.isChecked) {
          // 用户是否已经取消了选中，是则直接返回
          val.isChecked = true
          return
        }
        // this.setCheckByCheckItem(val, false)
        setTimeout(() => {
          videoItem.id = val.id
          videoItem.url = url
          videoItem.name = val.cameraName
          videoItem.stationId = val.stationId
          this.$set(videoItem, 'stream', val.stream)
          if (videoPlayerRefName.length) {
            el.play(url)
          }
        }, 1000)
      } else {
        this.deleteVideoById(val.id)
      }
    },
    // 初始化摄像头信息
    setInitCamera() {
      // 生成初始化响应式对象
      // eslint-disable-next-line no-unused-vars
      let activeObj = () => {
        let activeData = {}
        this.$set(activeData, 'uuid', getUUID())
        this.$set(activeData, 'id', 0)
        this.$set(activeData, 'url', '')
        this.$set(activeData, 'name', '')
        this.$set(activeData, 'stationId', 0)
        this.$set(activeData, 'isOccupy', false) // 表示是否被占用，是否为空
        return activeData
      }
      for (let i = 0; i < this.maxVideoCount; i++) {
        this.videoList.push(activeObj())
      }
    },
    getUUIDBy(stationId) {
      // 初始化uuidMap用于后续直接从里面取，避免重复生成造成匹配不到
      let uuidMap = this.initUUIDMap()
      if (uuidMap.get(stationId)) {
        return uuidMap.get(stationId)
      } else {
        uuidMap.set(stationId, getUUID())
        return uuidMap.get(stationId)
      }
    },
    initUUIDMap() {
      this.uuidMap = !this.uuidMap ? new Map() : this.uuidMap
      return this.uuidMap
    },
    getTreeBy(stationId) {
      let item = this.getDataListItem(stationId)
      if (!item) {
        return null
      }
      return this.$refs[item[0].ref][0]
    },
    getDataListItem(stationId, dataList) {
      dataList = dataList || this.copyDataList
      return dataList.filter(item => item.id === stationId)
    },
    getCameraList(cameraList) {
      // 如果小于1则表示数据中没有数据,或者只有一个‘全选’，所以可以直接返回空
      return cameraList.length > 1 ? cameraList : []
    },
    getEmptyVideo() {
      for (let i = 0; i < this.videoList.length; i++) {
        if (!this.videoList[i].isOccupy) {
          // 如果url为空则表示为空
          return this.videoList[i]
        }
      }
    },
    getVideoById(id) {
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].id === id) {
          return this.videoList[i]
        }
      }
    },
    getSelectedNodeKeys(stationId) {
      let keys = Object.keys(this.playedStationVideo)
      for (let key of keys) {
        if (key === stationId) {
          return this.playedStationVideo[key].selectedCheckNode
        }
      }
    },
    getAllSelectCheckItem(cameraList) {
      for (let i = 0; i < cameraList.length; i++) {
        if (cameraList[i].isSelectAll) {
          return cameraList[i]
        }
      }
    },
    updateCheckState() {
      let _updateCheckState = (nodeKeys, to) => {
        to.setCheckedKeys(nodeKeys)
      }
      this.dataList.map((item) => {
        let nodeKeys = this.getSelectedNodeKeys(item.id)
        nodeKeys && _updateCheckState(nodeKeys, this.getTreeBy(item.id))
      })
    },
    // 通过checkboxItem,设置checkbox状态
    setCheckByCheckItem(val, state) {
      this.$refs[`tree${val.stationId}`][0].setChecked(val.id, state)
    },
    closeAllStationVideo() {
      let keys = Object.keys(this.playedStationVideo)
      keys.map((key) => {
        if (this.playedStationVideo[key] && this.playedStationVideo[key].count) {
          let tree = this.playedStationVideo[key].stationTree
          this.playedStationVideo[key].count = 0
          this.playedStationVideo[key].selectedCheckNode = []
          tree.setCheckedNodes([])
        }
      })
    },
    clearVideolist() {
      for (let i = 0; i < this.videoList.length; i++) {
        this.videoList[i].url = ''
      }
    },
    deleteVideoById(id) {
      for (let i = 0; i < this.videoList.length; i++) {
        if (this.videoList[i].id === id) {
          this.videoList[i].id = ''
          this.videoList[i].url = ''
          this.videoList[i].name = ''
          this.videoList[i].isOccupy = false
        }
      }
    },
    _setPlayedStationCheckNode(playedStation) {
      playedStation.selectedCheckNode = playedStation.stationTree ? playedStation.stationTree.getCheckedKeys() : []
    },
    addAllCheckedInPlayedStation() {
      let keys = Object.keys(this.playedStationVideo)
      for (let key of keys) {
        this._setPlayedStationCheckNode(this.playedStationVideo[key])
      }
    }
  }
}
