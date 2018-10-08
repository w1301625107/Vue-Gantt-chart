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
               :key="index">
            <span>{{hour}}</span>
          </div>
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
      let { start, end, scale, cellWidth, startBlockTime } = this;

      if (date.format("MM/DD") == start.format("MM/DD")) {
        if (scale > 60) {
          let rate = scale / 60;
          blocks =
            (24 -
              Math.floor((start.hour() + start.minutes() / 60) / rate) * rate) /
            rate;
        } else {
          blocks = (24 - start.hour() - 1) * 60 / scale;
          blocks += 60 / scale - Math.floor(start.minutes() / scale);
        }
      } else if (date.format("MM/DD") == end.format("MM/DD")) {
        if (scale > 60) {
          blocks = Math.ceil((end.hour() + end.minutes() / 60) / (scale / 60));
        } else {
          blocks = end.hour() * 60 / scale;
          blocks += Math.ceil(end.minutes() / scale);
        }
      } else {
        blocks = 24 * 60 / scale;
      }
      return blocks * cellWidth;
    },
    //获取时间刻度数组
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
    //根据类型生成时间刻度数组
    countHour(type) {
      let totalblock = [];
      let { start, end, scale, startBlockTime } = this;
      let a, b;
      switch (type) {
        case 0: //和start同一天
          a = startBlockTime.clone();
          //start和end同一天特殊处理
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
        case 1: //和end 同一天
          a = end
            .clone()
            .hour(0)
            .minutes(0)
            .seconds(0);
          if (scale > 60) {
            b = end.clone();
          } else {
            b = end
              .clone()
              .minutes(Math.ceil(end.minutes() / scale) * scale)
              .seconds(0);
          }
          break;
        case 2: //start和end中间的天
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
        if (scale >= 60) {
          totalblock.push(a.format("HH"));
        } else {
          totalblock.push(a.format("HH:mm"));
        }
        a.add(scale, "m");
      }

      return totalblock;
    }
  }
};
</script>

