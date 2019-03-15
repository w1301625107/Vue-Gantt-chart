let dynamicRender = {
  props: {
    scrollTop: {
      type: Number,
      required: true
    },
    containerHeight:{
      type: Number,
      required: true
    },
    containerWidth:{
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
      // containerHeight: 960,
      //两者避免过多的调用sliceData，造成过多的dom操作
      //上一次加载的节点
      oldCurrentIndex: 0,
      //预加载的数量,是前后都为2个
      preload: 1
    };
  },
  computed: {
    blockHeight() {
      let { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    //计算当前第一个数据的index
    currentIndex() {
      return Math.ceil(this.scrollTop / this.cellHeight);
    }
  },
  watch: {
    currentIndex(val) {
      let { oldCurrentIndex, preload } = this;
      if (val < oldCurrentIndex - preload || val > oldCurrentIndex + preload) {
        this.oldCurrentIndex = val;
        this.spliceData();
      }
    },
    containerHeight(){
      this.spliceData()
    }
  },
  created() {
    this.spliceData();
  },
  methods: {
    //分割出dom中显示的数据
    spliceData() {
      let { containerHeight, currentIndex, cellHeight, preload } = this;
      if(containerHeight === 0) {
        return []
      }
      let nums = currentIndex + Math.ceil(containerHeight / cellHeight);
      let start = currentIndex - preload >= 0 ? currentIndex - preload : 0;
      this.showDatas = this.datas.slice(start, nums + preload);
    },
    //第一个撑开前置高度的容器块高度
    calTopSpace() {
      let { oldCurrentIndex, cellHeight, preload } = this;
      let start =
        oldCurrentIndex - preload >= 0 ? oldCurrentIndex - preload : 0;
      return start * cellHeight;
    },
  }
};

export default dynamicRender;
