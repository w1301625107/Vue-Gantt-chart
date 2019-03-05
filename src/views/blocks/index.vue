<template>
  <div class="gantt-blocks"
       :style="{height:blockHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block gantt-cell-height"
         v-for="(data,index) in showDatas"
         :key="index">
      <div class="gantt-block-item"
           v-for="(item,index) in data.Planned"
           :key="index"
           :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}">
        <slot :data="data"
              :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import dr from "../dynamic-render.js";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Blocks",
  mixins: [dr],
  props: {
    startBlockTime: {
      type: moment,
      required: true
    },
    cellWidth: {
      type: Number,
      required: true
    },
    scale: {
      type: Number,
      required: true
    }
  },
  created() {},
  computed: {
    startBlockTimeFormat() {
      return this.startBlockTime.format("YYYY-MM-DD HH:mm:ss");
    }
  },
  methods: {
    //计算时间块长度
    getBlockwidth(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return calcBlockwidth(block.start, block.end, options);
    },
    //计算时间块偏移
    getBlockMargin(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth,
        startBlockTime: this.startBlockTimeFormat
      };

      return calcBlockMargin(block.start, options);
    }
  }
};
</script>