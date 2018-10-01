<template>
  <div class="gantt-itemHeader">
    <div class="gantt-itemHeader-items">
      <div class="gantt-itemHeader-item"
           v-for="item in datas"
           :key="item.id">
        <div class="gantt-itemHeader-name"
             :style="{height:cellHeight+'px'}">{{item.name}}</div>
        <div class="gantt-itemHeader-series"
             v-if="showPlan">
          <div class="gantt-itemHeader-series-plan"
               v-if="showProject"
               :style="{height:cellHeight+'px'}">Planned</div>
          <div class="gantt-itemHeader-series-project"
               :style="{height:cellHeight+'px'}">Projected</div>
          <div class="gantt-itemHeader-series-actual"
               v-if="showActual"
               :style="{height:cellHeight+'px'}">Actual</div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "ItemHeader",
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
