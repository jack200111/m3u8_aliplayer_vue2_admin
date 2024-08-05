<template>
  <div class="app-container">
    <el-card>
      <el-table v-loading="loading" :data="deviceCfgList">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="设备名称" align="center" prop="serverName" />
        <el-table-column label="设备或遥控器编号" align="center" prop="serverID" />
        <el-table-column prop="recycleRecord" align="center" label="是否支持循环录像" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="recycleRecord" :value="scope.row.recycleRecord" />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="recycleRecord" label="是否支持循环录像" align="center">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.recycle_record" :value="scope.row.status"/>
          </template>
        </el-table-column> -->
        <el-table-column label="设备类型" align="center" prop="serverType" />
        <el-table-column label="通道个数" align="center" prop="channelNum" />
        <el-table-column label="硬盘个数" align="center" prop="hardDiskNum" />
        <el-table-column label="网口个数" align="center" prop="networkPortNum" />
        <el-table-column label="辅口个数" align="center" prop="auxoutNum" />
        <el-table-column label="音频端口个数" align="center" prop="audioNum" />
        <el-table-column prop="majorScale" align="center" label="是否支持主口缩放" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="majorScale" :value="scope.row.majorScale" />
          </template>
        </el-table-column>
        <el-table-column prop="minorScale" align="center" label="是否支持辅口缩放" width="125">
          <template slot-scope="scope">
            <dict-tag dict-key="minorScale" :value="scope.row.minorScale" />
          </template>
        </el-table-column>
        <el-table-column label="RS-232 串口个数" align="center" prop="rs232Num" />
        <el-table-column label="RS-485 串口个数" align="center" prop="rs485Num" />
        <el-table-column label="模拟通道关联的报警输入个数" align="center" prop="alarmInNum" />
        <el-table-column label="模拟通道关联的报警输出个数" align="center" prop="alarmOutNum" />
        <el-table-column label="设备序列号" align="center" prop="serialNumber" />
        <!-- <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div v-show="!loading && !deviceCfgList.length" style="text-align: center; margin-top: 18px; ;display: flex;align-items: center;justify-content: center;">
        <el-button type="primary" size="small" @click="$router.push('/video_page/devices')">前往视频设备列表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import videoApi from "@/api/video";

export default {
  name: "DeviceCfg",
  // dicts: ['recycle_record'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 设备基本信息表格数据
      deviceCfgList: [],
      // 查询参数
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        userId: null,
        serverName: null,
        serverType: null,
      },
    };
  },
  created() {
    const userId = this.$route.query.userId;
    if (userId && userId !== "undefined") {
      this.queryParams.userId = userId;
      this.getList();
    }
  },
  methods: {
    /** 查询设备基本信息列表 */
    getList() {
      if (this.queryParams.userId && this.queryParams.userId !== "") {
        this.loading = true;
        videoApi.getDeviceCfg(this.queryParams).then(response => {
          this.deviceCfgList = [response.data];
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
  }
};
</script>
