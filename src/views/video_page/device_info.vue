<template>
  <div class="member_list app-container">
    <!-- 搜索栏 -->
    <!-- 结果列表 -->
    <el-card>
      <el-table v-loading="loading" :data="deviceInfoList" stripe style="width: 100%">
        <el-table-column label="序号" align="center" prop="index" />
        <el-table-column label="设备序列号" align="center" prop="serialNumber" />
        <el-table-column label="通道总数" align="center" prop="channelAmount" />
        <el-table-column label="模拟通道个数" align="center" prop="channelNumber" />
        <el-table-column label="设备类型" align="center" prop="devType" />
        <el-table-column label="设备中的硬盘数量" align="center" prop="diskNumber" />
        <el-table-column label="模拟通道关联的报警输入个数" align="center" prop="alarmInPortNum" />
        <el-table-column label="报警输入总数" align="center" prop="alarmInAmount" />
        <el-table-column label="模拟通道关联的报警输出个数" align="center" prop="alarmOutPortNum" />
        <el-table-column label="报警输出总数" align="center" prop="alarmOutAmount" />
        <el-table-column label="起始视频通道号" align="center" prop="startChannel" />
        <el-table-column label="语音对讲通道个数" align="center" prop="audioChanNum" />
        <el-table-column label="设备支持的最大数字通道个数" align="center" prop="maxDigitChannelNum" />
        <el-table-column label="语音对讲的音频格式" align="center" prop="audioEncType" />
        <el-table-column prop="audioEncType" align="center" label="语音对讲的音频格式" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="audioEncType" :value="scope.row.audioEncType" />
          </template>
        </el-table-column>
        <el-table-column label="支持的零通道个数" align="center" prop="supportZeroChan" />
        <el-table-column label="零通道的起始编号" align="center" prop="startZeroChan" />
        <el-table-column prop="smartType" align="center" label="智能模式" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="smartType" :value="scope.row.smartType" />
          </template>
        </el-table-column>
        <el-table-column label="SIM卡手机号码" align="center" prop="simcardPhoneNum" />
        <el-table-column label="SIM卡序列号" align="center" prop="simcardSN" />
        <el-table-column
          label="操作"
          width="125"
          header-align="center"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showPicCfgs(scope.row.picCfgs)"
            >查看通道信息<i class="el-icon-view el-icon--right" /></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!loading && !deviceInfoList.length" style="text-align: center; margin-top: 18px; ;display: flex;align-items: center;justify-content: center;">
        <el-button type="primary" size="small" @click="$router.push('/video_page/devices')">前往视频设备列表</el-button>
      </div>
    </el-card>

    <!-- 分页组件 -->
    <!-- 编辑picCfgs对话框 -->
    <el-dialog title="通道配置详情" :visible.sync="dialogVisible" width="65%">
      <el-table :data="currentPicCfgs">
        <el-table-column label="通道名称" prop="channelName" />
        <el-table-column prop="isShowChanName" label="是否显示通道名称" width="140">
          <template slot-scope="scope">
            <dict-tag dict-key="isShowChanName" :value="scope.row.isShowChanName" />
          </template>
        </el-table-column>
        <el-table-column label="通道名称位置" prop="chanNameXPos" />
        <el-table-column label="通道名称位置" prop="chanNameYPos" />
        <el-table-column prop="isShowOSD" label="是否显示日期信息" width="140">
          <template slot-scope="scope">
            <dict-tag dict-key="isShowOSD" :value="scope.row.isShowOSD" />
          </template>
        </el-table-column>
        <el-table-column label="OSD位置" prop="osdXPos" />
        <el-table-column label="OSD位置" prop="osdYPos" />
        <el-table-column prop="osdType" label="OSD格式" width="170">
          <template slot-scope="scope">
            <dict-tag dict-key="osdType" :value="scope.row.osdType" />
          </template>
        </el-table-column>
        <el-table-column prop="osdAtrib" label="OSD属性" width="120">
          <template slot-scope="scope">
            <dict-tag dict-key="osdAtrib" :value="scope.row.osdAtrib" />
          </template>
        </el-table-column>
        <el-table-column prop="isShowWeek" label="是否显示星期">
          <template slot-scope="scope">
            <dict-tag dict-key="isShowWeek" :value="scope.row.isShowWeek" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import videoApi from "@/api/video";

export default {
  data() {
    return {
      loading: false,
      // 通道配置详情
      dialogVisible: false,
      currentPicCfgs: [],
      // total: 0,
      searchModel: {
        // page: 1,
        // pageSize: 10,
        userId: null,
      },
      deviceInfoList: [],
    };
  },
  created() {
    const userId = this.$route.query.userId;
    if (userId && userId !== "undefined") {
      this.searchModel.userId = userId;
      this.getDeviceInfoList();
    } else {
      // this.searchModel.search_key.planting_tree_id = ""
      this.getDeviceInfoList();
    }
  },
  methods: {
    // 获取数据
    getDeviceInfoList() {
      if (!this.searchModel.userId || this.searchModel.userId === "") {
        this.loading = false
      } else {
        this.loading = true
        videoApi.getDeviceInfoList(this.searchModel).then((response) => {
          this.loading = false
          if ([response.data].length > 0) {
            this.deviceInfoList = [response.data].map((item, index) => {
              return {
                index: index + 1,
                ...item,
              }
            });
            return
          }
          this.deviceInfoList = [];
        }).catch(() => {
          this.loading = false
        })
      }
    },
    // 查看通道信息
    showPicCfgs(picCfgs) {
      this.currentPicCfgs = picCfgs;
      this.dialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.member_list{
  .el-table__row .el-table__cell, .el-tooltip, .el-button .cell{
      white-space: nowrap;
      /* width: 50px; */
      overflow: hidden;
      text-overflow: ellipsis;   /* 显示省略号 */
  }
}

 .el-select {
    margin-right: 15px;
 }

#search {
  display: flex;
  flex-wrap: wrap;
  .el-input {
    width: 190px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
