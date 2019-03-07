<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-leftbar-item gantt-cell-height"
         v-for="(data,index) in showDatas"
         :key="dataKey?data[dataKey]:index">
      <slot :data="data"></slot>
    </div>
  </div>
</template>
  
<script>
import dr from '../dynamic-render.js'
export default {
  name: "LeftBar",
  mixins:[dr],
  props:{
    dataKey:String,
    datas: {
      type: Array,
      required: true
    }
  }
};
</script>