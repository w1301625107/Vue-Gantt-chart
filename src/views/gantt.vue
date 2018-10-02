<template>
  <div class="gantt">
    <div class="gantt-chart"
         :style="{}">
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
      <div class="gantt-body"
           :style="{width:totalWidth+'px','padding-top':cellHeight*2+'px'}">
        <!-- <item-header :datas="datas"
                     :style="{'width':descWidth+'px'}"></item-header> -->
        <!-- <div class="gantt-grid">
        </div> -->
        <!-- <div class="gantt-blocks"></div> -->
        <blocks :cellWidth="cellWidth"
                :cellHeight="cellHeight"
                :datas="datas"
                :scale="scale"
                :totalBlocks="totalBlocks"
                :forbidden="forbidden"
                :startBlockTime="startBlockTime"
                :showProject="showProject"
                :showPlan="showPlan"
                :showActual="showActual"></blocks>

      </div>

    </div>
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/timeline/index.vue";
import ItemHeader from "@views/itemheader/index.vue";
import Blocks from "@views/blocks/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, ItemHeader, Blocks },
  data() {
    return {
      showProject: true,
      showPlan: true,
      showActual: true,
      start: moment(),
      end: moment()
        .add(4, "d")
        .add(2, "h")
        .add(5, "s"),
      cellWidth: 20,
      cellHeight: 10,
      headerHeight: 20,
      descWidth: 200,
      scale: 2,
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
  mounted() {}
};
</script>

<style>
</style>
