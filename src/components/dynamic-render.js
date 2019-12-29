const dynamicRender = {
  props: {
    scrollTop: {
      type: Number,
      required: true
    },
    heightOfBlocksWrapper: {
      type: Number,
      required: true
    },
    cellHeight: {
      type: Number,
      required: true
    },
    datas: {
      type: Array,
      required: true
    },
    // 为 0 时加载全部行,
    //预加载的数量,是前后都计算
    preload: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      //上一次加载的第一个节点
      oldTopIndex: 0,
      startRenderNum: 0,
      endRenderNum: 0
    };
  },

  computed: {
    blockHeight() {
      const { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    //计算当前屏幕显示的第一行数据的index
    currentTopIndex() {
      const { scrollTop, cellHeight, datas, heightOfBlocksWrapper } = this;
      const availableScrollTop =
        datas.length * cellHeight - heightOfBlocksWrapper;
      if (cellHeight > 0 && availableScrollTop < scrollTop) {
        /*eslint no-console: "warn"*/
        console.warn(
          `错误的scrollTop值 ${scrollTop},可用滚动高度为${availableScrollTop}，代码自动矫正`
        );
        return Math.ceil(availableScrollTop / cellHeight);
      }
      return Math.ceil(scrollTop / cellHeight);
    },
    showDatas() {
      const { startRenderNum, endRenderNum, datas } = this;
      return datas.slice(startRenderNum, endRenderNum);
    },
    /**
     * 计算第一个撑开前置高度的容器块高度
     */
    topSpace() {
      const { oldTopIndex, cellHeight, preload } = this;
      const start = oldTopIndex - preload > 0 ? oldTopIndex - preload : 0;
      return start * cellHeight;
    }
  },

  watch: {
    currentTopIndex(val) {
      const { oldTopIndex, preload } = this;
      if (preload === 0) {
        this.sliceData();
        return;
      }
      if (oldTopIndex === val) {
        return;
      }
      // 预先多加载几个，避免过多的触发sliceData，
      const errorValue = 1; // 为误差值，
      if (
        val < oldTopIndex - (preload - errorValue) ||
        val > oldTopIndex + (preload - errorValue)
      ) {
        this.oldTopIndex = val;
        this.sliceData();
      }
    },
    datas() {
      this.sliceData();
    },
    heightOfBlocksWrapper() {
      this.sliceData();
    },
    cellHeight() {
      this.sliceData();
    },
    preload() {
      this.sliceData();
    }
  },

  created() {
    this.sliceData();
  },

  methods: {
    /**
     * 分割出dom中需要显示的数据
     */
    sliceData() {
      const {
        heightOfBlocksWrapper,
        currentTopIndex,
        cellHeight,
        preload,
        datas
      } = this;
      //没有高度，不需要渲染元素
      if (heightOfBlocksWrapper === 0 || cellHeight === 0) {
        this.endRenderNum = 0;
        this.startRenderNum = 0;
        return;
      }

      // 为 0 全部渲染
      if (preload === 0) {
        this.endRenderNum = datas.length;
        this.startRenderNum = 0;
        return;
      }

      const endRenderNum =
        currentTopIndex +
        Math.ceil(heightOfBlocksWrapper / cellHeight) +
        preload;
      this.endRenderNum =
        endRenderNum > datas.length ? datas.length : endRenderNum;

      this.startRenderNum =
        currentTopIndex - preload > 0 ? currentTopIndex - preload : 0;
    }
  }
};

export default dynamicRender;
