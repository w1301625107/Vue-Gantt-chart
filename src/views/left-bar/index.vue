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
export default {
  name: "LeftBar",
  props: {
    cellHeight: {
      type: Number,
      default: 20
    },
    showPlan: {
      type: Boolean,
      default: true
    },
    showProject: {
      type: Boolean,
      default: true
    },
    showActual: {
      type: Boolean,
      default: true
    },
    datas: {
      type: Array,
      required: true
    },
    descWidth: {
      type: Number
    }
  }
};
</script>

<style>
</style>
