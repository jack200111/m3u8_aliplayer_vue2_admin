<template>
  <div class="member_list app-container">
    <!-- 搜索栏 -->

    <!-- 结果列表 -->
    <el-card>
      <el-table v-loading="loading" :data="deviceInfoList" stripe style="width: 100%">
        <el-table-column label="通道名称" align="center" prop="channelName" />
        <el-table-column prop="isShowChanName" label="是否显示通道名称">
          <template slot-scope="scope">
            <dict-tag dict-key="isShowChanName" :value="scope.row.isShowChanName" />
          </template>
        </el-table-column>
        <el-table-column label="通道名称显示的X轴坐标" align="center" prop="chanNameXPos" width="170" />
        <el-table-column label="通道名称显示的Y轴坐标" align="center" prop="chanNameYPos" width="170" />
        <el-table-column prop="isShowOSD" label="是否显示日期信息" width="140">
          <template slot-scope="scope">
            <dict-tag dict-key="isShowOSD" :value="scope.row.isShowOSD" />
          </template>
        </el-table-column>
        <el-table-column label="OSD显示的X轴坐标" prop="osdXPos" align="center" />
        <el-table-column label="OSD显示的Y轴坐标" prop="osdYPos" align="center" />
        <el-table-column prop="osdType" label="OSD格式">
          <template slot-scope="scope">
            <dict-tag dict-key="osdType" :value="scope.row.osdType" />
          </template>
        </el-table-column>
        <el-table-column prop="osdAtrib" label="OSD属性">
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
      <div v-show="!loading && !deviceInfoList.length" style="text-align: center; margin-top: 18px; ;display: flex;align-items: center;justify-content: center;">
        <el-button type="primary" size="small" @click="$router.push('/video_page/devices')">前往视频设备列表</el-button>
      </div>
    </el-card>
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
      queryParams: {
        // page: 1,
        // pageSize: 10,
      },
      deviceInfoList: [],
    };
  },
  created() {
    const userId = this.$route.query.userId;
    const channel = this.$route.query.channel;
    if (userId !== null && userId !== "undefined") {
      this.queryParams.userId = userId;
    }
    if (channel !== null && channel !== "undefined") {
      this.queryParams.channel = channel;
    }
    if (this.queryParams.userId && this.queryParams.channel) {
      this.getPicCfg();
    }
  },
  methods: {
    getPicCfg() {
      if (this.queryParams.userId && this.queryParams.userId !== "") {
        this.loading = true;
        videoApi.getPicCfg(this.queryParams).then(response => {
          this.deviceInfoList = [response.data].map((item, index) => {
            return {
              index: index + 1,
              ...item,
            }
          });
          // this.total = response.total;
          this.loading = false;
        }).catch(() => {
          this.loading = false;
        })
      } else {
        this.loading = false;
        this.$message("未输入设备id")
      }
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
    // 停止视频流
    stopPushFn(row) {
      videoApi.stopPush(row).then((response) => {
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
    },
    // 重置
    clearSearchParams() {
      this.searchModel = {
        page: 1,
        pageSize: 10,
        search_key: {
        }
      }
      this.getPicCfg()
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
