<template>
  <div class="gantt-chart"
       @wheel="wheelHandle">
    <div v-show="!hideHeader"
         class="gantt-header">
      <div class="gantt-header-title"
           :style="{'line-height':titleHeight+'px',height:titleHeight+'px','max-width':titleWidth+'px','min-width':titleWidth+'px'}">
        <slot name="title">welcome v-gantt-chart</slot>
      </div>
      <div ref="headerTimeline"
           class="gantt-header-timeline">
        <timeline :start="start"
                  :end="end"
                  :cellWidth="cellWidth"
                  :titleHeight="titleHeight"
                  :scale="scale"
                  :style="{width:totalWidth+'px'}">
        </timeline>
      </div>
    </div>
    <div class="gantt-body"
         :style="{height:`calc(100% - ${hideHeader ? 0 : titleHeight}px)`}">
      <div class="gantt-table"
           :style="{height:`calc(100% - ${hideXScrollBar ? 0 : scrollBarWitdh}px)`,width:`calc(100% - ${hideYScrollBar ? 0 : scrollBarWitdh}px)`}">
        <div ref="marklineArea"
             class="gantt-markline-area">
          <CurrentTime v-if="showCurrentTime"
                       :getTimeLinePosition="getTimeLinePosition" />
          <mark-line v-for="(times,index) in timeLines"
                     :key="index"
                     :markLineTime="times.time"
                     :getTimeLinePosition="getTimeLinePosition"
                     :color="times.color"></mark-line>
        </div>
        <div ref="leftbarWrapper"
             class="gantt-leftbar-wrapper"
             :style="{'max-width':titleWidth+'px','min-width':titleWidth+'px'}">
          <LeftBar :datas="datas"
                   :dataKey="dataKey"
                   :scrollTop="scrollTop"
                   :heightOfRenderAera="heightOfRenderAera"
                   :widthOfRenderAera="widthOfRenderAera"
                   :cellHeight="cellHeight"
                   :style="{height:totalHeight+'px'}">
            <template v-slot="{data}">
              <slot name="left"
                    :data="data">
                <div class="gantt-leftbar-defalutItem"></div>
              </slot>
            </template>
          </LeftBar>
        </div>
        <div ref="blocksWrapper"
             class="gantt-blocks-wrapper">
          <blocks :scrollTop="scrollTop"
                  :scrollLeft="scrollLeft"
                  :heightOfRenderAera="heightOfRenderAera"
                  :widthOfRenderAera="widthOfRenderAera"
                  :arrayKeys="arrayKeys"
                  :itemKey="itemKey"
                  :dataKey="dataKey"
                  :datas="datas"
                  :cellWidth="cellWidth"
                  :cellHeight="cellHeight"
                  :scale="scale"
                  :beginTimeOfTimeLine="beginTimeOfTimeLine"
                  :style="{width:totalWidth+'px'}">
            <template v-slot="{data,item}">
              <slot name="block"
                    :data="data"
                    :item="item">
                <div class="gantt-block-defaultBlock"></div>
              </slot>
            </template>
          </blocks>
        </div>
      </div>
      <div ref="scrollXBar"
           class="gantt-scroll-y"
           :style="{width:`${hideYScrollBar? 0 : scrollBarWitdh}px`}"
           @scroll="syncScrollY">
        <div :style="{height:totalHeight+'px'}"></div>
      </div>
      <div ref="scrollYBar"
           class="gantt-scroll-x"
           :style="{height:`${hideXScrollBar? 0 : scrollBarWitdh}px`}"
           @scroll="syncScrollX">
        <div :style="{width:totalWidth+'px'}"></div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import ResizeObserver from 'resize-observer-polyfill';
import {
  scaleList,
  getBeginTimeOfTimeLine,
  calcScalesAbout2Times
} from "./utils/timeLineUtils.js";
import { isUndef, isDef, warn } from "./utils/tool.js";
import { getPositonOffset } from "./utils/gtUtils.js";
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
      required: true,
      validator(date) {
        let ok = moment(date).isValid()
        if(!ok) warn(`非法的开始时间 ${date}`)
        return ok;
      }
    },
    endTime: {
      required: true,
      validator(date) {
        let ok = moment(date).isValid()
        if(!ok) warn(`非法的结束时间 ${date}`)
        return ok;
      }
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
        return scaleList.includes(value);
      }
    },
    datas: {
      type: Array,
      required: true
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
        return moment(date).isValid();
      }
    },
    scrollToPostion: {
      validator(obj) {
        let validX = isDef(obj.x) ? !Number.isNaN(obj.x) : true;
        let validY = isDef(obj.y) ? !Number.isNaN(obj.y) : true;
        if (!validX && !validY) {
          warn("scrollToPostion x或y 有值为非Number类型");
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
      //block 区域需要渲染的宽度
      heightOfRenderAera: window.screen.availHeight,
      widthOfRenderAera: window.screen.availWidth,
      scrollBarWitdh: 17,
    };
  },
  computed: {
    start() {
      return moment(this.startTime);
    },
    end() {
      return moment(this.endTime);
    },
    totalWidth() {
      let { cellWidth, totalScales } = this;
      return cellWidth * totalScales;
    },
    totalScales() {
      let { start, end, scale } = this;
      return calcScalesAbout2Times(start, end, scale);
    },
    totalHeight() {
      let { datas, cellHeight } = this;
      return datas.length * cellHeight;
    },
    beginTimeOfTimeLine() {
      let value = getBeginTimeOfTimeLine(this.start, this.scale);
      return value;
    },
    avialableScrollLeft() {
      // 不减这个1，滚动到时间轴尽头后继续滚动会慢慢的溢出
      let { totalWidth, widthOfRenderAera, titleWidth } = this;
      return totalWidth - widthOfRenderAera - titleWidth - 1;
    }
  },
  watch: {
    cellWidth() {
      this.resetCss();
    },
    cellHeight() {
      this.resetCss();
    },
    scrollToTime: {
      handler(newV) {
        if (!newV) {
          return;
        }
        let { start, end, beginTimeOfTimeLine, scale, cellWidth } = this;
        let time = moment(newV);
        if (!(time.isAfter(start) && time.isBefore(end))) {
          warn(`当前滚动至${newV}不在${start}和${end}的范围之内`);
          return;
        }

        let options = {
          cellWidth,
          scale
        };

        let offset = getPositonOffset(
          newV,
          beginTimeOfTimeLine.toString(),
          options
        );
        // immediate 会造成dom 还没有挂载时就进行操作，故需要延迟执行
        this.$nextTick(() =>
          this.syncScrollX(
            {
              target: {
                scrollLeft: offset
              }
            },
            true
          )
        );
      },
      immediate: true
    },
    scrollToPostion: {
      handler(newV) {
        if (!newV) {
          return;
        }
        let x = Number.isNaN(newV.x) ? undefined : newV.x;
        let y = Number.isNaN(newV.y) ? undefined : newV.y;
        this.$nextTick(() => {
          if (isDef(x) && x !== this.scrollLeft) {
            this.syncScrollX({ target: { scrollLeft: x } }, true);
          }
          if (isDef(y) && y !== this.scrollTop) {
            this.syncScrollY({ target: { scrollTop: y } }, true);
          }
        });
      },
      immediate: true
    },
    scrollTop(val) {
      this.$emit("scrollTop", val);
    },
    scrollLeft(val) {
      this.$emit("scrollLeft", val);
    }
  },
  created() {
  },
  mounted() {
    this.resetCss();
    this.getSelector();
    const observeContainer = throttle(entries => {
      entries.forEach(entry => {
        const cr = entry.contentRect;
        this.heightOfRenderAera = cr.height;
        this.widthOfRenderAera = cr.width;
      })
    })
    const observer = new ResizeObserver(observeContainer)
    observer.observe(this.$refs.blocksWrapper)
  },
  methods: {
     /**
     * 为时间线计算偏移
     */
    getTimeLinePosition(date) {
      let { cellWidth, scale, beginTimeOfTimeLine, titleWidth } = this;
      let options = {
        cellWidth,
        scale
      };

      return (
        getPositonOffset(date, beginTimeOfTimeLine.toString(), options) +
        titleWidth
      );
    },
    //缓存节点
    getSelector() {
      this.selector.gantt_leftbar = this.$refs.leftbarWrapper;
      this.selector.gantt_table = this.$refs.blocksWrapper;
      this.selector.gantt_scroll_y = this.$refs.scrollXBar;
      this.selector.gantt_timeline = this.$refs.headerTimeline;
      this.selector.gantt_scroll_x = this.$refs.scrollYBar;
      this.selector.gantt_markArea = this.$refs.marklineArea;
    },
    wheelHandle(event) {
      let { deltaX, deltaY } = event;
      this.$nextTick(() => {
        if (deltaY != 0) {
          this.syncScrollY(
            { target: { scrollTop: this.scrollTop + deltaY } },
            true
          );
        }
        if (deltaX != 0) {
          if (
            this.scrollLeft + deltaX >=
            this.avialableScrollLeft /*超出滚动限制*/
          ) {
            return;
          }
          if (this.scrollLeft + deltaX < 0 /*滚动为0限制*/) {
            this.syncScrollX({ target: { scrollLeft: 0 } }, true);
          } else {
            this.syncScrollX(
              { target: { scrollLeft: this.scrollLeft + deltaX } },
              true
            );
          }
        }
      });
    },
    //同步fixleft和block的滚动
    syncScrollY(event, fake = false) {
      let { gantt_leftbar, gantt_table, gantt_scroll_y } = this.selector;
      let topValue = event.target.scrollTop;
      if (fake) {
        gantt_scroll_y.scrollTop = topValue; //会触发一次真的滚动事件，避免重复触发
        return;
      }
      gantt_leftbar.scrollTop = topValue;
      gantt_table.scrollTop = topValue;
      this.scrollTop = topValue;
    },
    syncScrollX(event, fake = false) {
      let {
        gantt_table,
        gantt_timeline,
        gantt_markArea,
        gantt_scroll_x
      } = this.selector;
      let leftValue = event.target.scrollLeft;
      if (fake) {
        gantt_scroll_x.scrollLeft = leftValue; //会触发一次真的滚动事件，避免重复触发
        return;
      }
      gantt_table.scrollLeft = leftValue;
      gantt_timeline.scrollLeft = leftValue;
      gantt_markArea.style.left = "-" + leftValue + "px";
      this.scrollLeft = leftValue;
    },
    //修改gantt-cell-height和gantt-cell-height样式数值
    resetCss() {
      let style = document.getElementById("gantt-cell-style");
      let { cellWidth, cellHeight } = this;
      let innerText = `.gantt-cell-width{width:${cellWidth}px;}
        .gantt-cell-height{height:${cellHeight}px;}
        .gantt-block{background-size: ${cellWidth}px ${cellHeight}px;`;
      if (null == style) {
        let style = document.createElement("style");
        style.setAttribute("id", "gantt-cell-style");
        style.setAttribute("type", "text/css");
        style.innerText = innerText;
        document.head.appendChild(style);
      } else {
        style.innerText = innerText;
      }
    }
  }
};
</script>

<style lang="scss">
@import "./gantt.scss";
</style>
