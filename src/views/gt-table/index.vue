<template>
  <div class="gantt-table">
    <div class="gantt-block"
         v-for="(data,index) in datas"
         :key="index">
      <div v-if="showPlan"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Planned"
                 :key="index"
                 class="plan"
                 @click="blockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}">{{data.name}}{{item.start.format("HH:mm:ss")}}</div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
          </div>
        </div>
      </div>
      <div v-if="showProject"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Projected"
                 :key="index"
                 class="project"
                 @click="blockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
          </div>
        </div>
      </div>
      <div v-if="showActual"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Actual"
                 :key="index"
                 class="actual"
                 @click="blockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'margin-left':getBlockMargin(item)+'px'}"></div>
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
      "cellWidth",
      "scale",
      "forbidden",
      "showPlan",
      "showActual",
      "showProject",
      "showTimeBlock"
    ]),
    ...mapGetters(["startBlockTime"])
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
    },
    blockClick(item) {
      this.$store.commit("updateMarkLineTime", item.start);
    }
  }
};
</script>

<style>
</style>
