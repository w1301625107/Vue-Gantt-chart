<template>
  <div class="gantt-blocks"
       :style="{height:blockHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block gantt-cell-height"
         v-for="(data,index) in showDatas"
         :key="data.id">
      <div class="gantt-block-item"
           v-for="(item,index) in data.Planned"
           v-if="isInRange(item)"
           :key="item.id"
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
    scrollLeft: Number,
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
  data() {
    return {
      startTime: null,
      endTime: null
    };
  },
  created() {
    this.getXAxisRange();
  },
  mounted() {},
  computed: {
    startBlockTimeFormat() {
      return this.startBlockTime.format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    scrollLeft() {
      this.getXAxisRange();
    }
  },
  methods: {
    getXAxisRange() {
      let {
        startBlockTime,
        scrollLeft,
        cellWidth,
        scale,
        containerWidth
      } = this;
      this.startTime = startBlockTime
        .clone()
        .add((scrollLeft / cellWidth) * scale, "m")
        .toDate()
        .getTime();
      this.endTime = startBlockTime
        .clone()
        .add(((scrollLeft + containerWidth) / cellWidth) * scale, "m")
        .toDate()
        .getTime();
    },
    isInRange(item) {
      let { startTime, endTime } = this;
      let startToMs = new Date(item.start).getTime();
      let endToMs = new Date(item.end).getTime();
      if (
        (startTime <= startToMs && startToMs <= endTime) ||
        (startTime <= endToMs && endToMs <= endTime)
      ) {
        return true;
      }
      return false;
    },
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
        cellWidth: this.cellWidth
      };

      return calcBlockMargin(block.start, this.startBlockTimeFormat, options);
    }
  }
};
</script>