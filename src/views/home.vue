<template>
  <!-- class="dashboard-container" -->
  <div>
    <h2 style="margin-left: 10px;">欢迎来到视频监控管理系统</h2>
  </div>
</template>

<script>

export default {
  name: "Dashboard",
  components: {
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-date-editor.el-input__inner {
  width: 330px;
}

.dashboard-editor-container {
  padding: 24px 24px 12px;
  background-color: rgb(240, 242, 245);
  position: relative;
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
        margin-top: 3px;
      }
    }
    .img {
      margin-left: 10px;
    }
  }
  // 卡片背景色
  .chart-wrapper {
    background: #fff;
    // padding: 12px 12px 0;
    padding: 14px 14px 0;
    margin-bottom: 24px;
  }
  // .chart-wrapper2 {
  //   background: #fff;
  //   padding: 12px 8px 0;
  //   border-radius: 4px;
  // }
  // 会员分析盒子
  .flex_member {
    display: flex;
    .member {
      width: 31%;
      padding-bottom: 10px;
    }
    .member_txt_box {
      flex: 1;
      margin-top: 20px;
    }
    // 文字盒子
    .flex {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-top: 25px;
      .item {
        color: #333;
        width: 25%;
        text-align: center;
        font-size: 20px;
        .num {
          color: #2ab07a;
          font-size: 32px;
          margin-bottom: 20px;
          font-weight: 600;
        }
      }
    }
  }
  // 进出场
  .entrance-main {
    height: 170px;
    color: hsl(104, 53%, 63%);
    display: flex;
    justify-content: space-between;
    align-items: center;

    // margin-top: 46px;
    .item {
      // padding-top: 30px;
      color: #333;
      // flex: 1;
      width: 50%;
      // width: 16.6%;
      text-align: center;
      font-size: 20px;
      .num {
        color: #2ab07a;
        font-size: 32px;
        margin-bottom: 20px;
        font-weight: 600;
      }
    }
  }
  // 背景
  .card_box {
    border-radius: 12px;
    box-shadow: 0 2px 6px #0000001a;
  }
  .card_box:hover {
    box-shadow: 0 4px 14px hsla(0, 0%, 0%, 0.100);
    // box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    transition: all ease 0.3s;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<!-- <style lang="scss" scoped>
.panel-group {
  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 200px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style> -->
