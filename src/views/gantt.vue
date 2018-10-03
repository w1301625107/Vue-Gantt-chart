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
                  :scale="scale"
                  :forbidden="forbidden"></timeline>

      </div>
      <div @scroll="handleChartScroll"
           class="gantt-body"
           :style="{width:totalWidth+'px','padding-top':cellHeight*2+'px'}">
        <blocks :cellWidth="cellWidth"
                :cellHeight="cellHeight"
                :datas="datas"
                :scale="scale"
                :totalBlocks="totalBlocks"
                :forbidden="forbidden"
                :startBlockTime="startBlockTime"
                :showProject="showProject"
                :showPlan="showPlan"
                :showActual="showActual"
                :showTimeBlock="showTimeBlock"></blocks>
      </div>

    </div>
    <fix-left :datas="datas"
              :cellHeight="cellHeight"
              :showProject="showProject"
              :showPlan="showPlan"
              :showActual="showActual"
              :style="{'width':descWidth+'px'}"></fix-left>
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/timeline/index.vue";
import FixLeft from "@views/fixleft/index.vue";
import Blocks from "@views/blocks/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, FixLeft, Blocks },
  data() {
    return {
      showTimeBlock: true,
      showProject: true,
      showPlan: true,
      showActual: true,
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
      datas
    };
  },
  computed: {
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
  },
  methods: {
    handleChartScroll(event) {
      this.$nextTick(() => {
        document.querySelector(".gantt-fixleft-items").scrollTop =
          event.target.scrollTop;
      });
    },
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
    }
  }
};
</script>

<style>
</style>
