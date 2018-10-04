<template>
  <div class="gantt-timeline">
    <div class="gantt-timeline-blocks">
      <div class="gantt-timeline-block"
           v-for="(day,index) in dateDiff"
           :key="index"
           :style="{width:getMonthWith(day)+'px'}">
        <div class="gantt-timeline-day"
             :style="{height:cellHeight+'px',
           'line-height':cellHeight+'px'}">{{day.format("MM/DD")}}</div>
        <div class="gantt-timeline-hours">
          <div class="gantt-timeline-hour"
               :style="{width:cellWidth+'px',height:cellHeight+'px','line-height':cellHeight+'px'}"
               v-for="(hour,index) in getHourList(day)"
               :key="index">{{hour}}</div>
        </div>

      </div>
    </div>
    <div class="gantt-timeline-forbiddens"
         :style="{top:cellHeight+'px',height:cellHeight+'px'}">
      <div class="gantt-timeline-forbidden"
           v-for="(item,index) in forbidden"
           :key="index"
           :style="{width:getBlockwidth(item)+'px',height:cellHeight+'px','margin-left':getBlockMargin(item)+'px'}"></div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "Timeline",
  props: {
    cellWidth: {
      type: Number,
      default: 20
    },
    cellHeight: {
      type: Number,
      default: 20
    },
    start: {
      required: true
    },
    end: {
      required: true
    },
    scale: {
      type: Number,
      default: 1
    },
    forbidden: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      //可用缩放尺度
      scaleList: [0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 24]
    };
  },
  computed: {
    currentScale() {
      let val = 1;
      if (-1 != this.scaleList.indexOf(this.scale)) {
        val = this.scale;
      }
      return val;
    },
    startTime() {
      return moment(this.start);
    },
    endTime() {
      return moment(this.end);
    },
    //天列表
    dateDiff() {
      let temp = [];
      let start = this.startTime.clone();
      let end = this.endTime.format("MM/DD");

      for (; start.format("MM/DD") != end; start.add(1, "d")) {
        temp.push(start.clone());
      }
      temp.push(start.clone());

      return temp;
    },
    //获取开始时间块的时间
    startBlockTime() {
      let start = this.startTime.clone();
      let hours = start.hours();
      let date;

      for (let i = 0; i < 24; i += this.currentScale) {
        if (hours - this.currentScale < i) {
          date = start.hours(Math.floor(i / 1)).minutes((i % 1) * 60);
          break;
        }
      }
      console.log("date:", date.format("HH:mm"));
      return date;
    }
  },
  created() {},
  methods: {
    //计算时间块长度
    getBlockwidth(block) {
      let { start, end } = block;
      let width = end.diff(start, "h", true) / this.currentScale;
      return width * this.cellWidth;
    },
    //计算时间块偏移
    getBlockMargin(block) {
      let { start } = block;
      let width =
        start.diff(this.startBlockTime, "h", true) / this.currentScale;
      return width * this.cellWidth;
    },
    //计算每天的MM/DD的block长度
    getMonthWith(date) {
      let hours;
      let start = this.startTime;
      let end = this.endTime;
      let cellWidth = this.cellWidth;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        hours = 24 - start.hour();
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        hours = end.hour() + 1;
      } else {
        hours = 24;
      }

      let blocks = Math.ceil(hours / this.currentScale);
      return blocks * cellWidth;
    },
    getHourList(date) {
      let temp = [];
      let start = this.startTime;
      let end = this.endTime;

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

      for (let i = 0; i < 24; i += this.currentScale) {
        if (start - this.currentScale < i && i < end) {
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

<style>
</style>
