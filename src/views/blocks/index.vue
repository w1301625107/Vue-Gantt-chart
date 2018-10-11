<template>
  <div class="gantt-blocks">
    <div class="gantt-block"
         v-for="(data,index) in datas"
         :key="index">
      <div v-show="showPlan"
           class=" gantt-cell-height">
        <div class="gantt-block-container">
          <div class="gantt-block-blocks">
            <div v-for="(item,index) in data.Planned"
                 :key="index"
                 class="plan"
                 @click="blockClick(item)"
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
  computed: {
    ...mapState([
      "datas",
      "cellWidth",
      "scale",
      "forbidden",
      "showPlan",
      "showActual",
      "showProject"
    ]),
    ...mapGetters(["startBlockTime"])
  },
  watch: {
    datas() {
      this.initBind();
    }
  },
  mounted() {
    this.initBind();
  },
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
    blockClick(item) {
      this.$store.commit(updateMarkLineTime, item.start);
      this.$store.commit(updateMarkLineTimeEnd, item.end);
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