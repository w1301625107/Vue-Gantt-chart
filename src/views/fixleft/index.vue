<template>
  <div class="gantt-fixleft">
    <div class="gantt-fixleft-header"
         :style="{height:cellHeight*2+'px'}"></div>
    <div class="gantt-fixleft-items"
         :style="{top:cellHeight*2+'px','padding-bottom':cellHeight*2+'px'}">
      <div class="gantt-fixleft-item"
           v-for="(item,index) in datas"
           :key="item.id">
        <div class="gantt-fixleft-name"
             :style="{height:cellHeight+'px'}">{{index}}.{{item.name}}</div>
        <div class="gantt-fixleft-series"
             v-if="showPlan">
          <div class="gantt-fixleft-series-plan"
               v-if="showProject"
               :style="{height:cellHeight+'px'}">Planned</div>
          <div class="gantt-fixleft-series-project"
               :style="{height:cellHeight+'px'}">Projected</div>
          <div class="gantt-fixleft-series-actual"
               v-if="showActual"
               :style="{height:cellHeight+'px'}">Actual</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "fixLeft",
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
    }
  }
};
</script>

<style>
</style>
