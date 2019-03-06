<template>
  <div class="gantt-leftbar">
    <div class="gantt-leftbar-item gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-leftbar-item gantt-cell-height"
         v-for="(item,index) in showDatas"
         :key="index">
      <slot  :item="item"></slot>
    </div>
  </div>
</template>
  
<script>
import dr from '../dynamic-render.js'
export default {
  name: "LeftBar",
  mixins:[dr],
  props:{
    datas: {
      type: Array,
      required: true
    }
  }
};
</script>