<template>
  <div class="gantt-chart"
       @wheel="wheelHandle">
    <div class="gantt-header">
      <div class="gantt-header-title"
           :style="{'line-height':titleHeight+'px',height:titleHeight+'px','max-width':titleWidth+'px','min-width':titleWidth+'px'}">
        <slot name="title"></slot>
      </div>
      <div class="gantt-header-timeline">
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :titleHeight="titleHeight"
                  :scale="scale"
                  :style="{width:totalWidth+'px'}">
        </timeline>
      </div>
    </div>
    <div class="gantt-body"
         :style="{height:'calc(100% - '+titleHeight+'px'+')'}">
      <div class="gantt-table">
        <div class="gantt-markline-area">
          <CurrentTime v-if="showCurrentTime"
                       :getTimeLinePosition="getTimeLinePosition" />
          <mark-line v-for="(times,index) in timeLines"
                     :key="index"
                     :markLineTime="times.time"
                     :getTimeLinePosition="getTimeLinePosition"
                     :color="times.color"></mark-line>
        </div>
        <div class="gantt-leftbar-wrapper"
             :style="{'max-width':titleWidth+'px','min-width':titleWidth+'px'}">
          <LeftBar :datas="datas"
                   :dataKey="dataKey"
                   :scrollTop="scrollTop"
                   :cellHeight="cellHeight"
                   :style="{height:totalHeight+'px'}">
            <template v-slot="{data}">
              <slot name="left"
                    :data="data"></slot>
            </template>
          </LeftBar>
        </div>
        <div class="gantt-blocks-wrapper">
          <blocks :scrollTop="scrollTop"
                  :scrollLeft="scrollLeft"
                  :dataKey="dataKey"
                  :datas="datas"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :scale="scale"
                  :beginTimeOfTimeLine="beginTimeOfTimeLine"
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
           @scroll="syncScrollY">
        <div :style="{height:totalHeight+'px'}"></div>
      </div>
      <div class="gantt-scroll-x"
           @scroll="syncScrollX">
        <div :style="{width:totalWidth+'px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  scaleList,
  getBeginTimeOfTimeLine,
  calcScalesAbout2Times
} from "./utils/timeLineUtils.js";
import { getPositonOffset } from "./utils/gtUtils.js";
import Timeline from "./components/time-line/index.vue";
import CurrentTime from "./components/mark-line/current-time.vue";
import LeftBar from "./components/left-bar/index.vue";
import Blocks from "./components/blocks/index.vue";
import MarkLine from "./components/mark-line/index.vue";
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
    titleHeight: {
      type: Number,
      default: 40
    },
    titleWidth: {
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
    },
    dataKey: {
      type: String,
      default: undefined
    },
    itemKey: {
      type: String,
      default: undefined
    },
    showCurrentTime: {
      type: Boolean,
      default: false
    },
    timeLines: {
      type: Array
    },
    scrollToTime: {
      validator(date) {
        return moment(date).isValid();
      }
    },
    scrollToPostion: {
      validator(obj) {
        if (!obj.x && !obj.y) {
          console.warn("scrollToPostion 最少需要一个x或者y值");
          return false;
        }
        let validX = obj.x ? !Number.isNaN(obj.x) : true;
        let validY = obj.y ? !Number.isNaN(obj.y) : true;
        return validX && validY;
      }
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
      scrollTop: 0,
      scrollLeft: 0
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
      let { titleWidth, cellWidth, totalScales } = this;
      return titleWidth + cellWidth * totalScales;
    },
    //计算时间块的数量
    totalScales() {
      let { start, end, scale } = this;
      return calcScalesAbout2Times(start, end, scale);
    },
    totalHeight() {
      let { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    beginTimeOfTimeLine() {
      let value = getBeginTimeOfTimeLine(this.start, this.scale);
      return value;
    }
  },
  watch: {
    cellWidth() {
      this.resetCss();
    },
    cellHeight() {
      this.resetCss();
    },
    // TODO: 需优化？ 这样子会调用syncScrollX 2次，第一次是我们伪造的event，第二次是他自己触发的
    scrollToTime: {
      handler(newV) {
        if (!newV) {
          return;
        }
        let { start, end, beginTimeOfTimeLine, scale, cellWidth } = this;
        let time = moment(newV);
        if (!(time.isAfter(start) && time.isBefore(end))) {
          console.warn(`当前滚动至${newV}不在${start}和${end}的范围之内`);
          return;
        }

        let options = {
          cellWidth,
          scale
        };

        let offset = getPositonOffset(
          newV,
          beginTimeOfTimeLine.toString(),
          options
        );
        // immediate 会造成dom 还没有挂载时就进行操作，故需要延迟执行
        this.$nextTick(() =>
          this.syncScrollX(
            {
              target: {
                scrollLeft: offset
              }
            },
            true
          )
        );
      },
      immediate: true
    },
    scrollToPostion: {
      handler(newV) {
        if(!newV){
          return;
        }
        let x = Number.isNaN(newV.x) ? undefined : newV.x;
        let y = Number.isNaN(newV.y) ? undefined : newV.y;
        this.$nextTick(() => {
          if (x) {
            this.syncScrollX({ target: { scrollLeft: x } }, true);
          }
          if (y) {
            this.syncScrollY({ target: { scrollTop: y } }, true);
          }
        });
      },
      immediate: true
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
    getTimeLinePosition(date) {
      let { cellWidth, scale, beginTimeOfTimeLine, titleWidth } = this;
      let options = {
        cellWidth,
        scale
      };

      return (
        getPositonOffset(
          date,
          beginTimeOfTimeLine.format("YYYY-MM-DD HH:mm:ss"),
          options
        ) + titleWidth
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
          if (this.scrollLeft + deltaX < 0) {
            this.scrollLeft = 0;
          }
        }
      });
    },
    //同步fixleft和block的滚动
    syncScrollY(event, fake = false) {
      let { gantt_leftbar, gantt_table, gantt_scroll_y } = this.selector;
      let topValue = event.target.scrollTop;
      if (fake) {
        gantt_scroll_y.scrollTop = topValue;
        return;
      }
      gantt_leftbar.scrollTop = topValue;
      gantt_table.scrollTop = topValue;
      this.scrollTop = topValue;
    },
    syncScrollX(event, fake = false) {
      let {
        gantt_table,
        gantt_timeline,
        gantt_markArea,
        gantt_scroll_x
      } = this.selector;
      let leftValue = event.target.scrollLeft;
      if (fake) {
        gantt_scroll_x.scrollLeft = leftValue;
        return;
      }
      gantt_table.scrollLeft = leftValue;
      gantt_timeline.scrollLeft = leftValue;
      gantt_markArea.style.left = "-" + leftValue + "px";
      this.scrollLeft = leftValue;
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
@import "./_gantt.scss";
</style>
