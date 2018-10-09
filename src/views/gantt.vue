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
        <gt-table :style="{width:totalWidth+'px','margin-left':descWidth+'px'}"></gt-table>
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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Timeline from "@views/time-line/index.vue";
import LeftBar from "@views/left-bar/index.vue";
import GtTable from "@views/gt-table/index.vue";
import MarkLine from "@views/mark-line/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, LeftBar, GtTable, MarkLine },
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "descWidth",
      "descHeight",
      "cellWidth",
      "scale",
      "cellHeight"
    ]),
    ...mapGetters(["startBlockTime", "totalBlocks", "totalWidth"])
  },
  watch: {
    descHeight() {
      this.resize();
    },
    cellWidth() {
      this.resetCss();
    },
    cellHeight() {
      this.resetCss();
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
        style.innerText = `.gantt-cell-width{width:${cellWidth}px;}.gantt-cell-height{height:${cellHeight}px;}.gantt-table{    background-size: ${cellWidth}px ${cellHeight}px;`;
        document.head.appendChild(style);
      } else {
        style.innerText = `.gantt-cell-width{width:${cellWidth}px;}.gantt-cell-height{height:${cellHeight}px;}.gantt-table{    background-size: ${cellWidth}px ${cellHeight}px;`;
      }
    }
  }
};
</script>

<style>
</style>
