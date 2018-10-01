<template>
  <div class="gantt">
    <div class="gantt-chart"
         :style="{}">
      <div class="gantt-header"
           :style="{height:headerHeight*2+'px',width:totalWidth+'px'}">
        <div class="gantt-desc"
             :style="{'min-width':descWidth+'px'}"></div>
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :scale="scale"></timeline>

      </div>
      <div class="gantt-body"
           :style="{width:totalWidth+'px'}">
        <item-header :datas="datas"
                     :style="{'width':descWidth+'px'}"></item-header>
        <div class="gantt-grid">
          <!-- <div :style="{width:3080+'px'}"></div> -->
        </div>
        <div class="gantt-block"></div>

      </div>

    </div>
  </div>
</template>

<script>
import { datas } from "@src/mock/index";
import moment from "moment";
import Timeline from "@views/timeline/index.vue";
import ItemHeader from "@views/itemheader/index.vue";
export default {
  name: "Gantt",
  components: { Timeline, ItemHeader },
  data() {
    return {
      start: moment(),
      end: moment()
        .add(6, "d")
        .add(1, "s"),
      cellWidth: 50,
      cellHeight: 20,
      headerHeight: 20,
      descWidth: 200,
      scale: 2,
      datas
    };
  },
  computed: {
    totalWidth() {
      let timelineWidth =
        Math.ceil((this.end.diff(this.start, "h") + 1) / this.scale) *
        this.cellWidth;
      return this.descWidth + timelineWidth;
    }
  },
  created() {
    console.log(datas);
    console.log(
      "moment({ hour:15, minute:10 }):",
      moment({ hour: 15, minute: 10 })
    );
  },
  mounted() {}
};
</script>

<style>
</style>
