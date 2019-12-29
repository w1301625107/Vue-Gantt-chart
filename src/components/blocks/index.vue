<template>
  <div class="gantt-blocks" :style="{ height: blockHeight + 'px' }">
    <div
      class="gantt-block gantt-block-top-space"
      :style="{ height: topSpace + 'px' }"
    ></div>
    <div
      class="gantt-block"
      :style="blockStyle"
      v-for="(data, index) in showDatas"
      :key="dataKey ? data[dataKey] : index"
    >
      <template v-if="!customGenerateBlocks">
        <template v-for="(item, index) in concatArray(data)">
          <div
            v-if="
              isInRenderingTimeRangeOrIsAcrossRenderingTimeRange(
                item.start,
                item.end
              )
            "
            class="gantt-block-item"
            :key="itemKey ? item[itemKey] : index"
            :style="{
              left: getPosition(item) + 'px',
              width: getWidth(item) + 'px'
            }"
          >
            <slot :data="data" :item="item">
              <div class="gantt-block-defaultBlock">need slot</div>
            </slot>
          </div>
        </template>
      </template>

      <template v-else>
        <slot
          :data="data"
          :getPositonOffset="getPositonOffset"
          :getWidthAbout2Times="getWidthAbout2Times"
          :isInRenderingTimeRange="isInRenderingTimeRange"
          :isAcrossRenderingTimeRange="isAcrossRenderingTimeRange"
          >need slot
        </slot>
      </template>
    </div>
  </div>
</template>

<script>
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
    cellWidth: {
      type: Number,
      required: true
    },
    scale: {
      type: Number,
      required: true
    },
    widthOfBlocksWrapper: {
      type: Number,
      required: true
    },
    endTimeOfRenderArea: [Number, null],
    startTimeOfRenderArea: [Number, null],
    getPositonOffset: Function,
    getWidthAbout2Times: Function,
    customGenerateBlocks: Boolean
  },
  computed: {
    renderAarrys() {
      const { arrayKeys } = this;
      if (arrayKeys.length > 0) {
        return arrayKeys;
      }
      return ["gtArray"];
    },
    blockStyle() {
      return {
        backgroundSize: `${this.cellWidth}px ${this.cellHeight}px`,
        height: `${this.cellHeight}px`
      };
    }
  },

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
     * 判定时间段是否跨越了渲染的时间范围 或者判定时间是否在渲染的时间范围内
     *
     * @param {{timeStart:string}} item
     * @param {{timeEnd:string}} item
     * @returns {boolean}
     */
    isInRenderingTimeRangeOrIsAcrossRenderingTimeRange(timeStart, timeEnd) {
      if (this.heightOfBlocksWrapper === 0) {
        return false;
      }

      const { startTimeOfRenderArea, endTimeOfRenderArea } = this;
      if (isUndef(startTimeOfRenderArea) || isUndef(endTimeOfRenderArea)) {
        return false;
      }

      const timeStartToMs = new Date(timeStart).getTime();
      const timeEndToMs = new Date(timeEnd).getTime();
      if (
        startTimeOfRenderArea >= timeStartToMs &&
        timeEndToMs >= endTimeOfRenderArea
      ) {
        return true;
      }
      if (
        startTimeOfRenderArea <= timeStartToMs &&
        timeStartToMs <= endTimeOfRenderArea
      ) {
        return true;
      }
      if (
        startTimeOfRenderArea <= timeEndToMs &&
        timeEndToMs <= endTimeOfRenderArea
      ) {
        return true;
      }
      return false;
    },
    /**
     * 判定时间是否在渲染的时间范围内
     *
     * @param {{time:string}} item
     * @returns {boolean}
     */
    isInRenderingTimeRange(time) {
      if (this.heightOfBlocksWrapper === 0) {
        return false;
      }

      const { startTimeOfRenderArea, endTimeOfRenderArea } = this;
      if (isUndef(startTimeOfRenderArea) || isUndef(endTimeOfRenderArea)) {
        return false;
      }

      const timeToMs = new Date(time).getTime();
      if (
        startTimeOfRenderArea <= timeToMs &&
        timeToMs <= endTimeOfRenderArea
      ) {
        return true;
      }
      return false;
    },
    /**
     * 判定时间段是否跨越了渲染的时间范围
     *
     * @param {{timeStart:string}} item
     * @param {{timeEnd:string}} item
     * @returns {boolean}
     */
    isAcrossRenderingTimeRange(timeStart, timeEnd) {
      if (this.heightOfBlocksWrapper === 0) {
        return false;
      }

      const { startTimeOfRenderArea, endTimeOfRenderArea } = this;
      if (isUndef(startTimeOfRenderArea) || isUndef(endTimeOfRenderArea)) {
        return false;
      }

      const timeStartToMs = new Date(timeStart).getTime();
      const timeEndToMs = new Date(timeEnd).getTime();
      if (
        startTimeOfRenderArea >= timeStartToMs &&
        timeEndToMs >= endTimeOfRenderArea
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

      return this.getPositonOffset(block.start);
    }
  }
};
</script>
