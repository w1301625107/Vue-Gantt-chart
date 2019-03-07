<template>
  <div class="gantt-blocks"
       :style="{height:blockHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block gantt-cell-height"
         v-for="(data,index) in showDatas"
         :key="dataKey?data[dataKey]:index">
      <div class="gantt-block-item"
           v-for="(item,index) in data.gtArray"
           v-if="isInTimeRange(item)"
           :key="itemKey?item[itemKey]:index"
           :style="{width:getWidth(item)+'px',
                   'left':getPosition(item)+'px'}">
        <slot :data="data"
              :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import dr from "../dynamic-render.js";
import { getWidthAbout2Times, getPositonOffset } from "../../utils/gtUtils.js";
export default {
  name: "Blocks",
  mixins: [dr],
  props: {
    dataKey:String,
    itemKey:String,
    scrollLeft: Number,
    beginTimeOfTimeLine: {
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
    this.getTimeRange();
  },
  mounted() {},
  computed: {
    beginTimeOfTimeLineFormat() {
      return this.beginTimeOfTimeLine.format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    scrollLeft() {
      this.getTimeRange();
    }
  },
  methods: {
    getTimeRange() {
      let {
        beginTimeOfTimeLine,
        scrollLeft,
        cellWidth,
        scale,
        containerWidth
      } = this;
      this.startTime = beginTimeOfTimeLine
        .clone()
        .add((scrollLeft / cellWidth) * scale, "m")
        .toDate()
        .getTime();
      this.endTime = beginTimeOfTimeLine
        .clone()
        .add(((scrollLeft + containerWidth) / cellWidth) * scale, "m")
        .toDate()
        .getTime();
    },
    isInTimeRange(item) {
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
    getWidth(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return getWidthAbout2Times(block.start, block.end, options);
    },
    //计算时间块偏移
    getPosition(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };

      return getPositonOffset(block.start, this.beginTimeOfTimeLineFormat, options);
    }
  }
};
</script>