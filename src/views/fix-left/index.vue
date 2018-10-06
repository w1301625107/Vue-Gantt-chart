<template>
  <div class="gantt-fixleft"
       :style="{width:descWidth+'px'}">
    <div class="gantt-fixleft-header"
         :style="{height:descHeight+'px'}"></div>
    <div class="gantt-fixleft-items"
         :style="{top:descHeight+'px'}">
      <div class="gantt-fixleft-item"
           v-for="(item,index) in datas"
           :key="item.id">
        <div class="gantt-fixleft-name gantt-cell-height"
             :style="{width:descWidth/2+'px'}">{{index}}.{{item.name}}</div>
        <div class="gantt-fixleft-series"
             :style="{width:descWidth/2+'px'}">
          <div v-if="showPlan"
               class="gantt-fixleft-series-plan gantt-cell-height">Planned</div>
          <div v-if="showProject"
               class="gantt-fixleft-series-project gantt-cell-height">Projected</div>
          <div v-if="showActual"
               class="gantt-fixleft-series-actual gantt-cell-height">Actual</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "fixLeft",
  props: {
    descHeight: {
      type: Number,
      required: true
    },
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
