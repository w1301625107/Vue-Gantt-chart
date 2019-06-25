let dynamicRender = {
  props: {
    scrollTop: {
      type: Number,
      required: true
    },
    heightOfRenderAera: {
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
    }
  },

  data() {
    return {
      //上一次加载的第一个节点
      oldTopIndex: 0,
      //预加载的数量,是前后都为2个
      preload: 1, // 为 0 时加载全部行,
      startRenderNum: 0,
      endRenderNum: 0
    };
  },

  computed: {
    blockHeight() {
      let {
        datas,
        cellHeight
      } = this;
      return datas.length * cellHeight;
    },
    //计算当前屏幕显示的第一行数据的index
    currentTopIndex() {
      return Math.ceil(this.scrollTop / this.cellHeight);
    },
    showDatas() {
      const {
        startRenderNum,
        endRenderNum,
        datas
      } = this
      return datas.slice(startRenderNum, endRenderNum);
    },
    /**
     * 计算第一个撑开前置高度的容器块高度
     */
    topSpace() {
      let {
        oldTopIndex,
        cellHeight,
        preload
      } = this;
      let start =
        oldTopIndex - preload > 0 ? oldTopIndex - preload : 0;
      return start * cellHeight;
    }
  },

  watch: {
    currentTopIndex(val) {
      let {
        oldTopIndex,
        preload
      } = this;
      if (preload === 0) {
        this.sliceData();
        return
      }
      if (oldTopIndex === val) {
        return
      }
      // 预先多加载几个，避免过多的触发spliceData， 
      let errorValue = 1 // 为误差值，
      if (val < oldTopIndex - (preload - errorValue) || val >
        oldTopIndex + (preload - errorValue)) {
        this.oldTopIndex = val;
        this.sliceData();
      }
    },
    datas() {
      this.sliceData()
    },
    heightOfRenderAera() {
      this.sliceData()
    },
    cellHeight() {
      this.sliceData()
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
      let {
        heightOfRenderAera,
        currentTopIndex,
        cellHeight,
        preload
      } = this;
      //没有高度，不需要渲染元素
      if (heightOfRenderAera === 0 || cellHeight === 0) {
        this.endRenderNum = 0
        this.startRenderNum = 0
        return
      }

      // 为 0 全部渲染
      if (preload === 0) {
        this.endRenderNum = Infinity
        this.startRenderNum = -Infinity
        return
      }

      this.endRenderNum = currentTopIndex + Math.ceil(heightOfRenderAera /
          cellHeight) +
        preload;
      this.startRenderNum = currentTopIndex - preload > 0 ? currentTopIndex -
        preload : 0;
    }
  }
};

export default dynamicRender;