<template>
  <div class="gantt-timeline">
    <div class="gantt-timeline-blocks">
      <div class="gantt-timeline-block"
           v-for="(day,index) in dateDiff"
           :key="index"
           :style="{width:getMonthWith(day)+'px'}">
        <div class="gantt-timeline-day "
             :style="{height:descHeight/2+'px','line-height':descHeight/2+'px'}">{{day.format("MM/DD")}}</div>
        <div class="gantt-timeline-hours "
             :style="{height:descHeight/2+'px',
           'line-height':descHeight/2+'px'}">
          <div class="gantt-cell-width"
               v-for="(hour,index) in getHourList(day)"
               :key="index">{{hour}}</div>
        </div>
      </div>
    </div>
    <div class="gantt-timeline-forbiddens "
         :style="{top:descHeight/2+'px',height:descHeight/2+'px'}">
      <div v-for="(item,index) in forbidden"
           :key="index"
           :style="{width:getBlockwidth(item)+'px','margin-left':getBlockMargin(item)+'px'}"></div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Timeline",
  props: {
    descHeight: {
      type: Number,
      required: true
    },
    cellWidth: {
      type: Number,
      required: true
    },
    cellHeight: {
      type: Number,
      required: true
    },
    start: {
      required: true
    },
    end: {
      required: true
    },
    scale: {
      type: Number,
      required: true
    },
    forbidden: {
      type: Array,
      default: []
    },
    startBlockTime: {
      required: true
    }
  },
  data() {
    return {};
  },
  computed: {
    //天列表
    dateDiff() {
      let temp = [];
      let start = this.start.clone();
      let end = this.end.format("MM/DD");

      for (; start.format("MM/DD") != end; start.add(1, "d")) {
        temp.push(start.clone());
      }
      temp.push(start.clone());

      return temp;
    }
  },
  created() {},
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
    //计算每天的MM/DD的block长度
    getMonthWith(date) {
      let hours;
      let { start, end, cellWidth } = this;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        hours = 24 - start.hour();
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        hours = end.hour() + 1;
      } else {
        hours = 24;
      }

      let blocks = Math.ceil(hours / this.scale);
      return blocks * cellWidth;
    },
    getHourList(date) {
      let temp = [];
      let { start, end } = this;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        temp = this.countHour(start.hour(), 24);
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        temp = this.countHour(0, end.hour() + 1);
      } else {
        temp = this.countHour(0, 24);
      }

      return temp;
    },
    countHour(start, end) {
      let totalblock = [];

      for (let i = 0; i < 24; i += this.scale) {
        if (start - this.scale < i && i < end) {
          let val = moment({
            hour: Math.floor(i / 1),
            minute: (i % 1) * 60
          }).format("HH:mm");
          totalblock.push(val);
        }
      }

      return totalblock;
    }
  }
};
</script>

