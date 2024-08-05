<template>
  <div class="member_list app-container">
    <!-- 搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="24">
          <el-form :model="searchModel" size="small" :inline="true" label-width="88px">
            <el-form-item label="设备id" prop="id">
              <el-input
                v-model="searchModel.userId"
                placeholder="请输入设备id"
                type="password"
                clearable
                @keyup.enter.native="getStartPush"
              />
            </el-form-item>
            <el-form-item label="通道" prop="channel">
              <el-input
                v-model="searchModel.channel"
                placeholder="请输入通道名称"
                clearable
                @keyup.enter.native="getStartPush"
              />
            </el-form-item>
            <el-form-item label="视频流类型" prop="streamType">
              <!-- <el-input
                v-model="searchModel.streamType"
                placeholder="请输入视频流类型"
                clearable
                @keyup.enter.native="getStartPush"
              /> -->
              <el-select v-model="searchModel.streamType" placeholder="请选择视频流类型">
                <el-option
                  v-for="item in streamType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getStartPush">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="clearSearchParams">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table v-loading="loading" :data="deviceInfoList" stripe style="width: 100%">
        <el-table-column label="rtmp视频流地址" align="center" prop="rtmpUrl" />
        <el-table-column label="会话ID" align="center" prop="sessionID" />
        <el-table-column label="m3u8视频流地址" align="center" prop="hlsUrl" />
      </el-table>
      <div v-show="!loading && !deviceInfoList.length" style="text-align: center; margin-top: 18px; ;display: flex;align-items: center;justify-content: center;">
        <el-button type="primary" size="small" @click="$router.push('/video_page/userList')">前往在线设备列表</el-button>
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
      loading: true,
      streamType: [
        {
          value: 0,
          label: "主码流",
        },
        {
          value: 1,
          label: "子码流",
        },
        {
          value: 2,
          label: "第三码流",
        }
      ],
      // total: 0,
      searchModel: {
        // page: 1,
        // pageSize: 10,
        userId: null,
        channel: 1,
        streamType: 0
      },
      deviceInfoList: [],
    };
  },
  created() {
    const userId = this.$route.query.userId;
    if (userId && userId !== "undefined") {
      this.searchModel.userId = userId;
      this.getStartPush();
    } else {
      // this.getStartPush();
      this.loading = false
    }
  },
  methods: {
    getStartPush() {
      if (this.searchModel.userId != null && this.searchModel.userId !== "") {
        this.loading = true
        videoApi.getStartPush(this.searchModel).then((response) => {
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
          // this.deviceInfoList = [];
          this.loading = false
        })
      }
    },
    // 停止视频流
    stopPush() {
      if (this.searchModel.userId != null && this.searchModel.userId !== "") {
        videoApi.stopPush(this.searchModel).then((response) => {
          this.$message({
            type: "success",
            message: "成功",
          });
        }).catch(() => {
          this.$message({
            type: "success",
            message: "失败",
          });
        })
      }
    },
    // 重置
    clearSearchParams() {
      this.searchModel = {
        page: 1,
        pageSize: 10,
        search_key: {
        }
      }
      this.getStartPush()
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
