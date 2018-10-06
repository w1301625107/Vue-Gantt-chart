<template>
  <div class="gantt-blocks">
    <div class="gantt-block"
         v-for="(data,index) in datas"
         :key="index">
      <div class="gantt-block-name gantt-cell-height">{{data.name}}</div>
      <div class="gantt-block-series">
        <div v-if="showPlan"
             class="gantt-block-series-plan gantt-cell-height">
          <div class="gantt-block-series-name">Planned</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-contains">
              <div class="gantt-block-contains-block"
                   v-for="(item,index) in data.Planned"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}">{{data.name}}</div>
            </div>
            <div class="gantt-block-forbiddens">
              <div class="gantt-block-forbidden"
                   v-for="(item,index) in forbidden"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
          </div>
        </div>
        <div v-if="showProject"
             class="gantt-block-series-project gantt-cell-height">
          <div class="gantt-block-series-name">Projected</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-contains">
              <div class="gantt-block-contains-block"
                   v-for="(item,index) in data.Projected"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
            <div class="gantt-block-forbiddens">
              <div class="gantt-block-forbidden"
                   v-for="(item,index) in forbidden"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
          </div>
        </div>
        <div v-if="showActual"
             class="gantt-block-series-actual gantt-cell-height">
          <div class="gantt-block-series-name">Actual</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-contains">
              <div class="gantt-block-contains-block"
                   v-for="(item,index) in data.Actual"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
            <div class="gantt-block-forbiddens">
              <div class="gantt-block-forbidden"
                   v-for="(item,index) in forbidden"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Blocks",
  props: {
    cellWidth: {
      type: Number
    },
    cellHeight: {
      type: Number
    },
    totalBlocks: {
      type: Number,
      required: true
    },
    forbidden: {
      type: Array,
      default: []
    },
    datas: {
      type: Array,
      default: []
    },
    showPlan: {
      type: Boolean,
      default: true
    },
    showProject: {
      type: Boolean,
      default: true
    },
    showActual: {
      type: Boolean,
      default: true
    },
    scale: {
      type: Number
    },
    startBlockTime: {
      required: true
    },
    showTimeBlock: {
      type: Boolean
    }
  },
  methods: {
    //计算时间块长度
    getBlockwidth(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return calcBlockwidth(block, options);
    },
    //计算时间块偏移
    getBlockMargin(block) {
      let options = {
        scale: this.scale,
        cellWidth: this.cellWidth,
        startBlockTime: this.startBlockTime
      };
      return calcBlockMargin(block, options);
    }
  }
};
</script>

<style>
</style>
