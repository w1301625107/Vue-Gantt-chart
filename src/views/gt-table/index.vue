<template>
  <div class="gantt-table">
    <div class="gantt-block"
         v-for="(data,index) in datas"
         :key="index">
      <div class="gantt-block-name gantt-cell-height">{{data.name}}</div>
      <div class="gantt-block-series">
        <div v-if="showPlan"
             class=" gantt-cell-height">
          <div class="gantt-block-series-name">Planned</div>
          <div class="gantt-block-series-container">
            <div v-if="showTimeBlock"
                 class="gantt-block-series-timeline">
              <div class=" gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-series-blocks">
              <div v-for="(item,index) in data.Planned"
                   :key="index"
                   class="plan"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}">{{data.name}}</div>
            </div>
            <div class="gantt-block-series-forbiddens">
              <div v-for="(item,index) in forbidden"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
          </div>
        </div>
        <div v-if="showProject"
             class=" gantt-cell-height">
          <div class="gantt-block-series-name">Projected</div>
          <div class="gantt-block-series-container">
            <div v-if="showTimeBlock"
                 class="gantt-block-series-timeline">
              <div class=" gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-series-blocks">
              <div v-for="(item,index) in data.Projected"
                   :key="index"
                   class="project"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
            <div class="gantt-block-series-forbiddens">
              <div v-for="(item,index) in forbidden"
                   :key="index"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
          </div>
        </div>
        <div v-if="showActual"
             class=" gantt-cell-height">
          <div class="gantt-block-series-name">Actual</div>
          <div class="gantt-block-series-container">
            <div v-if="showTimeBlock"
                 class="gantt-block-series-timeline">
              <div class=" gantt-cell-width"
                   v-for="i in totalBlocks"
                   :key="i"></div>
            </div>
            <div class="gantt-block-series-blocks">
              <div v-for="(item,index) in data.Actual"
                   :key="index"
                   class="actual"
                   :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
            </div>
            <div class="gantt-block-series-forbiddens">
              <div v-for="(item,index) in forbidden"
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
import { mapState, mapGetters } from "vuex";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "GtTable",
  computed: {
    ...mapState([
      "datas",
      "descHeight",
      "cellWidth",
      "start",
      "end",
      "scale",
      "forbidden",
      "showPlan",
      "showActual",
      "showProject",
      "cellHeight",
      "showTimeBlock"
    ]),
    ...mapGetters(["startBlockTime", "totalBlocks"])
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
