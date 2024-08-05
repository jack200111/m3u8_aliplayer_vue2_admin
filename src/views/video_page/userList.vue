<template>
  <div class="member_list app-container">
    <!-- 搜索栏 -->

    <!-- 结果列表 -->
    <el-card>
      <el-table v-loading="loading" :data="deviceInfoList" stripe style="width: 100%">
        <!-- <el-table-column label="userId" align="center" prop="userID" /> -->
        <el-table-column label="userID" align="center" prop="userID">
          <template slot-scope="scope">
            {{ (scope.row.userID + '').split('').fill('*').join('') }}
          </template>
        </el-table-column>
        <el-table-column label="设备ID" align="center" prop="deviceId" />
        <el-table-column label="设备序列号" align="center" prop="deviceFullSerial" width="105" />
        <el-table-column label="设备协议版本信息" align="center" prop="devProtocolVersion" />
        <el-table-column label="devType" align="center" prop="devType" />
        <el-table-column label="设备会话密钥" align="center" prop="sessionKey" width="105" />
        <el-table-column prop="ip" align="center" label="主机" />
        <el-table-column prop="port" align="center" label="端口" />
        <el-table-column prop="firmwareVersion" align="center" label="固件版本信息" width="105" />
        <el-table-column prop="manufacture" align="center" label="制造商代码" />
        <el-table-column prop="devName" align="center" label="devName" />
        <el-table-column prop="reliableTransmission" align="center" label="可靠传输" />
        <el-table-column prop="webSocketTransmission" align="center" label="网络接口传输" width="105" />
        <el-table-column prop="supportRedirect" align="center" label="是否支持重定向">
          <template slot-scope="scope">
            <dict-tag dict-key="supportRedirect" :value="scope.row.supportRedirect" />
          </template>
        </el-table-column>
        <el-table-column prop="marketType" align="center" label="注册类型" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="marketType" :value="scope.row.marketType" />
          </template>
        </el-table-column>
        <el-table-column prop="passWord" align="center" label="设备登录中心管理服务器的密码" />
        <el-table-column prop="deviceSerial" align="center" label="设备序列号" />
        <el-table-column label="获取视频流" width="126" fixed="right" align="center">
          <template slot-scope="scope">
            <el-tooltip effect="dark" :content="'获取视频流'" placement="top-start">
              <span style="color: #1890ff;cursor: pointer;" @click="$router.push(`/video_page/startPush?userId=${scope.row.userID}`)">
                获取视频流
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
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
    // 将字符串中的每个字符替换为星号
    getStarredUserId(userID) {
      let str = ''
      for (let i = 0; i < (userID + '').length; i++) {
        str += '*';
      }
      return str;
    },
    getStartPush() {
      this.loading = true;
      videoApi.getUserList().then((response) => {
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
      }).catch(() => {
        this.loading = false;
      })
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
