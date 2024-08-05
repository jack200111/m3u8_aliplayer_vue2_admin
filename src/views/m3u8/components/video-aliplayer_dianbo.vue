<template>
  <div>
    <div class="parent_box">
      <!-- class="children_box" -->
      <div v-for="i in Number(layoutNum)" :key="i" :class="[cellClass(i), i - 1 === chooseIndex ? 'active' : '']" @click="videoTap(i - 1)">
        <div v-if="checkVideoList[i - 1] && checkVideoList[i - 1].userId + checkVideoList[i - 1].sessionID" :id="checkVideoList[i - 1].userId + checkVideoList[i - 1].sessionID" class="video_box">
          <div style="position: absolute; right: 20px; top: 20px;z-index: 99;color: #fff;font-size: 18px;">
            {{ checkVideoList[i - 1].userId + checkVideoList[i - 1].sessionID }}
          </div>
          <vue-aliplayer-v2
            :ref="checkVideoList[i - 1].userId + checkVideoList[i - 1].sessionID"
            :key="checkVideoList[i - 1].userId + checkVideoList[i - 1].sessionID"
            class="multiple_player"
            :source="checkVideoList[i - 1].hlsUrl"
            :options="checkVideoList[i - 1].options"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueAliplayerV2 from "vue-aliplayer-v2";
const liveSkinLayout = // 直播H5模式默认配置
[
  { name: "bigPlayButton", align: "blabs", x: 30, y: 80 }, // 大播放按钮
  { name: "errorDisplay", align: "tlabs", x: 0, y: 0 }, // 错误提示：当视频播放出错时的提示信息
  { name: "infoDisplay", align: "cc" }, // 信息提示：当切换字幕、倍速等设置时，播放器展示的文字提示信息
  {
    name: "controlBar", align: "blabs", x: 0, y: 0, // 控制栏
    children: [
      { name: "liveDisplay", align: "tlabs", x: 15, y: 6 }, // 显示LIVE字样
      { name: "fullScreenButton", align: "tr", x: 10, y: 10 }, // 全屏按钮
      // { name: "subtitle", align: "tr", x: 15, y: 12 }, // 字幕
      // { name: "setting", align: "tr", x: 15, y: 12 }, // 设置
      // { name: "snapshot", align: "tr", x: 5, y: 12 }, // 截图功能
      { name: "volume", align: "tr", x: 5, y: 10 } // 音量
    ]
  }
]
// 点播H5默认配置
const dianbo_skinLayout = [
  { name: "bigPlayButton", align: "blabs", x: 30, y: 80 },
  {
    name: "H5Loading", align: "cc"
  },
  { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
  { name: "infoDisplay" },
  { name: "tooltip", align: "blabs", x: 0, y: 56 },
  { name: "thumbnail" },
  {
    name: "controlBar", align: "blabs", x: 0, y: 0,
    children: [
      { name: "progress", align: "blabs", x: 0, y: 44 },
      { name: "playButton", align: "tl", x: 15, y: 12 },
      { name: "timeDisplay", align: "tl", x: 10, y: 7 },
      { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
      // { name: "subtitle", align: "tr", x: 15, y: 12 }, // 字幕
      { name: "setting", align: "tr", x: 15, y: 12 }, // 设置
      { name: "volume", align: "tr", x: 5, y: 10 }
    ]
  }
]
export default {
  components: {
    VueAliplayerV2
  },
  props: {
    // 视频地址
    // 默认自动播放
    autoplay: {
      type: Boolean,
      default: true,
    },
    // 默认直播
    islive: {
      type: Boolean,
      default: true,
    },
    // 控制倍数
    playbackRate: {
      type: Boolean,
      default: false,
    },
    // 视频播放数组
    checkVideoList: {
      type: Array,
      required: true,
    },
    // 小窗口数量
    layoutNum: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      playerRefs: {},
      liveSkinLayout,
      dianbo_skinLayout,
      // num: 4,
      chooseIndex: 0,
      // videoid: 4,
      // hlsUrl: '',
      // 用于销毁播放器
      playerArr: [
        // {
        //   id: '',
        //   player: ''
        // },
      ],
      options: {
        // 文档： https://help.aliyun.com/zh/vod/developer-reference/api-operations?spm=a2c4g.11186623.6.1085.36fc6fc57WKZ5P
        // source: '//player.alicdn.com/video/aliyunmedia.mp4',
        // source: 'http://192.168.0.219:8080/hls/0_1.m3u8',
        isLive: false, // 切换为直播流的时候必填
        width: '100%', // 播放器宽度，可形如‘100%’
        height: '100%', // 播放器高度，可形如‘100%’
        format: 'm3u8', // 切换为直播流的时候必填
        setVolume: 1, // 默认音量，取值范围：0-1
        // isVBR: true, // 多码率支持根据网络环境自适应切换视频清晰度，也支持手动切换
        // rePlay: true, // 播放器自动循环播放。
        // skinLayout: false, // 功能组件布局配置，不传该字段使用默认布局。取值：false表示隐藏所有功能组件
        // enableSystemMenu: true, // 是否允许系统右键菜单显示，默认为false
        // snapshot: true, // 是否启用Flash截图功能
        // clickPause: true, // 点击视频画面进行暂停或播放。
        // controlBarVisibility: 'always', // 控制面板的实现，取值：
        // 点播H5默认配置
        // 直播H5模式默认配置
        skinLayout: this.dianbo_skinLayout
      }
    }
  },
  computed: {
    // 改变视频显示 布局模式
    cellClass() {
      return function(index) {
        switch (Number(this.layoutNum)) {
          case 1:
            return ['cell-player-1']
          case 4:
            return ['cell-player-4']
          case 6:
            if (index === 1) return ['cell-player-6-1']
            if (index === 2) return ['cell-player-6-2']
            if (index === 3) return ['cell-player-6-3']
            return ['cell-player-6']
          case 8:
            if (index === 1) return ['cell-player-8-1']
            if (index === 2) return ['cell-player-8-2']
            if (index === 3) return ['cell-player-shu cell-player-8-3']
            if (index === 4) return ['cell-player-shu cell-player-8-4']
            return ['cell-player-8']
          case 9:
            return ['cell-player-9']
          case 16:
            return ['cell-player-16']
          default:
            break
        }
      }
    },
  },
  watch: {
    checkVideoList: {
      handler: function(newVal) {
        this.updatePlayerRefs(newVal);
      },
      deep: true,
    },
  },
  methods: {
    updatePlayerRefs(newVal) {
      this.playerRefs = {};
      newVal.forEach((player, index) => {
        if (player) {
          const videoid = player.userId + player.sessionID;
          this.$nextTick(() => {
            // this.$set(this.playerRefs, videoid, [this.$refs[videoid]]);
            this.playerRefs[videoid] = this.$refs[videoid];
          });
        }
      });
    },
    // 点击选择第几个 指定索引的视频窗口
    videoTap(index) {
      if (this.chooseIndex === index) return
      // 判断选中的中间是否其余是未填充的
      if (index > this.checkVideoList.length) {
        this.$message('此窗口暂不可选择', 'error')
        return
      }
      // 赋值点击选中框
      this.chooseIndex = index
    },
  }
}
</script>

<style scoped lang="scss">
::v-deep .prism-player .prism-setting-list {
    // 隐藏字幕
  .prism-setting-cc {
    display: none !important;
  }
   // 隐藏音轨
  .prism-setting-audio {
    display: none !important;
  }
      // 清晰度
  .prism-setting-quality {
    display: none ;
  }
}
// 隐藏字幕
::v-deep .prism-controlbar {
 .prism-cc-btn {
   display: none !important;
  }
}

.parent_box {
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  // .children_box{
  //   width: 50%;
  //   height: 50%;
  //   border: 1px solid #fff;
  //   color: #fff;
  // }
  .video_box {
    width: 100%;
    height: 100%;
    position: relative;
    .multiple_player{
      // width: 100%;
      //height: 100% !important;
    }
  }
  .active {
    border: 3px solid  #38aaa7 !important;
  }
   // 1 * 1
 .cell-player-1 {
    // width: 100% !important;
    // height: 100% !important;
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #fff;
}
  // 2 * 2
.cell-player-4 {
  width: 50%;
  height: 50%;
  // width: 100%;
  // height: 100%;
  box-sizing: border-box;
  // box-sizing: content-box;
  border-bottom: 1px solid #fff;
  border-left: 1px solid #fff;
  }
  // 1 + 5
  .cell-player-6-1 {
    width: 66.66%;
    height: 66.66% !important;
    box-sizing: border-box;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
  }
  .cell-player-6-2 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;

    .error-word {
      font-size: 0.17rem;
    }
  }
  .cell-player-6-3 {
    position: absolute;
    right: 0;
    top: 33.33%;
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;

    .error-word {
      font-size: 0.17rem;
    }
  }
  .cell-player-6 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    border-left: 1px solid #fff;

    .error-word {
      font-size: 0.17rem;
    }
  }

  // 1 + 7
  .cell-player-8-1 {
    width: 75%;
    height: 75% !important;
    box-sizing: border-box;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
  }
  .cell-player-8-2 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }
  .cell-player-shu {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    right: 0;
    position: absolute;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }
  .cell-player-8-3 {
    top: 25%;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
  }
  .cell-player-8-4 {
    top: 50%;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
  }
   .cell-player-8 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    border-left: 1px solid #fff;

    .img_noplay {
      width: 0.63rem !important;
      height: auto !important;
    }

    .error-word {
      font-size: 0.13rem;
    }
  }

  // 3 * 3
  .cell-player-9 {
    width: 33.33%;
    height: 33.33% !important;
    box-sizing: border-box;
    border-left: 1px solid #fff;
    border-bottom: 1px solid #fff;
  }
  // 4 * 4
  .cell-player-16 {
    width: 25%;
    height: 25% !important;
    box-sizing: border-box;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
  }
}
</style>
