<template>
  <div class="gantt">
    <div class="gantt-chart">
      <div class="gantt-header"
           :style="{width:totalWidth+'px'}">
        <div class="gantt-desc"
             :style="{'min-width':descWidth+'px'}"></div>
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :startBlockTime="startBlockTime"
                  :scale="correctScale"
                  :forbidden="forbidden"></timeline>

      </div>
      <div @scroll="handleChartScroll"
           class="gantt-body"
           :style="{width:totalWidth+'px','padding-top':cellHeight*2+'px'}">
        <blocks :cellWidth="cellWidth"
                :cellHeight="cellHeight"
                :datas="datas"
                :scale="correctScale"
                :totalBlocks="totalBlocks"
                :forbidden="forbidden"
                :startBlockTime="startBlockTime"
                :showProject="showProject"
                :showPlan="showPlan"
                :showActual="showActual"
                :showTimeBlock="showTimeBlock"></blocks>
        <mark-line :cellWidth="cellWidth"
                   :scale="correctScale"
                   :startBlockTime="startBlockTime"
                   :time="time"
                   color="red"></mark-line>
      </div>

    </div>
    <fix-left :datas="datas"
              :cellHeight="cellHeight"
              :showProject="showProject"
              :showPlan="showPlan"
              :showActual="showActual"
              :descWidth="descWidth"
              :style="{'width':descWidth+'px'}"></fix-left>
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/time-line/index.vue";
import FixLeft from "@views/fix-left/index.vue";
import Blocks from "@views/blocks/index.vue";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, FixLeft, Blocks, MarkLine },
  data() {
    return {
      showTimeBlock: true,
      showProject: true,
      showPlan: true,
      showActual: true,
      time: moment()
        .add(6, "h")
        .add(5, "s"),
      start: moment(),
      end: moment()
        .add(1, "d")
        .add(2, "h")
        .add(5, "s"),
      cellWidth: 50,
      cellHeight: 20,
      headerHeight: 20,
      descWidth: 200,
      scale: 1,
      forbidden: [
        {
          start: moment()
            .add(5, "h")
            .add(10, "m"),
          end: moment()
            .add(9, "h")
            .add(29, "m")
        },
        {
          start: moment()
            .add(11, "h")
            .add(10, "m"),
          end: moment()
            .add(16, "h")
            .add(29, "m")
        }
      ],
      //可用缩放尺度
      scaleList: [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 24],
      datas
    };
  },
  computed: {
    createCss() {
      let { cellWidth, cellHeight } = this;
      this.resetCss();
    },
    correctScale() {
      let val = 1;
      if (-1 != this.scaleList.indexOf(this.scale)) {
        val = this.scale;
      }
      return val;
    },
    totalWidth() {
      let timelineWidth =
        Math.ceil((this.end.diff(this.start, "h") + 1) / this.scale) *
        this.cellWidth;
      return this.descWidth + timelineWidth;
    },
    totalBlocks() {
      return Math.ceil((this.end.diff(this.start, "h") + 1) / this.scale);
    },
    //获取开始时间块的时间
    startBlockTime() {
      let start = this.start.clone();
      let hours = start.hours();
      let date;

      for (let i = 0; i < 24; i += this.scale) {
        if (hours - this.scale < i) {
          date = start.hours(Math.floor(i / 1)).minutes((i % 1) * 60);
          break;
        }
      }
      return date;
    }
  },
  created() {},
  mounted() {
    this.resize();
    window.onresize = () => this.resize();
    this.resetCss();
  },
  methods: {
    //同步fixleft和block的滚动
    handleChartScroll(event) {
      this.$nextTick(() => {
        document.querySelector(".gantt-fixleft-items").scrollTop =
          event.target.scrollTop;
      });
    },
    //修正滚动区域的高度
    resize() {
      let scrollSize = 16;
      let bodyHeight = document.querySelector(".gantt").clientHeight;
      let headerHeight = document.querySelector(".gantt-header").clientHeight;
      document.querySelector(".gantt-body").style.height =
        bodyHeight - headerHeight - scrollSize + "px";
      document.querySelector(".gantt-fixleft").style.height =
        bodyHeight - scrollSize + "px";
      document.querySelector(".gantt-fixleft-items").style.height =
        bodyHeight - headerHeight - scrollSize + "px";
    },
    //修改gantt-cell-height和gantt-cell-height样式数值
    resetCss() {
      let style = document.getElementById("gantt-cell-style");
      let { cellWidth, cellHeight } = this;
      if (null == style) {
        let style = document.createElement("style");
        style.setAttribute("id", "gantt-cell-style");
        style.setAttribute("type", "text/css");
        style.innerText = `.gantt-cell-width{width:${cellWidth}px;}.gantt-cell-height{height:${cellHeight}px;}`;
        document.head.appendChild(style);
      } else {
        style.innerText = `.gantt-cell-width{width:${cellWidth}px;}.gantt-cell-height{height:${cellHeight}px;}`;
      }
    }
  }
};
</script>

<style>
</style>
