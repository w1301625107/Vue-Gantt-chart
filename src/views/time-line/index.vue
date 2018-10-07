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
               :key="index"><span>{{hour}}</span></div>
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
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Timeline",
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "descHeight",
      "cellWidth",
      "start",
      "end",
      "scale",
      "forbidden"
    ]),
    ...mapGetters(["startBlockTime"]),
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
      let blocks;
      let { start, end, scale, cellWidth } = this;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        blocks = ((24 - start.hour()) * 60) / scale;
        blocks += 60 / scale - Math.floor(start.minutes() / scale);
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        blocks = (end.hour() * 60) / scale;
        blocks += Math.ceil(end.minutes() / scale);
      } else {
        blocks = (24 * 60) / scale;
      }
      return blocks * cellWidth;
    },
    getHourList(date) {
      let temp = [];
      let { start, end } = this;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        temp = this.countHour(0);
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        temp = this.countHour(1);
      } else {
        temp = this.countHour(2);
      }
      return temp;
    },
    countHour(type) {
      let totalblock = [];
      let { start, end, scale, startBlockTime } = this;
      let a, b;
      switch (type) {
        case 0:
          a = startBlockTime.clone();
          if (start.format("MM/DD") == end.format("MM/DD")) {
            b = end;
          } else {
            b = start
              .clone()
              .hour(23)
              .minutes(59)
              .seconds(59);
          }

          break;
        case 1:
          a = end
            .clone()
            .hour(0)
            .minutes(0)
            .seconds(0);
          b = end
            .clone()
            .minutes(Math.ceil(end.minutes() / scale) * scale)
            .seconds(0);
          break;
        case 2:
          a = start
            .clone()
            .hour(0)
            .minutes(0)
            .seconds(0);
          b = start
            .clone()
            .hour(23)
            .minutes(59)
            .seconds(59);
          break;
        default:
          break;
      }
      while (!a.isAfter(b)) {
        if (a.isSame(b)) {
          break;
        }
        totalblock.push(a.format("HH:mm"));
        a.add(scale, "m");
      }

      return totalblock;
    }
  }
};
</script>

