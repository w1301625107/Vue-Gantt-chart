<template>
  <div class="gantt-timeline">
    <div
      v-if="lazy"
      class="gantt-timeline-padding_block"
      :style="{ width: paddingWidth + 'px' }"
    ></div>
    <template v-for="(day, index) in allDayBlocks">
      <div
        class="gantt-timeline-block"
        v-if="!lazy || isInRenderingDayRange(day)"
        :style="{ width: getDayWidth(day) * cellWidth + 'px' }"
        :key="index"
      >
        <slot :day="day" :getTimeScales="getTimeScales">
          <div class="gantt-timeline-day " :style="heightStyle">
            {{ day.format("MM/DD") }}
          </div>
          <div
            v-if="!isDayScale"
            class="gantt-timeline-scale "
            :style="heightStyle"
          >
            <div
              :style="cellWidthStyle"
              v-for="(time, index) in getTimeScales(day)"
              :key="index"
            >
              {{ scale >= 60 ? time.format("HH") : time.format("HH:mm") }}
            </div>
          </div>
        </slot>
      </div>
    </template>
  </div>
</template>

<script>
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);

import {
  isDayScale,
  MINUTE_OF_ONE_DAY,
  getBeginTimeOfTimeLine,
  getEndTimeOfTimeLine
} from "../../utils/timeLineUtils.js";

const START_DAY = Symbol();
const MIDDLE_DAY = Symbol();
const END_DAY = Symbol();

function isSameDay(one, two) {
  return one.isSame(two, "day");
}

function isSameOrBetween(start, end, mid) {
  return mid.isSameOrAfter(start) && mid.isSameOrBefore(end);
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
    },
    endTimeOfRenderArea: [dayjs, null],
    startTimeOfRenderArea: [dayjs, null],
    getPositionOffset: {
      type: Function
    },
    lazy: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    startDayOfRenderArea() {
      return this.startTimeOfRenderArea.startOf("day");
    },
    endDayOfRenderArea() {
      return this.endTimeOfRenderArea.endOf("day");
    },
    paddingWidth() {
      const { allDayBlocks, scale, startDayOfRenderArea } = this;
      const temp = allDayBlocks.find((day) => {
        if (
          scale >= MINUTE_OF_ONE_DAY &&
          startDayOfRenderArea.isBetween(
            day,
            day.add(scale / MINUTE_OF_ONE_DAY, "day")
          )
        ) {
          return true;
        } else {
          return isSameDay(day, startDayOfRenderArea);
        }
      });
      if (!temp || temp == allDayBlocks[0]) {
        return 0;
      } else {
        return this.getPositionOffset(temp.toString());
      }
    },
    isDayScale() {
      const { scale } = this;
      return isDayScale(scale);
    },
    /**
     * 天列表
     * @returns {[dayjs]} 该data中所有需要渲染的数据
     */
    allDayBlocks() {
      const temp = [];
      let { start, end, scale, isDayScale } = this;
      let tempStart = start.clone().startOf("day");
      let addNum =
        isDayScale && scale > MINUTE_OF_ONE_DAY ? scale / MINUTE_OF_ONE_DAY : 1;
      while (tempStart.isSameOrBefore(end)) {
        temp.push(tempStart);
        tempStart = tempStart.add(addNum, "day");
      }
      return temp;
    },
    cellWidthStyle() {
      return {
        width: `${this.cellWidth}px`
      };
    },
    heightStyle() {
      return {
        height: this.titleHeight / (this.isDayScale ? 1 : 2) + "px",
        "line-height": this.titleHeight / (this.isDayScale ? 1 : 2) + "px",
        "margin-left": -this.cellWidth / 2 + "px"
      };
    }
  },

  methods: {
    isInRenderingDayRange(day) {
      const { startDayOfRenderArea, endDayOfRenderArea, scale } = this;
      if (
        scale >= MINUTE_OF_ONE_DAY &&
        startDayOfRenderArea.isBetween(
          day,
          day.add(scale / MINUTE_OF_ONE_DAY, "day")
        )
      ) {
        return true;
      } else if (
        isSameOrBetween(startDayOfRenderArea, endDayOfRenderArea, day)
      ) {
        return true;
      } else {
        return false;
      }
    },
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
     * 获取每天的宽度
     *
     * @param {dayjs} date
     * @returns {number}
     */
    getDayWidth(date) {
      const { start, end, scale } = this;
      if (isSameDay(date, start)) {
        let a = getBeginTimeOfTimeLine(start.valueOf(), scale);
        let b;
        //start和end同一天特殊处理
        if (isSameDay(start, end)) {
          b = getEndTimeOfTimeLine(end.valueOf(), scale);
        } else {
          b = start
            .add(1, "day")
            .startOf("day")
            .valueOf();
        }
        return Math.ceil((b - a) / 60000 / scale);
      } else if (isSameDay(date, end)) {
        let a = end.startOf("day");
        let b = getEndTimeOfTimeLine(end.valueOf(), scale);
        return Math.ceil((b - a) / 60000 / scale);
      } else {
        return Math.ceil((24 * 60) / scale);
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
          a = dayjs(getBeginTimeOfTimeLine(start.toString(), scale));
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
        totalblock.push(a);
        a = a.add(scale, "minute");
      }

      return totalblock;
    }
  }
};
</script>
