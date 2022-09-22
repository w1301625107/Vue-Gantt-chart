<template>
  <div
    class="gantt-chart"
    @wheel.passive="wheelHandle"
    @touchstart.passive="touchStartHandle"
    @touchmove.passive="touchMoveHandle"
    @touchend.passive="touchEndHandle"
  >
    <div
      class="gantt-container"
      :style="{
        height: `calc(100% - ${scrollXBarHeight}px)`,
        width: `calc(100% - ${scrollYBarWidth}px)`
      }"
    >
      <div
        v-show="!hideHeader"
        class="gantt-header"
        :style="{ width: `calc(100% + ${scrollYBarWidth}px)` }"
      >
        <div
          class="gantt-header-title"
          :style="{
            'line-height': titleHeight + 'px',
            height: titleHeight + 'px',
            width: titleWidth + 'px'
          }"
        >
          <slot name="title">welcome v-gantt-chart</slot>
        </div>
        <div ref="headerTimeline" class="gantt-header-timeline">
          <div
            class="gantt-timeline-wrapper"
            :style="{ width: totalWidth + scrollYBarWidth + 'px' }"
          >
            <timeline
              :start="start"
              :end="end"
              :cellWidth="cellWidth"
              :titleHeight="titleHeight"
              :scale="scale"
              :startTimeOfRenderArea="dayjs(startTimeOfRenderArea)"
              :endTimeOfRenderArea="dayjs(endTimeOfRenderArea)"
              :getPositonOffset="getPositonOffset"
            >
              <template v-slot="{ day, getTimeScales }">
                <slot name="timeline" :day="day" :getTimeScales="getTimeScales">
                </slot>
              </template>
            </timeline>
          </div>
        </div>
      </div>

      <div
        class="gantt-body"
        :style="{ height: `calc(100% - ${actualHeaderHeight}px)` }"
      >
        <div class="gantt-table">
          <div
            ref="marklineArea"
            :style="{ marginLeft: titleWidth + 'px' }"
            class="gantt-markline-area"
          >
            <CurrentTime
              v-if="showCurrentTime"
              :getPositonOffset="getPositonOffset"
            />
            <mark-line
              v-for="(timeConfig, index) in timeLines"
              :key="index"
              :timeConfig="timeConfig"
              :getPositonOffset="getPositonOffset"
            >
              <template v-slot="{ timeConfig, getPosition }">
                <slot
                  name="markLine"
                  :timeConfig="timeConfig"
                  :getPosition="getPosition"
                ></slot>
              </template>
            </mark-line>
          </div>
          <div
            ref="leftbarWrapper"
            class="gantt-leftbar-wrapper"
            :style="{
              width: titleWidth + 'px',
              height: `calc(100% + ${scrollXBarHeight}px)`
            }"
          >
            <LeftBar
              :datas="datas"
              :dataKey="dataKey"
              :scrollTop="scrollTop"
              :heightOfBlocksWrapper="heightOfBlocksWrapper"
              :cellHeight="cellHeight"
              :preload="preload"
              :style="{ height: totalHeight + scrollXBarHeight + 'px' }"
            >
              <template v-slot="{ data }">
                <slot name="left" :data="data"> </slot>
              </template>
            </LeftBar>
          </div>
          <div
            ref="blocksWrapper"
            class="gantt-blocks-wrapper"
            @mousedown="(e) => (enableGrab ? mouseDownHandle(e) : noop)"
            @mouseup="(e) => (enableGrab ? mouseUpHandle(e) : noop)"
          >
            <blocks
              :scrollTop="scrollTop"
              :scrollLeft="scrollLeft"
              :heightOfBlocksWrapper="heightOfBlocksWrapper"
              :widthOfBlocksWrapper="widthOfBlocksWrapper"
              :arrayKeys="arrayKeys"
              :itemKey="itemKey"
              :dataKey="dataKey"
              :datas="datas"
              :cellWidth="cellWidth"
              :cellHeight="cellHeight"
              :scale="scale"
              :getPositonOffset="getPositonOffset"
              :getWidthAbout2Times="getWidthAbout2Times"
              :customGenerateBlocks="customGenerateBlocks"
              :startTimeOfRenderArea="startTimeOfRenderArea"
              :endTimeOfRenderArea="endTimeOfRenderArea"
              :preload="preload"
              :style="{ width: totalWidth + 'px' }"
            >
              <template v-if="!customGenerateBlocks" v-slot="{ data, item }">
                <slot name="block" :data="data" :item="item"> </slot>
              </template>
              <template
                v-else
                v-slot="{
                  data,
                  getPositonOffset,
                  getWidthAbout2Times,
                  isInRenderingTimeRange,
                  isAcrossRenderingTimeRange
                }"
              >
                <slot
                  name="block"
                  :data="data"
                  :getPositonOffset="getPositonOffset"
                  :getWidthAbout2Times="getWidthAbout2Times"
                  :isInRenderingTimeRange="isInRenderingTimeRange"
                  :isAcrossRenderingTimeRange="isAcrossRenderingTimeRange"
                  :startTimeOfRenderArea="startTimeOfRenderArea"
                  :endTimeOfRenderArea="endTimeOfRenderArea"
                ></slot>
              </template>
            </blocks>
          </div>
        </div>
      </div>
    </div>

    <div
      ref="scrollYBar"
      class="gantt-scroll-y"
      :style="{
        width: `${scrollYBarWidth}px`,
        height: `calc(100% - ${actualHeaderHeight}px`,
        marginTop: `${actualHeaderHeight}px`
      }"
      @scroll.passive="syncScrollY"
    >
      <div :style="{ height: totalHeight + 'px' }"></div>
    </div>

    <div
      ref="scrollXBar"
      class="gantt-scroll-x"
      :style="{
        height: `${scrollXBarHeight}px`,
        width: `calc(100% - ${titleWidth}px )`,
        marginLeft: titleWidth + 'px'
      }"
      @scroll.passive="syncScrollX"
    >
      <div :style="{ width: totalWidth + 'px' }"></div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import ResizeObserver from "resize-observer-polyfill";
import {
  scaleList,
  isDayScale,
  getBeginTimeOfTimeLine,
  calcScalesAbout2Times
} from "./utils/timeLineUtils.js";
import { isDef, debug, error, noop } from "./utils/tool.js";
import {
  getPositonOffset as _getPositonOffset,
  getWidthAbout2Times as _getWidthAbout2Times
} from "./utils/gtUtils.js";
import throttle from "./utils/throttle.js";
import Timeline from "./components/time-line/index.vue";
import CurrentTime from "./components/mark-line/current-time.vue";
import LeftBar from "./components/left-bar/index.vue";
import Blocks from "./components/blocks/index.vue";
import MarkLine from "./components/mark-line/index.vue";

export default {
  name: "Gantt",

  components: { Timeline, LeftBar, Blocks, MarkLine, CurrentTime },

  props: {
    startTime: {
      default: () => dayjs(),
      validator(date) {
        const ok = dayjs(date).isValid();
        if (!ok) error(`Invalid startTime ${date}`);
        return ok;
      }
    },
    endTime: {
      default: () => dayjs(),
      validator(date) {
        const ok = dayjs(date).isValid();
        if (!ok) error(`Invalid endTime ${date}`);
        return ok;
      }
    },
    enableGrab: {
      type: Boolean,
      default: true
    },
    cellWidth: {
      type: Number,
      default: 50
    },
    cellHeight: {
      type: Number,
      default: 20
    },
    titleHeight: {
      type: Number,
      default: 40
    },
    titleWidth: {
      type: Number,
      default: 200
    },
    scale: {
      type: Number,
      default: 60,
      validator(value) {
        return scaleList.includes(value) || isDayScale(value);
      }
    },
    datas: {
      type: Array,
      default: () => []
    },
    dataKey: {
      type: String,
      default: undefined
    },
    itemKey: {
      type: String,
      default: undefined
    },
    arrayKeys: {
      type: Array,
      default: () => []
    },
    showCurrentTime: {
      type: Boolean,
      default: false
    },
    timeLines: {
      type: Array
    },
    scrollToTime: {
      validator(date) {
        return dayjs(date).isValid();
      }
    },
    scrollToPostion: {
      validator(obj) {
        const validX = isDef(obj.x) ? !Number.isNaN(obj.x) : true;
        const validY = isDef(obj.y) ? !Number.isNaN(obj.y) : true;
        if (!validX && !validY) {
          debug("scrollToPostion x or y are invalid (other than number)");
          return false;
        }
        return true;
      }
    },
    hideHeader: {
      type: Boolean,
      default: false
    },
    hideXScrollBar: {
      type: Boolean,
      default: false
    },
    hideYScrollBar: {
      type: Boolean,
      default: false
    },
    customGenerateBlocks: {
      type: Boolean,
      default: false
    },
    timeRangeCorrection: {
      type: Boolean,
      default: true
    },
    preload: {
      type: Number
    }
  },

  data() {
    return {
      //缓存节点
      selector: {
        gantt_leftbar: {},
        gantt_table: {},
        gantt_scroll_y: {},
        gantt_timeline: {},
        gantt_scroll_x: {},
        gantt_markArea: {}
      },
      scrollTop: 0,
      scrollLeft: 0,
      //block 区域需要渲染的范围
      //先渲染出空框架，在mounted后再得到真实的渲染范围，然后在根据范围渲染数据，比之前设置一个默认高度宽度，额外的渲染浪费更少了
      heightOfBlocksWrapper: 0,
      widthOfBlocksWrapper: 0,
      scrollBarWitdh: 17,
      dayjs,
      noop,
      preTouchPosition: {
        x: 0,
        y: 0
      }
    };
  },

  computed: {
    start() {
      return dayjs(this.startTime);
    },
    end() {
      const {
        start,
        widthOfBlocksWrapper,
        scale,
        cellWidth,
        timeRangeCorrection
      } = this;
      let end = dayjs(this.endTime);
      const totalWidth = calcScalesAbout2Times(start, end, scale) * cellWidth;
      // 时间纠正和补偿
      if (
        timeRangeCorrection &&
        (start.isAfter(end) || totalWidth <= widthOfBlocksWrapper)
      ) {
        end = getBeginTimeOfTimeLine(start, scale).add(
          (widthOfBlocksWrapper / cellWidth) * scale,
          "minute"
        );
      }
      return end;
    },
    totalWidth() {
      const { cellWidth, totalScales } = this;
      return cellWidth * totalScales;
    },
    totalScales() {
      const { start, end, scale } = this;
      return calcScalesAbout2Times(start, end, scale);
    },
    totalHeight() {
      const { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    beginTimeOfTimeLine() {
      const value = getBeginTimeOfTimeLine(this.start, this.scale);
      return value;
    },
    beginTimeOfTimeLineToString() {
      return this.beginTimeOfTimeLine.toString();
    },
    availableScrollLeft() {
      // 不减这个1，滚动到时间轴尽头后继续滚动会慢慢的溢出
      const { totalWidth, widthOfBlocksWrapper } = this;
      return totalWidth - widthOfBlocksWrapper - 1;
    },
    availableScrollTop() {
      const { totalHeight, heightOfBlocksWrapper } = this;
      return totalHeight - heightOfBlocksWrapper - 1;
    },
    scrollXBarHeight() {
      return this.hideXScrollBar ? 0 : this.scrollBarWitdh;
    },
    scrollYBarWidth() {
      return this.hideYScrollBar ? 0 : this.scrollBarWitdh;
    },
    actualHeaderHeight() {
      return this.hideHeader ? 0 : this.titleHeight;
    },
    startTimeOfRenderArea() {
      if (this.heightOfBlocksWrapper === 0) {
        return;
      }
      const { beginTimeOfTimeLine, scrollLeft, cellWidth, scale } = this;

      return beginTimeOfTimeLine
        .add((scrollLeft / cellWidth) * scale, "minute")
        .toDate()
        .getTime();
    },
    endTimeOfRenderArea() {
      if (this.heightOfBlocksWrapper === 0) {
        return;
      }
      const {
        beginTimeOfTimeLine,
        scrollLeft,
        cellWidth,
        scale,
        widthOfBlocksWrapper,
        totalWidth
      } = this;

      const renderWidth =
        totalWidth < widthOfBlocksWrapper ? totalWidth : widthOfBlocksWrapper;

      return beginTimeOfTimeLine
        .add(((scrollLeft + renderWidth) / cellWidth) * scale, "minute")
        .toDate()
        .getTime();
    }
  },

  watch: {
    scrollToTime: {
      handler(newV) {
        this.scrollToTimehandle(newV);
      },
      immediate: true
    },
    scrollToPostion: {
      handler(newV) {
        this.scrollToPositionHandle(newV);
      },
      immediate: true
    }
  },

  mounted() {
    this.cacheSelector();
    // 计算准确的渲染区域范围
    const observeContainer = throttle((entries) => {
      entries.forEach((entry) => {
        const cr = entry.contentRect;
        this.heightOfBlocksWrapper = cr.height;
        this.widthOfBlocksWrapper = cr.width;
      });
    });
    const observer = new ResizeObserver(observeContainer);
    observer.observe(this.$refs.blocksWrapper);
    this.$once("hook:beforeDestroy", () => {
      observer.disconnect();
      this.releaseSelector();
    });
  },

  methods: {
    scrollToTimehandle(newV) {
      if (!newV) {
        return;
      }
      const { start, end } = this;
      const time = dayjs(newV);
      if (!(time.isAfter(start) && time.isBefore(end))) {
        debug(
          `The current scroll to ${newV} is not within the bounds of ${start} and ${end}`
        );
        return;
      }
      const offset = this.getPositonOffset(newV);
      this.$nextTick(() => {
        this.manualScroll(offset);
      });
    },
    scrollToPositionHandle(newV) {
      if (!newV) {
        return;
      }
      const x = Number.parseFloat(newV.x);
      const y = Number.parseFloat(newV.y);
      if (!Number.isNaN(x) && x !== this.scrollLeft) {
        this.$nextTick(() => {
          this.manualScroll(x);
        });
      }
      if (!Number.isNaN(y) && y !== this.scrollTop) {
        this.$nextTick(() => {
          this.manualScroll(undefined, y);
        });
      }
    },
    scrollToPostionHandle(newV) {
      return this.scrollToPositionHandle(newV);
    },
    mouseDownHandle() {
      this.$refs.blocksWrapper.style.cursor = "grabbing";
      this.$refs.blocksWrapper.addEventListener(
        "mousemove",
        this.mouseMoveHandle
      );
    },
    mouseMoveHandle(e) {
      const { movementX, movementY } = e;
      this.wheelHandle({
        deltaX: -movementX,
        deltaY: -movementY
      });
    },
    mouseUpHandle() {
      this.$refs.blocksWrapper.style.cursor = "default";
      this.$refs.blocksWrapper.removeEventListener(
        "mousemove",
        this.mouseMoveHandle
      );
    },
    touchMoveHandle(e) {
      const finger = e.touches[0];
      this.wheelHandle({
        deltaX: this.preTouchPosition.x - finger.screenX,
        deltaY: this.preTouchPosition.y - finger.screenY
      });
      this.preTouchPosition.x = finger.screenX;
      this.preTouchPosition.y = finger.screenY;
    },
    touchStartHandle(e) {
      const finger = e.touches[0];
      this.preTouchPosition.x = finger.screenX;
      this.preTouchPosition.y = finger.screenY;
    },
    touchEndHandle() {
      this.preTouchPosition.x = 0;
      this.preTouchPosition.y = 0;
    },
    getWidthAbout2Times(start, end) {
      const options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };
      return _getWidthAbout2Times(start, end, options);
    },
    /**
     * 为时间线计算偏移
     */
    getPositonOffset(date) {
      const options = {
        scale: this.scale,
        cellWidth: this.cellWidth
      };

      return _getPositonOffset(date, this.beginTimeOfTimeLineToString, options);
    },
    //缓存节点
    cacheSelector() {
      this.selector.gantt_leftbar = this.$refs.leftbarWrapper;
      this.selector.gantt_table = this.$refs.blocksWrapper;
      this.selector.gantt_scroll_y = this.$refs.scrollYBar;
      this.selector.gantt_timeline = this.$refs.headerTimeline;
      this.selector.gantt_scroll_x = this.$refs.scrollXBar;
      this.selector.gantt_markArea = this.$refs.marklineArea;
    },
    releaseSelector() {
      let key;
      for (key in this.selector) {
        this.selector[key] = null;
      }
    },
    wheelHandle(event) {
      const { deltaX, deltaY } = event;
      const {
        scrollTop,
        scrollLeft,
        availableScrollLeft,
        availableScrollTop
      } = this;

      if (deltaY !== 0) {
        if (
          scrollTop + deltaY >= availableScrollTop &&
          scrollTop !== availableScrollTop
        ) {
          this.manualScroll(undefined, availableScrollTop);
        } else if (scrollTop + deltaY < 0 && scrollTop !== 0 /*滚动为0限制*/) {
          this.manualScroll(undefined, 0);
        } else {
          this.manualScroll(undefined, scrollTop + deltaY);
        }
      }
      if (deltaX !== 0) {
        if (
          scrollLeft + deltaX >= availableScrollLeft &&
          scrollLeft !== availableScrollLeft
        ) {
          this.manualScroll(availableScrollLeft);
        } else if (
          scrollLeft + deltaX < 0 &&
          scrollLeft !== 0 /*滚动为0限制*/
        ) {
          this.manualScroll(0);
        } else {
          this.manualScroll(scrollLeft + deltaX);
        }
      }
    },
    manualScroll(x, y) {
      if (x != undefined) {
        this.selector.gantt_scroll_x.scrollLeft = x;
      }
      if (y != undefined) {
        this.selector.gantt_scroll_y.scrollTop = y;
      }
    },
    //同步fixleft和block的滚动
    syncScrollY(event) {
      const { gantt_leftbar, gantt_table } = this.selector;
      const topValue = event.target.scrollTop;
      this.scrollTop = gantt_table.scrollTop = gantt_leftbar.scrollTop = topValue;
      this.$emit("scrollTop", topValue);
    },
    syncScrollX(event) {
      const { gantt_table, gantt_timeline, gantt_markArea } = this.selector;
      const leftValue = event.target.scrollLeft;
      this.scrollLeft = gantt_timeline.scrollLeft = gantt_table.scrollLeft = leftValue;
      gantt_markArea.style.left = -leftValue + "px";
      this.$emit("scrollLeft", leftValue);
    }
  }
};
</script>

<style lang="scss">
@import "./gantt.scss";
</style>
