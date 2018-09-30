<template>
  <div class="gantt">
    <div class="gantt-header"
         :style="{height:headerHeight*2+'px',width:headerWidth+'px'}">
      <div class="gantt-desc"
           :style="{width:descWidthWidth+'px'}"></div>
      <timeline :start="start"
                :end="end"
                :cellWidth="cellWidth"
                :cellHeight="cellHeight"></timeline>
    </div>
    <div class="gantt-grid-desc"></div>
    <div class="gantt-grid"></div>
    <div class="gantt-block"></div>
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/timeline/index.vue";
export default {
  name: "Gantt",
  components: { Timeline },
  data() {
    return {
      start: moment(),
      end: moment()
        .add(6, "d")
        .add(1, "s"),
      cellWidth: 20,
      cellHeight: 20,
      headerHeight: 20,
      descWidthWidth: 200
      //datas: ganttData
    };
  },
  computed: {
    headerWidth() {
      let timelineWidth = this.end.diff(this.start, "h") * this.cellWidth;
      return this.descWidthWidth + timelineWidth;
    }
  },
  created() {
    console.log(datas);
  },
  mounted() {
    console.log(this.end.diff(this.start, "h")), console.log();
  }
};
</script>

<style>
</style>
