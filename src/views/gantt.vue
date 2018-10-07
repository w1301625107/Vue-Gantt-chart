<template>
  <div class="gantt">
    <div class="gantt-chart">
      <div class="gantt-header"
           :style="{width:totalWidth+'px'}">
        <timeline :style="{'margin-left':descWidth+'px'}"></timeline>
      </div>
      <div @scroll="syncScroll"
           class="gantt-body"
           :style="{width:totalWidth+'px','padding-top':descHeight+'px'}">
        <gt-table></gt-table>
        <mark-line color="red"></mark-line>
      </div>

    </div>
    <div class="gantt-fixleft"
         :style="{width:descWidth+'px'}">
      <div class="gantt-lefthearder"
           :style="{'line-height':descHeight+'px',height:descHeight+'px'}">
        Hello GanttChart</div>
      <LeftBar></LeftBar>
    </div>
    <!-- <fix-left ></fix-left> -->
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/time-line/index.vue";
import LeftBar from "@views/left-bar/index.vue";
import GtTable from "@views/gt-table/index.vue";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, LeftBar, GtTable, MarkLine },
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
        .add(2, "d")
        .add(2, "h")
        .add(5, "s"),
      cellWidth: 50,
      cellHeight: 20,
      descHeight: 40,
      descWidth: 200,
      scale: 60,
      forbidden: [
        // {
        //   start: moment()
        //     .add(5, "h")
        //     .add(10, "m"),
        //   end: moment()
        //     .add(9, "h")
        //     .add(29, "m")
        // },
        // {
        //   start: moment()
        //     .add(11, "h")
        //     .add(10, "m"),
        //   end: moment()
        //     .add(16, "h")
        //     .add(29, "m")
        // }
      ],
      //可用缩放尺度
      scaleList: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
      datas
    };
  },
  computed: {
    createCss() {
      let { descHeight } = this;
      this.resetCss();
    },
    correctScale() {
      let val = 60;
      if (-1 != this.scaleList.indexOf(this.scale)) {
        val = this.scale;
      }
      return val;
    },
    totalWidth() {
      let { descWidth, cellWidth, totalBlocks } = this;
      return descWidth + cellWidth * totalBlocks;
    },
    totalBlocks() {
      let { start, end, scale } = this;
      let hoursToBlock = ((end.diff(start, "h") - 1) * 60) / scale;
      let startToBlock = 60 / scale - Math.floor(start.minutes() / scale);
      let endToBlock = Math.ceil(end.minutes() / scale);
      return hoursToBlock + endToBlock + startToBlock;
    },
    //获取开始时间块的时间
    startBlockTime() {
      let { start, end, scale } = this;
      let startBlock = Math.floor(start.minutes() / scale);
      let startClone = start.clone();
      startClone.minutes(startBlock * scale).seconds(0);
      return startClone;
    }
  },
  created() {
    console.log(this.$store);
  },
  mounted() {
    this.resize();
    window.onresize = () => this.resize();
    this.resetCss();
  },
  methods: {
    //同步fixleft和block的滚动
    syncScroll(event) {
      this.$nextTick(() => {
        document.querySelector(".gantt-leftbar").scrollTop =
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
      document.querySelector(".gantt-leftbar").style.height =
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
