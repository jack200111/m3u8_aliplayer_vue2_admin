<template>
  <div @click="click">
    <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
  </div>
</template>

<script>
import screenfull from 'screenfull'
// 在你的组件或其他文件中
// const screenfull = require('screenfull');
export default {
  // name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    console.log(screenfull, 'screenfull--------');
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      // if (!screenfull.enabled) {
      //   this.$message({
      //     message: 'you browser can not work',
      //     type: 'warning'
      //   })
      //   return false
      // }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.enabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
