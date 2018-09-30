<template>
  <div class="gantt">
    <div class="gantt-header"
         :style="{height:headerHeight*2+'px'}">
      <div class="gantt-desc"></div>
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
      headerHeight: 20
    };
  }
};
</script>

<style>
</style>
