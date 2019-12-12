<template>
  <div class="gantt-leftbar">
    <div
      class="gantt-leftbar-item gantt-block-top-space"
      :style="{ height: topSpace + 'px' }"
    ></div>
    <div
      class="gantt-leftbar-item"
      :style="cellHeightStyle"
      v-for="(data, index) in showDatas"
      :key="dataKey ? data[dataKey] : index"
    >
      <slot :data="data">
        <div class="gantt-leftbar-defalutItem">need slot</div>
      </slot>
    </div>
  </div>
</template>

<script>
import dr from "../dynamic-render.js";
export default {
  name: "LeftBar",
  mixins: [dr],
  props: {
    dataKey: String,
    datas: {
      type: Array,
      required: true
    }
  },
  computed: {
    cellHeightStyle() {
      return {
        height: `${this.cellHeight}px`
      };
    }
  }
};
</script>
