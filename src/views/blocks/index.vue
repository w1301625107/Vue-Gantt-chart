<template>
  <div class="gantt-blocks"
       :style="{height:blockHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block gantt-cell-height"
         v-for="(data,index) in showDatas"
         :key="index">
      <div class="gantt-block-item"
           v-for="(item,index) in data.Planned"
           :key="index"
           :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}">
        <div class="plan"
             @click="blockClick(item)">{{data.name}}{{item.start.format("HH:mm:ss")}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "@src/utils/debounce.js";
import {
  getStartBlocksTime,
  countTimeBlockWithScale
} from "@src/utils/timeblock.js";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Blocks",
  props: {
    scrollTop: Number,
    start: {
      type: Object,
      required: true
    },
    cellWidth: {
      type: Number,
      default: 50
    },
    cellHeight: {
      type: Number,
      default: 20
    },
    scale: {
      type: Number,
      default: 60
    },
    datas: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      showDatas: [],
      containerHeight: 700,
      //去抖
      initHeight_: "",
      //两者避免过多的调用sliceData，造成过多的dom操作
      //上一次加载的节点
      oldCurrentIndex: 0,
      //预加载的数量,是前后都为8个
      preload: 4
    };
  },
  computed: {
    startBlockTime() {
      let value = getStartBlocksTime(this.start);

      return value;
    },
    // ...mapGetters(["startBlockTime", ]),
    blockHeight() {
      let { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
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
    }
  },
  created() {
    this.spliceData();
    //去抖
    this.initHeight_ = debounce(this.getContainerHeight);
  },
  mounted() {
    this.initHeight_();
    window.onresize = () => {
      this.initHeight_();
    };
  },
  methods: {
    //获取父级容器的高度
    getContainerHeight() {
      this.containerHeight = document.querySelector(
        ".gantt-table"
      ).parentNode.clientHeight;
    },
    //分割出dom中显示的数据
    spliceData() {
      let { containerHeight, currentIndex, cellHeight, preload } = this;
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
    //计算时间块长度
    getBlockwidth(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return calcBlockwidth(block, options);
    },
    //计算时间块偏移
    getBlockMargin(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth,
        startBlockTime: this.startBlockTime
      };
      return calcBlockMargin(block, options);
    },
    blockClick(item) {
      // this.$store.commit(updateMarkLineTime, item.start);
      // this.$store.commit(updateMarkLineTimeEnd, item.end);
    }
  }
};
</script>