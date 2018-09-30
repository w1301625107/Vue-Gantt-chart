<template>
  <div class="gantt-timeline">
    <div class="gantt-timeline-blocks"
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
    }
  },
  data() {
    return {};
  },
  computed: {
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
    }
  },
  created() {},
  methods: {
    //计算每天的MM/DD的block长度
    getMonthWith(date) {
      let width;
      let start = this.startTime;
      let end = this.endTime;
      let cellWidth = this.cellWidth;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        width = 24 - start.hour();
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        width = end.hour() + 1;
      } else {
        width = 24;
      }
      return width * cellWidth;
    },
    getHourList(date) {
      let temp = [];
      let start = this.startTime;
      let end = this.endTime;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        //width = 24 - start.hour();
        temp = this.countHour(start.hour(), 24);
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        //width = end.hour() + 1;
        temp = this.countHour(0, end.hour() + 1);
      } else {
        temp = this.countHour(0, 24);
      }
      return temp;
    },
    countHour(start, end) {
      let temp = [];
      while (start < end) {
        temp.push(start);
        start += 1;
      }
      return temp;
    }
  }
};
</script>

<style>
</style>
