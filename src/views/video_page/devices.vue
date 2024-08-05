<template>
  <div class="member_list app-container">
    <!-- 搜索栏 -->

    <!-- 结果列表 -->
    <el-card>
      <el-table v-loading="loading" :data="deviceInfoList" stripe style="width: 100%">
        <!-- <el-table-column label="设备id" align="center" prop="userId" /> -->
        <el-table-column label="设备id" align="center" prop="userId">
          <template slot-scope="scope">
            {{ (scope.row.userId + '').split('').fill('*').join('') }}
          </template>
        </el-table-column>
        <el-table-column label="rtmp视频流地址" align="center" prop="rtmpUrl" />
        <el-table-column label="会话ID" align="center" prop="sessionID" />
        <el-table-column label="m3u8视频流地址" align="center" prop="hlsUrl" />
        <el-table-column label="通道" align="center" prop="channel" />
        <el-table-column label="查看设备信息" width="126" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'查看设备信息'" placement="top-start">
              <span style="color: #1890ff;cursor: pointer;" @click="$router.push(`/video_page/device_info?userId=${scope.row.userId}`)">
                查看设备信息
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="查看设备基本信息" width="156" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'查看设备基本信息'" placement="top-start">
              <span style="color: #1890ff;cursor: pointer;" @click="$router.push(`/video_page/deviceCfg?userId=${scope.row.userId}`)">
                查看设备基本信息
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="查看通道信息" width="146" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'查看通道信息'" placement="top-start">
              <span style="color: #1890ff;cursor: pointer;" @click="$router.push(`/video_page/getPicCfg?userId=${scope.row.userId}&channel=${scope.row.channel}`)">
                查看通道信息
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="120"
          header-align="center"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="stopPush(scope.row)"
            >停止视频流<i class="el-icon-edit el-icon--right" /></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!loading && !deviceInfoList.length" style="text-align: center; margin-top: 18px; ;display: flex;align-items: center;justify-content: center;">
        <el-button type="primary" size="small" @click="$router.push('/video_page/startPush')">前往获取视频流</el-button>
      </div>
    </el-card>

    <!-- 分页组件 -->

    <!-- 编辑对话框 -->
  </div>
</template>

<script>
import videoApi from "@/api/video";

export default {
  data() {
    return {
      loading: false,
      // total: 0,
      searchModel: {
        // page: 1,
        // pageSize: 10,
      },
      deviceInfoList: [],
    };
  },
  created() {
    this.getStartPush();
  },
  methods: {
    getStartPush() {
      this.loading = true;
      videoApi.getLiveList().then((response) => {
        this.loading = false;
        if (response.data.length > 0) {
          this.deviceInfoList = response.data.map((item, index) => {
            return {
              index: index + 1,
              ...item,
            }
          });
          return
        }
        this.deviceInfoList = [];
      });
    },
    // 停止视频流
    stopPush(row) {
      if (row.userId != null && row.userId !== "") {
        this.$confirm('确定要停止视频吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.stopPushFn(row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }
    },
    stopPushFn(row) {
      videoApi.stopPush(row).then((response) => {
        this.$message({
          type: "success",
          message: "成功",
        });
        this.getStartPush()
      }).catch(() => {
        this.$message({
          type: "success",
          message: "失败",
        });
      })
    },
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
