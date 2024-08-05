<template>
  <div class="dashboard-editor-container">
    <!-- 左侧窗口 -->
    <el-row :gutter="24">
      <el-col :xs="24" :sm="24" :lg="18">
        <div class="chart-wrapper card_box left_box">
          <!-- 窗口显示区域 -->
          <!-- 默认自动播放 :autoplay="true" -->
          <!-- 默认直播 :islive="true" -->
          <!-- :videoid="videoid" -->
          <div class="top_box">
            <videos-all-videos
              ref="videoBox"
              style="width: 100%; height: 100%"
              :checkVideoList="checkVideoList"
              :layoutNum="layoutNum"
              @core-event="handleCoreEvent"
              @error="handleError"
              @reloading="handleReloading"
            />
          </div>
          <!-- 选择窗口数目 -->
          <div class="bottom_box">
            <div class="">
              <el-button class="margin_right" size="mini" @click="changeLive">切换视频模式</el-button>
              <el-button class="margin_right" size="mini" @click="clickPlay">暂停所选视频</el-button>
              <el-button class="margin_right" size="mini" @click="clickPause">播放所选视频</el-button>
              <el-button class="margin_right" size="mini" @click="disposePlay">销毁所选视频</el-button>
              <!-- <el-button class="margin_right" size="mini" @click="replayPlay">重播所选视频</el-button> -->
              <!-- <el-button class="margin_right" size="mini" @click="getStatus">获取播放器状态</el-button> -->
              <el-button class="margin_right" size="mini" @click="replacePlay">替换所选视频</el-button>
              <el-select v-model="replace_play" class="margin_right" placeholder="请选择视频" size="mini">
                <el-option
                  v-for="(item) in replaceVideoList"
                  :key="item.hlsUrl"
                  :label="item.hlsUrl"
                  :value="item.userId + item.sessionID"
                />
              </el-select>
            </div>
            <div
              v-for="(item, index) in setImgs"
              :key="index"
              class="margin_right"
              @click="changeLayout(item)"
            >
              <el-button size="mini">{{ item.name }}</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 右侧选择 -->
      <el-col :xs="24" :sm="24" :lg="6">
        <div class="chart-wrapper chart-wrapper2 card_box">
          <span class="title">
            <span>
              <img src="~@/assets/img/left-border.png" class="img" alt="">
              <span class="">视频列表</span>
            </span>
          </span>
          <div class="entrance-main">
            <div class="item">
              <template v-if="treeData.length">
                <div class="line_checkbox__flex">
                  <el-tree
                    ref="trees"
                    :data="treeData"
                    :props="defaultProps"
                    show-checkbox
                    default-expand-all
                    highlight-current
                    node-key="sessionID"
                    @node-click="handleNodeClickS"
                    @check="handleNodeCheck"
                  />
                </div>
              </template>
              <!-- 右边视频分栏操作 -->
              <div v-else class="noSheBei">
                <div class="table-emptyword">暂无数据</div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import videoApi from "@/api/video";
// 引入视频子组件
import videosAllVideos from "@/views/m3u8/components/video-aliplayer.vue";
export default {
  name: "Dashboard",
  components: { videosAllVideos },
  data() {
    return {
      // 左侧树形监控列表
      treeData: [
        {
          vname: "视频列表",
          hlsUrl: "视频列表1",
          disabled: true,
          videos: [
          ],
        },
      ],
      defaultProps: {
        children: "videos",
        label: "hlsUrl",
      },
      // 子组件ref实例
      playerRefs: {}, // 用于存储所有子组件实例的引用
      // 选择要替换的视频
      replace_play: null,
      // 中间播放视频的数组
      checkVideoList: [
      ],
      // 右侧选中复选框列表
      checkDeviceInfoList: [],
      // 右侧渲染的视频列表
      deviceInfoList: [
        {
          userId: "1",
          hlsUrl: "//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8",
          // hlsUrl: '{"FD":"//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8","OD":"//d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/ed_hd.m3u8"}', // 清晰度配置
          // hlsUrl: JSON.stringify({ // 清晰度配置
          //   FD: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8',
          //   OD: '//d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/ed_hd.m3u8'
          // }),
          sessionID: 1,
          channel: "1",
          rtmpUrl: "1111",
        },
        {
          userId: "1",
          hlsUrl: "//d2zihajmogu5jn.cloudfront.net/elephantsdream/hls/ed_hd.m3u8",
          sessionID: 2,
          channel: "1",
          rtmpUrl: "2222",
        },
        {
          userId: "1",
          hlsUrl: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
          sessionID: 3,
          channel: "1",
          rtmpUrl: "3333",
        },
      ],
      // 视频页面的分栏设置
      layoutNum: 1,
      setImgs: [
        {
          name: "1 × 1",
          nums: 1,
        },
        {
          name: "2 × 2",
          nums: 4,
        },
        {
          name: "1 + 5",
          nums: 6,
        },
        {
          name: "1 + 7",
          nums: 8,
        },
        {
          name: "3 × 3",
          nums: 9,
        },
        {
          name: "4 × 4",
          nums: 16,
        },
      ],
    };
  },
  computed: {
    // 获取所有视频实例
    allPlayerInstances() {
      return this.$refs.videoBox.playerInstances;
    },
    // 自动改变布局
    calculateLayoutNum() {
      const length = this.checkDeviceInfoList.length;
      if (length === 1) {
        return 1;
      } else if (length > 1 && length <= 4) {
        return 4;
      } else if (length > 4 && length <= 6) {
        return 6;
      } else if (length > 6 && length <= 8) {
        return 8;
      } else if (length > 8 && length <= 9) {
        return 9;
      } else if (length > 9 && length <= 16) {
        return 16;
      } else {
        return 4;
      }
    },
    // 替换视频集合
    replaceVideoList() {
      // 过滤掉当前已选择的视频
      return this.deviceInfoList.filter((item) => {
        return !this.checkDeviceInfoList.some((checkItem) => {
          return checkItem.userId + checkItem.sessionID === item.userId + item.sessionID;
        })
      });
    },
  },
  watch: {
    // 监听deviceInfoList的长度变化 用于改变布局
    'checkDeviceInfoList.length': {
      immediate: true,
      handler(newValue) {
        this.layoutNum = this.calculateLayoutNum;
      }
    }
  },
  mounted() {
    // this.getStartPush(); // 请求数据
    this.getLocalPush(); // 本地数据
  },
  methods: {
    // 本地数据
    getLocalPush() {
      // 右侧渲染的视频列表
      const deviceInfoList = this.deviceInfoList.map((item) => {
        return {
          ...item,
          disabled: false,
          options: { ...this.$refs.videoBox.options }
        }
      })
      // 右侧渲染的视频列表
      this.deviceInfoList = deviceInfoList
      // 右侧勾选数组
      this.checkDeviceInfoList.push(this.deviceInfoList[0], this.deviceInfoList[1]) // 右侧列表 模拟勾选中视频
      // 中间播放数组
      this.checkVideoList.push({ ...this.deviceInfoList[0] }, { ...this.deviceInfoList[1] }) // 中间播放数组 添加播放视频
      // 树形列表
      this.treeData[0].videos = deviceInfoList // 树形结构数据 合并数据
      deviceInfoList[0].disabled = true // 树形结构数据 添加默认禁用
      deviceInfoList[1].disabled = true // 树形结构数据 添加默认禁用
      this.updateCheckKeys() // 更新选中节点
      // 更新自己选中索引
      this.$refs.videoBox.chooseIndex = this.checkVideoList.length // 修改索引
    },
    // 请求右侧渲染的视频列表
    getStartPush() {
      videoApi.getLiveList().then((response) => {
        if (response.data.length > 0) {
          // 右侧渲染的视频列表
          const deviceInfoList = this.deviceInfoList.map((item) => {
            return {
              ...item,
              disabled: false,
              options: { ...this.$refs.videoBox.options }
            }
          })
          // 右侧渲染的视频列表
          const data = response.data.map((item) => {
            return {
              ...item,
              disabled: false,
            }
          })
          // 右侧渲染的视频列表
          this.deviceInfoList = [...deviceInfoList, ...data]
          // 右侧勾选数组
          this.checkDeviceInfoList.push(this.deviceInfoList[0], this.deviceInfoList[1]) // 右侧列表 模拟勾选中视频
          // 中间播放数组
          this.checkVideoList.push({ ...this.deviceInfoList[0] }, { ...this.deviceInfoList[1] }) // 中间播放数组 添加播放视频
          // 树形列表
          this.treeData[0].videos = [...deviceInfoList, ...data] // 树形结构数据 合并数据
          deviceInfoList[0].disabled = true // 树形结构数据 添加默认禁用
          deviceInfoList[1].disabled = true // 树形结构数据 添加默认禁用
          this.updateCheckKeys() // 更新选中节点
          // 更新自己选中索引
          this.$refs.videoBox.chooseIndex = this.checkVideoList.length // 修改索引
        }
      }).catch(() => {
        // 右侧渲染的视频列表
        const deviceInfoList = this.deviceInfoList.map((item) => {
          return {
            ...item,
            disabled: false,
            options: { ...this.$refs.videoBox.options }
          }
        })
        // 右侧渲染的视频列表
        this.deviceInfoList = deviceInfoList
        // 右侧勾选数组
        this.checkDeviceInfoList.push(this.deviceInfoList[0], this.deviceInfoList[1]) // 右侧列表 模拟勾选中视频
        // 中间播放数组
        this.checkVideoList.push({ ...this.deviceInfoList[0] }, { ...this.deviceInfoList[1] }) // 中间播放数组 添加播放视频
        // 树形列表
        this.treeData[0].videos = deviceInfoList // 树形结构数据 合并数据
        deviceInfoList[0].disabled = true // 树形结构数据 添加默认禁用
        deviceInfoList[1].disabled = true // 树形结构数据 添加默认禁用
        this.updateCheckKeys() // 更新选中节点
        // 更新自己选中索引
        this.$refs.videoBox.chooseIndex = this.checkVideoList.length // 修改索引
      })
    },
    // 切换显示视频数量
    changeLayout({ nums }) {
      // 处理显示视频数
      if (nums < this.checkVideoList.length) {
        // 收集过滤的数组
        const checkDeviceInfoList = this.checkVideoList.slice(nums, this.checkVideoList.length)
        // 中间播放视频的数组
        this.checkVideoList = this.checkVideoList.filter((item, index) => index < nums) // 删除中间超过显示窗口的视频
        this.$refs.videoBox.chooseIndex = this.checkVideoList.length - 1 // 修改选中索引
        // 右侧选中的列表
        this.checkDeviceInfoList = this.checkDeviceInfoList.filter((item, index) => index < nums) // 过滤右侧选中复选框列表
        // 右侧树列表
        this.updateCheckKeys() // 过滤取消勾选复选框
        checkDeviceInfoList.forEach(video => { // 去除树选中禁用
          this.treeData[0].videos.find((item) => item.userId + item.sessionID === video.userId + video.sessionID).disabled = false
        })
      } else {
        // 中间播放视频的数组
        this.$refs.videoBox.chooseIndex = this.checkVideoList.length // 修改索引
      }
      // 中间播放区域
      this.layoutNum = nums; // 修改显示视频数量
    },
    // // 点击单选框
    // changeVideoIndex(video, event) {
    //   // 右侧渲染的视频列表
    //   const videoid = video.userId + video.sessionID
    //   if (event) {
    //     // 勾选中
    //     const isExist = this.checkVideoList.filter((item) => item.hlsUrl === video.hlsUrl)[0];
    //     // 判断中间播放视频的数组 是否有该视频
    //     if (isExist) {
    //       // 右侧选中复选框列表
    //       // this.checkDeviceInfoList = this.checkDeviceInfoList.filter((item) => item.userId + item.sessionID !== video.userId + video.sessionID)
    //       this.$message.warning('此视频已存在')
    //       return
    //     }
    //     // 中间播放区域
    //     this.checkVideoList = [...this.checkVideoList, ({ ...video, options: { ...this.$refs.videoBox.options }})] // 添加选中的视频
    //     this.$refs.videoBox.chooseIndex = this.checkVideoList.length - 1 // 修改索引
    //   } else {
    //     // 取消勾选
    //     // 中间播放视频的数组
    //     this.checkVideoList = this.checkVideoList.filter((item) => item.userId + item.sessionID !== videoid) // 减去一条取消勾选的视频
    //     this.$refs.videoBox.chooseIndex = this.$refs.videoBox.chooseIndex - 1 // 修改索引
    //     // 右侧选中复选框列表
    //     this.checkDeviceInfoList = this.checkDeviceInfoList.filter((item) => item.userId + item.sessionID !== videoid) // 过滤取消勾选的视频
    //   }
    // },
    // 选中复选框
    handleNodeCheck(video, event) {
      this.handleNodeClickS(video, true)
    },
    // 封装方法 更新选中节点
    updateCheckKeys() {
      this.$nextTick(() => {
        this.$refs.trees.setCheckedKeys(this.checkVideoList.map(item => item.sessionID)); // 树形结构数据 添加默认选中
      })
    },
    // 封装方法 更想索引
    changeIndex() {
      this.$nextTick(() => {
        if (this.layoutNum > this.checkVideoList.length) {
          this.$refs.videoBox.chooseIndex = this.checkVideoList.length // 修改索引 不超过最大值
        } else {
          this.$refs.videoBox.chooseIndex = this.checkVideoList.length - 1 // 修改索引
        }
      })
    },
    // 点击单选框 或列表项
    handleNodeClickS(video, event) {
      // console.log(video, event);
      // 视频已经选中
      if (video.disabled) {
        this.$message.warning('此视频已被选中')
        return
      }
      // 选中的是列表
      if (video.videos) return
      const place_play = video
      const { i } = this.returnVideo()
      // 替换
      if (i < this.checkVideoList.length) {
        const oldVideo = this.checkVideoList[i] // 被替换的原视频
        const replaceVideoId = oldVideo.userId + oldVideo.sessionID // 保存被替换的原视频id
        oldVideo.hlsUrl = place_play.hlsUrl
        oldVideo.rtmpUrl = place_play.rtmpUrl
        oldVideo.userId = place_play.userId
        oldVideo.sessionID = place_play.sessionID
        // 更新右侧checkDeviceInfoList
        this.checkDeviceInfoList = this.checkDeviceInfoList.filter(item => item.userId + item.sessionID !== replaceVideoId) // 右侧取消勾选 被替换的原视频选项
        this.checkDeviceInfoList = [...this.checkDeviceInfoList, this.deviceInfoList.find((item) => item.userId + item.sessionID === place_play.userId + place_play.sessionID)]// 右侧增加勾选 替换的原视频选项
        // 更新右侧禁用
        this.treeData[0].videos.find(item => item.userId + item.sessionID === replaceVideoId).disabled = false
        this.treeData[0].videos.find(item => item.userId + item.sessionID === oldVideo.userId + oldVideo.sessionID).disabled = true
        this.updateCheckKeys() // 更新选中节点
        return
      } else if (event) {
        // 右侧渲染的视频列表 选中添加
        const isExist = this.checkVideoList.filter((item) => item.hlsUrl === video.hlsUrl)[0];
        // 使用了禁用则为多余判断 判断中间播放视频的数组 是否有该视频
        if (isExist) {
          // 右侧选中复选框列表
          this.$message.warning('此视频已存在')
          return
        }
        // 中间播放区域的数组
        this.checkVideoList = [...this.checkVideoList, ({ ...video, options: { ...this.$refs.videoBox.options }})] // 添加一条视频
        // 右侧勾选数组
        this.checkDeviceInfoList = [...this.checkDeviceInfoList, video]// 右侧列表 模拟勾选中视频 添加一条视频
        this.changeIndex() // 更新索引 不超过最大值
        // 树列表
        video.disabled = true // 修改右侧选中复选框
        this.updateCheckKeys() // 更新选中节点
      }
    },
    // 下面按钮--------------
    // 封装提示函数
    testFn(videoid, msg = '未选择视频') {
      if (!videoid) {
        this.$message.warning(msg)
        return true
      }
    },
    // 封装函数
    returnVideo() {
      const parDom = this.$refs.videoBox // video实例
      const i = parDom.chooseIndex // 选中索引
      if (i >= this.checkVideoList.length) return { videoid: null, i, parDom } // 选中的窗口无视频
      const videoid = this.checkVideoList[i].userId + this.checkVideoList[i].sessionID // 选中窗口视频id
      return { videoid, parDom, i }
    },
    // 选中暂停
    clickPlay() {
      const { videoid, parDom } = this.returnVideo()
      if (this.testFn(videoid)) return // 未选择终止
      const dom = parDom.playerRefs[videoid][0]
      dom.pause()
    },
    // 选中播放
    clickPause() {
      const { videoid, parDom } = this.returnVideo()
      if (this.testFn(videoid)) return // 未选择终止
      const dom = parDom.playerRefs[videoid][0]
      dom.play()
    },
    // 切换直播或普通模式
    changeLive() {
      const { videoid, parDom } = this.returnVideo()
      if (this.testFn(videoid)) return // 未选择终止
      const dom = parDom.playerRefs[videoid][0]
      if (dom.options.isLive) {
        // 直播模式
        dom.options.isLive = !dom.options.isLive
        dom.options.skinLayout = this.$refs.videoBox.dianbo_skinLayout
      } else {
        dom.options.isLive = !dom.options.isLive
        dom.options.skinLayout = this.$refs.videoBox.liveSkinLayout
      }
      // this.$message.success()
    },
    // 重播所选视频
    replayPlay() {
      const { videoid, parDom } = this.returnVideo()
      if (this.testFn(videoid)) return // 未选择终止
      const dom = parDom.playerRefs[videoid][0]
      dom.replay();
      // this.$message.success()
    },
    // 销毁所选视频
    disposePlay() {
      const { videoid } = this.returnVideo()
      if (this.testFn(videoid)) return // 未选择终止
      // 中间播放视频的数组
      this.checkVideoList = this.checkVideoList.filter((item) => item.userId + item.sessionID !== videoid) // 减去选中的一条视频
      this.changeIndex() // 更新索引 不超过最大值
      // 右侧选中复选框列表
      this.checkDeviceInfoList = this.checkDeviceInfoList.filter((item) => item.userId + item.sessionID !== videoid) // 取消勾选选中的一条视频
      // 树列表
      this.updateCheckKeys() // 更新树选中节点
      this.treeData[0].videos.find(item => item.userId + item.sessionID === videoid).disabled = false // 去除树选中禁用
    },
    // 替换所选视频
    replacePlay() {
      if (!this.replace_play) {
        this.$message.warning('请选择要替换的视频')
        return
      }
      const place_play = this.replaceVideoList.find(item => item.userId + item.sessionID === this.replace_play)
      const { i } = this.returnVideo()
      // 为空直接添加
      if (i >= this.checkVideoList.length) {
        // 右侧选中复选框列表
        this.checkDeviceInfoList.push(place_play) // 添加一条视频
        // 中间播放视频的数组
        this.checkVideoList.push({ ... place_play }) // 添加一条视频
        // 右侧选中复选框列表
        this.checkDeviceInfoList = [...this.checkDeviceInfoList, place_play]// 右侧列表 模拟勾选中视频 添加一条视频
        // if (this.testFn(videoid, '为选中播放的视频')) return // 未选择终止
        // 树列表
        this.updateCheckKeys() // 更新选中节点
        this.treeData[0].videos.find(item => item.userId + item.sessionID === place_play.userId + place_play.sessionID).disabled = true // 更新右侧禁用
        return
      }
      // 替换原有视频的属性
      const oldVideo = this.checkVideoList[i] // 被替换的原视频
      const replaceVideoId = oldVideo.userId + oldVideo.sessionID // 保存被替换的原视频id
      oldVideo.hlsUrl = place_play.hlsUrl
      oldVideo.rtmpUrl = place_play.rtmpUrl
      oldVideo.userId = place_play.userId
      oldVideo.sessionID = place_play.sessionID
      // 右侧选中列表
      this.checkDeviceInfoList = this.checkDeviceInfoList.filter(item => item.userId + item.sessionID !== replaceVideoId) // 右侧取消勾选 被替换的原视频选项
      this.checkDeviceInfoList = [...this.checkDeviceInfoList, this.deviceInfoList.find((item) => item.userId + item.sessionID === place_play.userId + place_play.sessionID)]// 右侧增加勾选 替换的原视频选项
      // 树列表
      this.updateCheckKeys() // 更新选中节点
      this.treeData[0].videos.find(item => item.userId + item.sessionID === replaceVideoId).disabled = false // 更新右侧禁用
      this.treeData[0].videos.find(item => item.userId + item.sessionID === oldVideo.userId + oldVideo.sessionID).disabled = true // 更新右侧禁用
      // 下侧下拉框
      this.replace_play = null // 清空初始化
    },
    // 获取播放器状态
    getStatus() {
      const { videoid, parDom } = this.returnVideo()
      if (!videoid) {
        this.$message('未选择视频', 'error')
        return
      }
      const dom = parDom.playerRefs[videoid][0]
      const status = dom.getStatus();
      // console.log(`getStatus:`, status);
      this.$message.success('播放器状态:' + status)
    },
    // 监听子组件-----------
    // 监听子组件 视频播放
    handleCoreEvent($event) {
      // 处理来自 HlsPlayer 的核心事件
    },
    // 监听子组件 错误
    handleError(error) {
      console.log(error);
      // 处理来自 HlsPlayer 的错误事件
    },
    // 监听子组件 重新加载
    handleReloading() {
      // 处理 HlsPlayer 重新加载事件
    },
  },
};
</script>

<style lang="scss" scoped>
// 右侧复选框
.line_checkbox__flex {
  width: 100%;
  ::v-deep .el-tree-node__label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle; /* 确保文本垂直居中显示 */
  }
}
// 右侧时间
.el-date-editor.el-input__inner {
  width: 330px;
}
// 父级容器
.dashboard-editor-container {
  padding: 14px 20px 14px;
  background-color: rgb(240, 242, 245);
  // 头部
  .title {
    color: #333;
    font-size: 18px;
    height: 20px;
    line-height: 20px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;
    font-weight: 600;
    .date {
      margin-top: 5px;
    }
    span {
      display: flex;
      align-items: center;
      span {
        // margin-top: 3px;
        margin-left: 5px;
      }
    }
    .img {
      margin-left: 10px;
    }
  }
  .chart-wrapper2 {
    padding: 14px 14px 0;
  }
  // 卡片背景色
  .chart-wrapper {
    background: #fff;
  }
  // 背景
  .card_box {
    // border-radius: 12px;
    // border-radius: 0px;
    box-shadow: 0 2px 6px #0000001a;
    height: calc(100vh - (85px + 14px + 14px ));
  }
  .card_box:hover {
    box-shadow: 0 4px 14px hsla(0, 0%, 0%, 0.100);
    // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: all ease 0.3s;
  }
  .left_box {
    display: flex;
    flex-direction: column;
    // border: 2px solid #1890ff;
    .top_box {
      // background-color: #000;
      flex: 1;
      // width: 100%;
      // height: 100%;
    }
    .bottom_box {
      // height: 30px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 10px;
      .margin_right {
        margin-right: 10px;
        margin-top: 7px;
        margin-bottom: 7px;
        // border: 0px;
      }
      .el-button{
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
      }
      ::v-deep .el-input__inner{
        box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
      }
    }
  }
}
</style>
