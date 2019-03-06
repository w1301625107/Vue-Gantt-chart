<template>
  <div class="gantt-timeline"
       :style="{'margin-left':-cellWidth/2+'px'}">
    <div class="gantt-timeline-block"
         v-for="(day,index) in getDays"
         :key="index">
      <div class="gantt-timeline-day "
           :style="{height:descHeight/2+'px','line-height':descHeight/2+'px'}">{{day.format("MM/DD")}}</div>
      <div class="gantt-timeline-hours "
           :style="{height:descHeight/2+'px',
           'line-height':descHeight/2+'px'}">
        <div class="gantt-cell-width"
             v-for="(hour,index) in getHourList(day)"
             :key="index">
          {{hour}}
        </div>
      </div>
    </div>
  </div>
</template>
//  :style="{width:getDayWith(day)+'px'}" 
<script>
import moment from "moment";
import {
  getStartBlocksTime,
  countTimeBlockWithScale
} from "@src/utils/timeblock.js";
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
    descHeight: {
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
    // //计算每天的MM/DD的block长度
    // getDayWith(date) {
    //   let blocks;
    //   let { start, end, scale, cellWidth } = this;
    //   if (isSameDay(date, start)) {
    //     blocks = countTimeBlockWithScale(
    //       start,
    //       start.clone().endOf("day"),
    //       scale
    //     );
    //   } else if (isSameDay(date, end)) {
    //     blocks = countTimeBlockWithScale(
    //       end.clone().startOf("day"),
    //       end,
    //       scale
    //     );
    //   } else {
    //     blocks = (24 * 60) / scale;
    //   }
    //   return blocks * cellWidth;
    // },
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
      let { start, end, scale } = this;
      let a, b;
      switch (type) {
        case START_DAY: //和start同一天
          a = getStartBlocksTime(start, scale);
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