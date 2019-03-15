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
           v-for="(item,index) in concatArray(data)"
           v-if="isInTimeRange(item)"
           :key="itemKey?item[itemKey]:index"
           :style="{left:getPosition(item)+'px',width:getWidth(item)+'px'}">
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
import { isUndef, isDef, warn } from "../../utils/tool.js";

export default {
  name: "Blocks",
  mixins: [dr],
  props: {
    dataKey: String,
    itemKey: String,
    arrayKeys: {
      type: Array
    },
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
      return this.beginTimeOfTimeLine.toString();
    },
    renderAarrys() {
      let { arrayKeys } = this;
      if (arrayKeys.length > 0) {
        return arrayKeys;
      }
      return ["gtArray"];
    }
  },
  watch: {
    scrollLeft() {
      if(this.containerHeight === 0 ){
        return;
      }
      this.getTimeRange();
    },
    containerWidth(){
      if(this.containerHeight === 0 ){
        return;
      }
      this.getTimeRange();
    }
  },
  methods: {
    concatArray(data) {
      return this.renderAarrys.reduce((prev, curr) => {
        if (Array.isArray(data[curr])) {
          return prev.concat(data[curr]);
        } else {
          return prev;
        }
      }, []);
    },
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
      if (isUndef(block.start) || isUndef(block.end)) {
        // warn(`错误，该数据项不含start值 与 end 值 ${JSON.stringify(block)}，无法计算宽度值。`)
        return 0;
      }

      return getWidthAbout2Times(block.start, block.end, options);
    },
    //计算时间块偏移
    getPosition(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      if (isUndef(block.start)) {
        warn(
          `错误，该数据项不含start 值 ${JSON.stringify(
            block
          )}，无法计算偏移值。`
        );
        return 0;
      }

      return getPositonOffset(
        block.start,
        this.beginTimeOfTimeLineFormat,
        options
      );
    }
  }
};
</script>