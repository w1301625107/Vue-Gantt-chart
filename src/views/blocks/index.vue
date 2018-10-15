<template>
  <div class="gantt-blocks"
       :style="{height:totalHeight+'px'}">
    <div class="gantt-block gantt-block-top-space"
         :style="{height:calTopSpace()+'px'}">
    </div>
    <div class="gantt-block"
         v-for="(data,index) in showDatas"
         :key="index">
      <div v-show="showPlan"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Planned"
                 :key="index"
                 class="plan"
                 @click="blockClick(item)"
                 @dblclick="dbBlockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}">{{data.name}}{{item.start.format("HH:mm:ss")}}</div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}"></div>
          </div>
        </div>
      </div>
      <div v-show="showProject"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Projected"
                 :key="index"
                 class="project"
                 @click="blockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}"></div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}"></div>
          </div>
        </div>
      </div>
      <div v-show="showActual"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Actual"
                 :key="index"
                 class="actual"
                 @click="blockClick(item)"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}"></div>
          </div>
          <div class="gantt-block-forbiddens">
            <div v-for="(item,index) in forbidden"
                 :key="index"
                 :style="{width:getBlockwidth(item)+'px',
                   'left':getBlockMargin(item)+'px'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import debounce from "@src/utils/debounce.js";
import {
  updateMarkLineTime,
  updateMarkLineTimeEnd
} from "@src/store/mutation-type.js";
import jquery from "jquery";
import "jquery-ui/ui/widgets/draggable";
import "jquery-ui/ui/widgets/resizable";
import "jquery-ui/themes/base/resizable.css";
import "jquery-ui/themes/base/draggable.css";
import { calcBlockwidth, calcBlockMargin } from "@src/utils/calc-margin.js";
export default {
  name: "Blocks",
  props: {
    scrollTop: Number
  },
  data() {
    return {
      showDatas: [],
      containerHeight: 700,
      //去抖
      initBind_: "",
      initHeight_: "",
      //两者避免过多的调用sliceData，造成过多的dom操作
      //上一次加载的节点
      oldCurrentIndex: 0,
      //预加载的数量
      preload: 8
    };
  },
  computed: {
    ...mapState([
      "datas",
      "cellWidth",
      "cellHeight",
      "scale",
      "forbidden",
      "showPlan",
      "showActual",
      "showProject"
    ]),
    ...mapGetters(["startBlockTime", "totalHeight"]),
    blockHeight() {
      let { showActual, showPlan, showProject, cellHeight } = this;
      let rate = 0;
      if (showActual) rate += 1;
      if (showPlan) rate += 1;
      if (showProject) rate += 1;
      return rate * cellHeight;
    },
    currentIndex() {
      return Math.ceil(this.scrollTop / this.blockHeight);
    }
  },
  watch: {
    showDatas() {
      this.initBind_();
    },
    currentIndex(val) {
      let { oldCurrentIndex, preload } = this;
      if (val < oldCurrentIndex - preload || val > oldCurrentIndex + preload) {
        this.oldCurrentIndex = val;
        this.spliceData();
      }
    }
  },
  created() {
    this.spliceData();
    //去抖
    this.initBind_ = debounce(this.initBind);
    this.initHeight_ = debounce(this.getContainerHeight);
  },
  mounted() {
    this.initBind_();
    window.onresize = () => {
      this.initHeight_();
    };
  },
  methods: {
    //获取父级容器的高度
    getContainerHeight() {
      this.containerHeight = document.querySelector(
        ".gantt-table"
      ).parentNode.clientHeight;
    },
    //分割出dom中显示的数据
    spliceData() {
      let { containerHeight, currentIndex, blockHeight, preload } = this;
      let nums = currentIndex + Math.ceil(containerHeight / blockHeight);
      let start = currentIndex - preload >= 0 ? currentIndex - preload : 0;
      this.showDatas = this.datas.slice(start, nums + preload);
    },
    //第一个撑开前置高度的容器块高度
    calTopSpace() {
      let { oldCurrentIndex, blockHeight, preload } = this;
      let start =
        oldCurrentIndex - preload >= 0 ? oldCurrentIndex - preload : 0;
      return start * blockHeight;
    },
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
    blockClick(item) {
      this.$store.commit(updateMarkLineTime, item.start);
      this.$store.commit(updateMarkLineTimeEnd, item.end);
    },
    dbBlockClick(item) {
      alert(item);
    },
    initBind() {
      //可以带一个回调函数参数
      this.bindBlockResize();
      this.bindBlockDrag();
    }, //以下绑定事件
    bindBlockResize(callback) {
      let borderSize = 0;
      let prev; //前一个兄弟节点
      let next; //后一个兄弟节点
      let self; //自身
      //记录碰撞时的最大width
      let maxWidth = null;
      let hitLeft = false;
      //锁定碰撞时的数据
      let lock = false;
      let maxLeftMargin = null; //null代表不限制
      let minLeftMargin = null;
      jquery(".gantt-block-blocks>div").resizable({
        handles: "e,w",
        //containment: "parent",
        start() {
          prev = jquery(this).prev()[0] ? jquery(jquery(this).prev()[0]) : null;
          next = jquery(this).next()[0] ? jquery(jquery(this).next()[0]) : null;
          self = jquery(this);
          if (prev) {
            let pleft = parseFloat(prev.css("left")) || 0;
            let pTwidth = parseFloat(prev.outerWidth()) + borderSize;
            minLeftMargin = pleft + pTwidth;
          } else {
            minLeftMargin = null;
          }
          if (next) {
            let nleft = parseFloat(next.css("left")) || 0;
            maxLeftMargin = nleft;
          } else {
            maxLeftMargin = null;
          }
        },
        resize(event, ui) {
          let { left = 0 } = ui.position;
          let { width } = ui.size;
          let hit = false;
          if (minLeftMargin) {
            if (left < minLeftMargin) {
              console.log("left hit");
              hit = true;
              hitLeft = true;
            }
          }
          if (maxLeftMargin) {
            //计算右边是否碰撞
            if (left + width + borderSize > maxLeftMargin) {
              console.log("right hit");
              hit = true;
              hitLeft = false;
            }
          }
          if (hit) {
            if (!lock) {
              if (hitLeft) {
                maxWidth =
                  ui.originalPosition.left +
                  ui.originalSize.width -
                  minLeftMargin;
              } else {
                maxWidth =
                  maxLeftMargin - ui.originalPosition.left - borderSize;
              }
              lock = true;
            }
            //修正左缩放的位置
            if (hitLeft) {
              let fixRight = minLeftMargin - left;
              self.css("margin-left", fixRight);
            }
            event.preventDefault();
            //TOFIXED：固定最大宽度，因为event.preventDefault()不起暂停作用
            self.css("max-width", maxWidth);
          } else {
            //重置修正
            self.css("max-width", "");
            self.css("margin-left", "");
            maxWidth = null;
            lock = false;
          }
        },
        stop() {
          if (maxWidth) {
            self.width(maxWidth);
            if (hitLeft) {
              self.css("left", minLeftMargin);
            }
          }
          //重置修正
          self.css("max-width", "");
          self.css("margin-left", "");
          maxWidth = null;
          lock = false;
          if (callback) {
            callback(self);
          }
        }
      });
    },
    bindBlockDrag(callback) {
      let borderSize = 0;
      let prev; //前一个兄弟节点
      let next; //后一个兄弟节点
      let self; //自身
      let maxLeftMargin = 0; //null值代表不限制
      let minLeftMargin = 0;
      jquery(".gantt-block-blocks>div").draggable({
        axis: "x",
        scroll: true,
        //containment: "parent",
        start() {
          prev = jquery(this).prev()[0] ? jquery(jquery(this).prev()[0]) : null;
          next = jquery(this).next()[0] ? jquery(jquery(this).next()[0]) : null;
          self = jquery(this);
          if (prev) {
            let pleft = parseFloat(prev.css("left")) || 0;
            let pTwidth = parseFloat(prev.outerWidth()) + borderSize;
            console.log(pleft, pTwidth);
            minLeftMargin = pleft + pTwidth;
          } else {
            minLeftMargin = null;
          }
          if (next) {
            let nleft = parseFloat(next.css("left")) || 0;
            maxLeftMargin = nleft;
          } else {
            maxLeftMargin = null;
          }
          console.log(minLeftMargin, maxLeftMargin);
        },
        drag(event, ui) {
          let { left = 0 } = ui.position;
          let width = self.outerWidth();
          let hit = false;
          let hitLeft = false;
          //计算左边是否碰撞
          if (minLeftMargin) {
            if (left < minLeftMargin) {
              console.log("left hit");
              hit = true;
              hitLeft = true;
            }
          }
          //计算右边是否碰撞
          if (maxLeftMargin) {
            if (left + width + borderSize > maxLeftMargin) {
              console.log("right hit");
              hit = true;
            }
          }
          if (hit) {
            event.preventDefault();
            //因为获取的left不准，需要手动修正
            let fixLeft;
            if (hitLeft) {
              fixLeft = minLeftMargin;
            } else {
              fixLeft = maxLeftMargin - width - borderSize;
            }
            self.css("left", fixLeft);
          }
        },
        stop() {
          if (callback) {
            callback(self);
          }
        }
      });
    }
  }
};
</script>