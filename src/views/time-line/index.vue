<template>
  <div class="gantt-timeline"
       :style="{'margin-left':-cellWidth/2+'px'}">
    <div class="gantt-timeline-block"
         v-for="(day,index) in getDays"
         :key="index">
      <div class="gantt-timeline-day "
           :style="{height:titleHeight/2+'px','line-height':titleHeight/2+'px'}">{{day.format("MM/DD")}}</div>
      <div class="gantt-timeline-scale "
           :style="{height:titleHeight/2+'px',
           'line-height':titleHeight/2+'px'}">
        <div class="gantt-cell-width"
             v-for="(hour,index) in getTimeScales(day)"
             :key="index">
          {{hour}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import {
  getBeginTimeOfTimeLine,
  calcScalesAbout2Times
} from "@src/utils/timeLineUtils.js";

const START_DAY = 0;
const MIDDLE_DAY = 1;
const END_DAY = 2;

function isSameDay(one, two) {
  return one.isSame(two, "day");
}

export default {
  name: "Timeline",
  props: {
    start: {
      type: moment,
      required: true
    },
    end: {
      type: moment,
      required: true
    },
    cellWidth: {
      type: Number,
      default: 50
    },
    titleHeight: {
      type: Number,
      default: 40
    },
    scale: {
      type: Number,
      default: 60
    }
  },
  computed: {
    //天列表
    getDays() {
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
    //获取时间刻度数组
    getTimeScales(date) {
      let temp = [];
      let { start, end } = this;

      if (isSameDay(date, start)) {
        temp = this.generateTimeScale(START_DAY);
      } else if (isSameDay(date, end)) {
        temp = this.generateTimeScale(END_DAY);
      } else {
        temp = this.generateTimeScale(MIDDLE_DAY);
      }
      return temp;
    },
    //根据类型生成时间刻度数组
    generateTimeScale(type) {
      let totalblock = [];
      let { start, end, scale } = this;
      let a, b;
      switch (type) {
        case START_DAY: //和start同一天
          a = getBeginTimeOfTimeLine(start, scale);
          //start和end同一天特殊处理
          if (isSameDay(start, end)) {
            b = end;
          } else {
            b = start.clone().endOf("day");
          }
          break;
        case END_DAY: //和end 同一天
          a = end.clone().startOf("day");
          b = end.clone();
          break;
        case MIDDLE_DAY: //start和end中间的天
          a = start.clone().startOf("day");
          b = start.clone().endOf("day");
          break;
        default:
          throw new TypeError("错误的计算类型");
      }
      while (!a.isAfter(b)) {
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