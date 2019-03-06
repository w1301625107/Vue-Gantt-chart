<template>
  <div class="gantt-chart"
       @wheel="wheelHandle">
    <div class="gantt-header">
      <div class="gantt-header-title"
           :style="{'line-height':descHeight+'px',height:descHeight+'px','max-width':descWidth+'px','min-width':descWidth+'px'}">
        <slot name="title"></slot>
      </div>
      <div class="gantt-header-timeline">
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :descHeight="descHeight"
                  :scale="scale"
                  :style="{width:totalWidth+'px'}">
        </timeline>
      </div>
    </div>
    <div class="gantt-body"
         :style="{height:'calc(100% - '+descHeight+'px'+')'}">
      <div class="gantt-table">
        <div class="gantt-markline-area">
          <CurrentTime :getTimeLineMargin="getTimeLineMargin" />
          <!--<mark-line :markLineTime="markLineTimeEnd"
                     color="#0ca30a"></mark-line> -->
        </div>
        <div class="gantt-leftbar-wrapper"
             :style="{'max-width':descWidth+'px','min-width':descWidth+'px'}">
          <LeftBar :datas="datas"
                   :scrollTop="scrollTop"
                   :cellHeight="cellHeight"
                   :style="{height:totalHeight+'px'}">
            <template v-slot="{item}">
              <slot name="left"
                    :item="item"></slot>
            </template>
          </LeftBar>
        </div>
        <div class="gantt-blocks-wrapper">
          <blocks :scrollTop="scrollTop"
                  :datas="datas"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :scale="scale"
                  :startBlockTime="startBlockTime"
                  :style="{width:totalWidth+'px'}">
            <template v-slot="{data,item}">
              <slot name="block"
                    :data="data"
                    :item="item"></slot>
            </template>
          </blocks>
        </div>
      </div>
      <div class="gantt-scroll-y"
           :style="{height:'calc(100% - 17px)'}"
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
</template>

<script>
import moment from "moment";
import {
  scaleList,
  getStartBlocksTime,
  countTimeBlockWithScale
} from "@src/utils/timeblock.js";
import { calcBlockMargin } from "@src/utils/calc-margin.js";
import Timeline from "@views/time-line/index.vue";
import CurrentTime from "@views/mark-line/current-time.vue";
import LeftBar from "@views/left-bar/index.vue";
import Blocks from "@views/blocks/index.vue";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, LeftBar, Blocks, MarkLine, CurrentTime },
  props: {
    startTime: {
      required: true,
      validator(date) {
        return moment(date).isValid();
      }
    },
    endTime: {
      required: true,
      validator(date) {
        return moment(date).isValid();
      }
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
      default: 60,
      validator(value) {
        return scaleList.includes(value);
      }
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
        gantt_timeline: {},
        gantt_scroll_x: {},
        gantt_markArea: {}
      },
      scrollTop: 0
    };
  },
  computed: {
    start() {
      return moment(this.startTime);
    },
    end() {
      return moment(this.endTime);
    },
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
      let value = getStartBlocksTime(this.start,this.scale);
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
  },
  updated() {
    // this.getSelector();
  },
  methods: {
    getTimeLineMargin(date) {
      let { cellWidth, scale, startBlockTime, descWidth } = this;
      let options = {
        cellWidth,
        scale
      };

      return (
        calcBlockMargin(
          date,
          startBlockTime.format("YYYY-MM-DD HH:mm:ss"),
          options
        ) + descWidth
      );
    },
    //缓存节点
    getSelector() {
      this.selector.gantt_leftbar = document.querySelector(
        ".gantt-leftbar-wrapper"
      );
      this.selector.gantt_table = document.querySelector(
        ".gantt-blocks-wrapper"
      );
      this.selector.gantt_scroll_y = document.querySelector(".gantt-scroll-y");
      this.selector.gantt_timeline = document.querySelector(
        ".gantt-header-timeline"
      );
      this.selector.gantt_scroll_x = document.querySelector(".gantt-scroll-x");
      this.selector.gantt_markArea = document.querySelector(
        ".gantt-markline-area"
      );
    },
    wheelHandle(event) {
      let { deltaX, deltaY, deltaZ } = event;
      let {
        gantt_leftbar,
        gantt_table,
        gantt_scroll_y,
        gantt_timeline,
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
          gantt_timeline.scrollLeft += deltaX;
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
      let { gantt_table, gantt_timeline, gantt_markArea } = this.selector;
      this.$nextTick(() => {
        gantt_table.scrollLeft = event.target.scrollLeft;
        gantt_timeline.scrollLeft = event.target.scrollLeft;
        gantt_markArea.style.left = "-" + event.target.scrollLeft + "px";
      });
    },
    //修改gantt-cell-height和gantt-cell-height样式数值
    resetCss() {
      let style = document.getElementById("gantt-cell-style");
      let { cellWidth, cellHeight, totalWidth } = this;
      let innerText = `.gantt-cell-width{width:${cellWidth}px;}
        .gantt-cell-height{height:${cellHeight}px;}
        .gantt-block{background-size: ${cellWidth}px ${cellHeight}px;`;
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

<style>
@import "scss/gantt.scss";
</style>
