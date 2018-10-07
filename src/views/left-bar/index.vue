<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item"
         v-for="(item,index) in datas"
         :key="item.id">
      <div class="gantt-leftbar-name gantt-cell-height"
           :style="{width:descWidth/2+'px'}">{{index}}.{{item.name}}</div>
      <div class="gantt-leftbar-series"
           :style="{width:descWidth/2+'px'}">
        <div v-if="showPlan"
             class="gantt-leftbar-series-plan gantt-cell-height">Planned</div>
        <div v-if="showProject"
             class="gantt-leftbar-series-project gantt-cell-height">Projected</div>
        <div v-if="showActual"
             class="gantt-leftbar-series-actual gantt-cell-height">Actual</div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { mapState } from "vuex";
export default {
  name: "LeftBar",
  computed: {
    ...mapState(["datas", "descWidth", "showPlan", "showActual", "showProject"])
  }
};
</script>

<style>
</style>
