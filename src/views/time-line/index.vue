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
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import moment from "moment";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";

const START_DAY = 0;
const MIDDLE_DAY = 1;
const END_DAY = 2;

function isSameDay(one, two) {
  return one.isSame(two, "day");
}
const scaleList = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120, 180, 240,
      360, 720, 1440
    ]
function countTimeBlockWithScale(timeStart,timeEnd,scale){
  if(!scaleList.includes(scale)){
    throw new TypeError(`错误的scale值，输入值为${scale},允许都scale值为${scaleList.toString}`)
  }
}
// countTimeBlockWithScale(0,0,11)

export default {
  name: "Timeline",
  data() {
    return {};
  },
  computed: {
    ...mapState(["descHeight", "cellWidth", "start", "end", "scale"]),
    ...mapGetters(["startBlockTime"]),
    //天列表
    dateDiff() {
      let temp = [];
      let start = this.start.clone();
      let end = this.end;

      for (; !isSameDay(start, end); start.add(1, "d")) {
        temp.push(start.clone());
      }
      temp.push(start.clone());

      return temp;
    }
  },
  methods: {
    //计算每天的MM/DD的block长度
    getMonthWith(date) {
      let blocks;
      let { start, end, scale, cellWidth } = this;

      let rate = scale / 60;
      if (isSameDay(date, start)) {
        if (scale > 60) {
          blocks =
            (24 -
              Math.floor((start.hour() + start.minutes() / 60) / rate) * rate) /
            rate;
        } else {
          blocks = ((24 - start.hour() - 1) * 60) / scale;
          blocks += 60 / scale - Math.floor(start.minutes() / scale);
        }
      } else if (isSameDay(date, end)) {
        if (scale > 60) {
          blocks = Math.ceil((end.hour() + end.minutes() / 60) / (scale / 60));
        } else {
          blocks = (end.hour() * 60) / scale;
          blocks += Math.ceil(end.minutes() / scale);
        }
      } else {
        blocks = (24 * 60) / scale;
      }
      return blocks * cellWidth;
    },
    //获取时间刻度数组
    getHourList(date) {
      let temp = [];
      let { start, end } = this;

      if (isSameDay(date, start)) {
        temp = this.generateHourList(START_DAY);
      } else if (isSameDay(date, end)) {
        temp = this.generateHourList(END_DAY);
      } else {
        temp = this.generateHourList(MIDDLE_DAY);
      }
      return temp;
    },
    //根据类型生成时间刻度数组
    generateHourList(type) {
      let totalblock = [];
      let { start, end, scale, startBlockTime } = this;
      let a, b;
      switch (type) {
        case START_DAY: //和start同一天
          a = startBlockTime.clone();
          //start和end同一天特殊处理
          if (isSameDay(start, end)) {
            b = end;
          } else {
            b = start.clone().endOf("day");
          }
          break;
        case END_DAY: //和end 同一天
          a = end.clone().startOf("day");
          if (scale > 60) {
            b = end.clone();
          } else {
            b = end
              .clone()
              .minutes(Math.ceil(end.minutes() / scale) * scale)
              .seconds(0);
          }
          break;
        case MIDDLE_DAY: //start和end中间的天
          a = start.clone().startOf("day");
          b = start.clone().endOf("day");
          break;
        default:
          throw new TypeError("错误的计算类型");
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