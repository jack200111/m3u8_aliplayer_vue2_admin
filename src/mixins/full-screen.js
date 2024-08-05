import { mapState } from "vuex";
export default {
  mounted() {
    // 根据视图宽高缩放
    setTimeout(() => {
      this.resizePage();
    }, 200);
    // 监听缩放
    window.onresize = () => {
      this.resizePage();
    };
  },
  data() {
    return {
      adaptive: {
        transform: "scale(1)",
        left: "0px",
        top: "0px",
      },
    };
  },
  computed: {
    ...mapState({
      isFullScreen: (state) => state.app.sidebar.opened,
    }),
  },
  watch: {
    isFullScreen() {
      // console.log(222);
      this.$nextTick(() => {
        setTimeout(() => {
          this.resizePage();
        }, 200);
      });
    },
  },
  methods: {
    // 自适应
    resizePage() {
      // console.log('resizePage');
      const ref = this.$refs.fullScreen;
      if (!ref) {
        return;
      }
      const width = ref.offsetWidth;
      const height = ref.offsetHeight;
      const leftNum = (1920 - width) / 2 - 10;
      const topNum = (1080 - height) / 2;
      const scaleX = width * 0.0005208;
      const scaleY = height * 0.000925925;
      //
      // console.log(width, 'width');
      // console.log(height, 'height');
      // console.log(leftNum, 'leftNum');
      // console.log(topNum, 'topNum');
      // console.log(scaleX, 'scaleX');
      // console.log(scaleY, 'scaleY');
      // console.log(`${-leftNum - 10}px`, '`${-leftNum - 10}px`');
      // console.log(`${-topNum}px`, '`${-topNum}px`');
      // if (scaleX > 1) {
      //   scaleX = 1
      //   scaleY = 1
      // }

      // if (scaleY > 1) {
      //   scaleY = 1
      // }

      this.$set(this.adaptive, "transform", `scale(${scaleX},${scaleY})`);
      this.$set(this.adaptive, "left", `${-leftNum - 10}px`);
      this.$set(this.adaptive, "top", `${-topNum}px`);
    },
  },
};
