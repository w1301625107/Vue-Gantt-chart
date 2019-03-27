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
      showDatas: [],
      //上一次加载的节点
      oldCurrentIndex: 0,
      //预加载的数量,是前后都为2个
      preload: 1 // 为 0 时加载全部行
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
    //计算当前第一个数据的index
    currentIndex() {
      return Math.ceil(this.scrollTop / this.cellHeight);
    }
  },

  watch: {
    currentIndex(val) {
      let {
        oldCurrentIndex,
        preload
      } = this;
      if (preload === 0) {
        this.spliceData();
        return
      }
      if (oldCurrentIndex === val) {
        return
      }
      // 预先多加载几个，避免过多的触发spliceData， 
      let errorValue = 1 // 为误差值，
      if (val < oldCurrentIndex - (preload - errorValue) || val >
        oldCurrentIndex + (preload - errorValue)) {
        this.oldCurrentIndex = val;
        this.spliceData();
      }
    },
    datas() {
      this.spliceData()
    },
    heightOfRenderAera() {
      this.spliceData()
    },
    cellHeight() {
      this.spliceData()
    }
  },

  created() {
    this.spliceData();
  },

  methods: {
    /**
     * 分割出dom中显示的数据
     */
    spliceData() {
      let {
        heightOfRenderAera,
        currentIndex,
        cellHeight,
        preload
      } = this;
      //没有高度，不需要渲染元素
      if (heightOfRenderAera === 0 || cellHeight === 0) {
        return []
      }

      if (preload === 0) {
        this.showDatas = this.datas
        return
      }

      let end = currentIndex + Math.ceil(heightOfRenderAera / cellHeight) +
        preload;
      let start = currentIndex - preload > 0 ? currentIndex - preload : 0;
      this.showDatas = this.datas.slice(start, end);
    },
    //
    /**
     * 计算第一个撑开前置高度的容器块高度
     */
    calTopSpace() {
      let {
        oldCurrentIndex,
        cellHeight,
        preload
      } = this;
      let start =
        oldCurrentIndex - preload > 0 ? oldCurrentIndex - preload : 0;
      return start * cellHeight;
    },
  }
};

export default dynamicRender;