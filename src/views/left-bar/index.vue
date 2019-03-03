<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item"
         v-for="(item,index) in datas"
         :key="item.id">
      <div class="gantt-leftbar-name gantt-cell-height"
           :style="{width:descWidth/2+'px'}">{{index}}.{{item.name}}</div>
      <div class="gantt-leftbar-series"
           :style="{width:descWidth/2+'px'}">
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: "LeftBar",
  props:{
    descWidth: {
      type: Number,
      default: 200
    },
    datas: {
      type: Array,
      required: true
    }
  }
};
</script>