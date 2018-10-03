<template>
  <div class="gantt-blocks">
    <div class="gantt-block"
         v-for="(data,index) in datas"
         :key="index">
      <div class="gantt-block-name"
           :style="{height:cellHeight+'px'}">{{data.name}}</div>
      <div class="gantt-block-series">
        <div v-if="showPlan"
             class="gantt-block-series-plan"
             :style="{height:cellHeight+'px'}">
          <div class="gantt-block-series-name">Planned</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block"
                   v-for="i in totalBlocks"
                   :key="i"
                   :style="{width:cellWidth+'px'}"></div>
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
             class="gantt-block-series-project"
             :style="{height:cellHeight+'px'}">
          <div class="gantt-block-series-name">Projected</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block"
                   v-for="i in totalBlocks"
                   :key="i"
                   :style="{width:cellWidth+'px'}"></div>
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
             class="gantt-block-series-actual"
             :style="{height:cellHeight+'px'}">
          <div class="gantt-block-series-name">Actual</div>
          <div class="gantt-block-timeline">
            <div v-if="showTimeBlock"
                 class="gantt-block-timeline-blocks">
              <div class="gantt-block-timeline-block"
                   v-for="i in totalBlocks"
                   :key="i"
                   :style="{width:cellWidth+'px'}"></div>
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
export default {
  name: "Blocks",
  props: {
    cellWidth: {
      type: Number,
      default: 20
    },
    cellHeight: {
      type: Number,
      default: 20
    },
    descWidth: {
      type: Number,
      default: 200
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
      type: Number,
      default: 1
    },
    startBlockTime: {
      required: true
    },
    showTimeBlock: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    //计算时间块长度
    getBlockwidth(block) {
      let { start, end } = block;
      let width = end.diff(start, "h", true) / this.scale;
      return width * this.cellWidth;
    },
    //计算时间块偏移
    getBlockMargin(block) {
      let { start } = block;
      let width = start.diff(this.startBlockTime, "h", true) / this.scale;
      return width * this.cellWidth;
    }
  }
};
</script>

<style>
</style>
