<template>
  <div class="gantt-timeline" :style="{ 'margin-left': -cellWidth / 2 + 'px' }">
    <div
      class="gantt-timeline-block"
      v-for="(day, index) in getDays"
      :style="{ width: getTimeScales(day).length * cellWidth + 'px' }"
      :key="index"
    >
      <div class="gantt-timeline-day " :style="heightStyle">
        {{ day.format("MM/DD") }}
      </div>
      <div class="gantt-timeline-scale " :style="heightStyle">
        <div
          :style="cellWidthStyle"
          v-for="(hour, index) in getTimeScales(day)"
          :key="index"
        >
          {{ hour }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { getBeginTimeOfTimeLine } from "../../utils/timeLineUtils.js";

const START_DAY = Symbol();
const MIDDLE_DAY = Symbol();
const END_DAY = Symbol();

function isSameDay(one, two) {
  return one.isSame(two, "day");
}

export default {
  name: "Timeline",

  props: {
    start: {
      type: dayjs
    },
    end: {
      type: dayjs
    },
    cellWidth: {
      type: Number
    },
    titleHeight: {
      type: Number
    },
    scale: {
      type: Number
    }
  },

  computed: {
    /**
     * 天列表
     * @returns {[dayjs]} 该data中所有需要渲染的数据
     */
    getDays() {
      const temp = [];
      let { start, end } = this;

      for (; !isSameDay(start, end); start = start.add(1, "day")) {
        temp.push(start);
      }
      temp.push(start);

      return temp;
    },
    cellWidthStyle() {
      return {
        width: `${this.cellWidth}px`
      };
    },
    heightStyle() {
      return {
        height: this.titleHeight / 2 + "px",
        "line-height": this.titleHeight / 2 + "px"
      };
    }
  },

  methods: {
    /**
     * 获取时间刻度数组
     *
     * @param {dayjs} date
     * @returns {[string]} 该data中所有需要渲染的数据
     */
    getTimeScales(date) {
      const { start, end } = this;

      if (isSameDay(date, start)) {
        return this.generateTimeScale(START_DAY);
      } else if (isSameDay(date, end)) {
        return this.generateTimeScale(END_DAY);
      } else {
        return this.generateTimeScale(MIDDLE_DAY);
      }
    },
    /**
     * 生成时间刻度数组
     *
     * @param {Symbol} type
     * @returns {[string]} 该data中所有需要渲染的数据
     */
    generateTimeScale(type) {
      const totalblock = [];
      const { start, end, scale } = this;
      let a, b;
      switch (type) {
        case START_DAY: //和start同一天
          a = getBeginTimeOfTimeLine(start, scale);
          //start和end同一天特殊处理
          if (isSameDay(start, end)) {
            b = end;
          } else {
            b = start.endOf("day");
          }
          break;
        case END_DAY: //和end 同一天
          a = end.startOf("day");
          b = end;
          break;
        case MIDDLE_DAY: //start和end中间的天
          a = start.startOf("day");
          b = start.endOf("day");
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
        a = a.add(scale, "minute");
      }

      return totalblock;
    }
  }
};
</script>
