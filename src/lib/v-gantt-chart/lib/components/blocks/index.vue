<template>
  <div class="gantt-blocks"
       :style="{height:blockHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block"
         :style="blockStyle"
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
import { isUndef, warn } from "../../utils/tool.js";

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
    },
    widthOfRenderAera:{
      type: Number,
      required: true
    },
    getPositonOffset:Function,
    getWidthAbout2Times:Function
  },
  data() {
    return {
      startTime: null,
      endTime: null
    };
  },
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
    },
    blockStyle(){
      return{
        backgroundSize:`${this.cellWidth}px ${this.cellHeight}px`,
        height:`${this.cellHeight}px`
      }
    }
  },
  watch: {
    scrollLeft() {
      this.getTimeRange();
    },
    widthOfRenderAera() {
      this.getTimeRange();
    },
    cellWidth(){
      this.getTimeRange();
    }
  },
  created() {
    this.getTimeRange();
  },
  mounted() {},
  methods: {
    /**
     * 根据renderAarrys拼接需要渲染的数组
     *
     * @param {*} data
     * @returns {[]} 该data中所有需要渲染的数据
     */
    concatArray(data) {
      return this.renderAarrys.reduce((prev, curr) => {
        if (Array.isArray(data[curr])) {
          return prev.concat(data[curr]);
        } else {
          return prev;
        }
      }, []);
    },
    /**
     * 计算需要渲染的时间范围
     *
     */
    getTimeRange() {
      if (this.heightOfRenderAera === 0) {
        return;
      }
      let {
        beginTimeOfTimeLine,
        scrollLeft,
        cellWidth,
        scale,
        widthOfRenderAera
      } = this;
      this.startTime = beginTimeOfTimeLine
        .clone()
        .add((scrollLeft / cellWidth) * scale, "m")
        .toDate()
        .getTime();
      this.endTime = beginTimeOfTimeLine
        .clone()
        .add(((scrollLeft + widthOfRenderAera) / cellWidth) * scale, "m")
        .toDate()
        .getTime();
    },
    /**
     * 判定数据是否在渲染的时间范围内
     *
     * @param {{start:string,end:string}} item
     * @returns {boolean} 该
     */
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
    /**
     * 计算时间块长度
     *
     * @param {{start:string,end:string}} block
     * @returns {number} 
     */
    getWidth(block) {
      if (isUndef(block.start) || isUndef(block.end)) {
        // warn(`错误，该数据项不含start值 与 end 值 ${JSON.stringify(block)}，无法计算宽度值。`)
        return 0;
      }

      return this.getWidthAbout2Times(block.start, block.end);
    },
    /**
     * 计算时间块偏移
     *
     * @param {{start:string}} block
     * @returns {number} 
     */
    getPosition(block) {
      if (isUndef(block.start)) {
        warn(
          `错误，该数据项不含start 值 ${JSON.stringify(
            block
          )}，无法计算偏移值。`
        );
        return 0;
      }

      return this.getPositonOffset(
        block.start
      );
    }
  }
};
</script>