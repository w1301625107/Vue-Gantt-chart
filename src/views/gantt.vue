<template>
  <div class="gantt"
       @wheel="wheelHandle">
    <div class="gantt-chart">
      <div class="gantt-header">
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :descHeight="descHeight"
                  :scale="scale"
                  :style="{width:totalWidth+'px','margin-left':descWidth+'px'}"></timeline>
      </div>
      <div class="gantt-body"
           :style="{height:'calc(100% - '+descHeight+'px'+')'}">
        <div class="gantt-mark-area">
          <mark-line :markLineTime="currentTime"
                     :getTimeLineMargin="getTimeLineMargin"
                     color="rgba(255,0,0,.4)"></mark-line>
          <!--<mark-line :markLineTime="markLineTimeEnd"
                     color="#0ca30a"></mark-line> -->
        </div>
        <div class="gantt-table">
          <blocks :scrollTop="scrollTop"
                  :datas="datas"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :scale="scale"
                  :startBlockTime="startBlockTime"
                  :style="{width:totalWidth+'px','margin-left':descWidth+'px'}"></blocks>
        </div>
        <div class="gantt-scroll-y"
             :style="{height:'calc(100% - 17px - '+descHeight+'px'+')'}"
             @scroll="syncScrollY">
          <div :style="{height:totalHeight+'px'}"></div>
        </div>
        <div class="gantt-scroll-x"
             @scroll="syncScrollX">
          <!-- 这里减去边框的17px -->
          <div :style="{width:totalWidth-17+'px'}"></div>
        </div>
      </div>
    </div>
    <div class="gantt-fixleft"
         :style="{width:descWidth+'px',height:'calc(100% - 17px)'}">
      <div class="gantt-lefthearder"
           :style="{'line-height':descHeight+'px',height:descHeight+'px'}">
        Hello GanttChart</div>
      <LeftBar :datas="datas"
               :descWidth="descWidth"
               :style="{height:'calc(100% - '+descHeight+'px'+')'}"></LeftBar>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  getStartBlocksTime,
  countTimeBlockWithScale
} from "@src/utils/timeblock.js";
import { calcBlockMargin } from "@src/utils/calc-margin.js";
import Timeline from "@views/time-line/index.vue";
import LeftBar from "@views/left-bar/index.vue";
import Blocks from "@views/blocks/index.vue";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, LeftBar, Blocks, MarkLine },
  props: {
    start: {
      type: moment,
      required: true
    },
    end: {
      type: moment,
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
    descHeight: {
      type: Number,
      default: 40
    },
    descWidth: {
      type: Number,
      default: 200
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
      //缓存节点
      selector: {
        gantt_leftbar: {},
        gantt_table: {},
        gantt_scroll_y: {},
        gantt_body: {},
        gantt_header: {},
        gantt_scroll_x: {},
        gantt_markArea: {}
      },
      scrollTop: 0,
      currentTime: moment()
    };
  },
  computed: {
    totalWidth() {
      let { descWidth, cellWidth, totalBlocks } = this;
      return descWidth + cellWidth * totalBlocks;
    },
    //计算时间块的数量
    totalBlocks() {
      let { start, end, scale } = this;
      return countTimeBlockWithScale(start, end, scale);
    },
    totalHeight() {
      let { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    startBlockTime() {
      let value = getStartBlocksTime(this.start);
      return value;
    }
  },
  watch: {
    cellWidth() {
      this.resetCss();
    },
    cellHeight() {
      this.resetCss();
    }
  },
  created() {},
  mounted() {
    this.resetCss();
    this.getSelector();
    const timeNow = setInterval(() => {
      this.currentTime = moment();
    }, 1000);
    this.$once("hook:beforeDestroy", timeNow => {
      clearInterval(timeNow);
    });
  },
  updated() {
    this.getSelector();
  },
  methods: {
    getTimeLineMargin(date) {
      let { cellWidth, scale, startBlockTime, descWidth } = this;
      let options = {
        cellWidth,
        scale,
        startBlockTime
      };

      return descWidth + calcBlockMargin(date, options);
    },
    //缓存节点
    getSelector() {
      this.selector.gantt_leftbar = document.querySelector(".gantt-leftbar");
      this.selector.gantt_table = document.querySelector(".gantt-table");
      this.selector.gantt_scroll_y = document.querySelector(".gantt-scroll-y");
      this.selector.gantt_body = document.querySelector(".gantt-body");
      this.selector.gantt_header = document.querySelector(".gantt-header");
      this.selector.gantt_scroll_x = document.querySelector(".gantt-scroll-x");
      this.selector.gantt_markArea = document.querySelector(".gantt-mark-area");
    },
    wheelHandle(event) {
      let { deltaX, deltaY, deltaZ } = event;
      let {
        gantt_leftbar,
        gantt_table,
        gantt_scroll_y,
        gantt_body,
        gantt_header,
        gantt_scroll_x,
        gantt_markArea
      } = this.selector;
      this.$nextTick(() => {
        if (deltaY != 0) {
          gantt_leftbar.scrollTop += deltaY;
          gantt_table.scrollTop += deltaY;
          gantt_scroll_y.scrollTop += deltaY;
          this.scrollTop = gantt_table.scrollTop;
        }
        if (deltaX != 0) {
          gantt_body.scrollLeft += deltaX;
          gantt_header.scrollLeft += deltaX;
          gantt_scroll_x.scrollLeft += deltaX;
          gantt_markArea.style.left = gantt_markArea.style.left + deltaX;
        }
      });
    },
    //同步fixleft和block的滚动
    syncScrollY(event) {
      let { gantt_leftbar, gantt_table } = this.selector;
      this.$nextTick(() => {
        gantt_leftbar.scrollTop = event.target.scrollTop;
        gantt_table.scrollTop = event.target.scrollTop;
        this.scrollTop = event.target.scrollTop;
      });
    },
    syncScrollX(event) {
      let { gantt_table, gantt_header, gantt_markArea } = this.selector;
      this.$nextTick(() => {
        gantt_table.scrollLeft = event.target.scrollLeft;
        gantt_header.scrollLeft = event.target.scrollLeft;
        gantt_markArea.style.left = "-" + event.target.scrollLeft + "px";
      });
    },
    //修改gantt-cell-height和gantt-cell-height样式数值
    resetCss() {
      let style = document.getElementById("gantt-cell-style");
      let { cellWidth, cellHeight, showTimeBlock, totalWidth } = this;
      let innerText = `.gantt-cell-width{width:${cellWidth}px;}
        .gantt-cell-height{height:${cellHeight}px;}
        .gantt-block{background-size: ${cellWidth}px ${cellHeight}px;width:${totalWidth}px}`;
      if (null == style) {
        let style = document.createElement("style");
        style.setAttribute("id", "gantt-cell-style");
        style.setAttribute("type", "text/css");
        style.innerText = innerText;
        document.head.appendChild(style);
      } else {
        style.innerText = innerText;
      }
    }
  }
};
</script>