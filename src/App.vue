<template>
  <div id="app">
    <header class="top-bar">Vue-Gantt-Chart
      <label for="cellWidth">cellWidth</label>
      <input type="range"
             min="20"
             max="100"
             v-model.number="cellWidth">
      <label for="cellHeight">cellHeight</label>
      <input type="range"
             min="20"
             max="100"
             v-model.number="cellHeight">
      <label for="titleWith">titleWidth</label>
      <input type="range"
             min="0"
             max="250"
             v-model.number="titleWidth">
      <label for="hideHeader">hideHeader</label>
      <input id="hideHeader"
             v-model="hideHeader"
             type="checkbox">
      <label for="datasNum">datasNum</label>
      <input id="datasNum"
             v-model.number.lazy="datasNum">
      <label for="scrollToY">scrollToY</label>
      <input id="scrollToY"
             v-model.number.lazy="scrollToY">
      <label for="scale">scale</label>
      <select id="scale"
              v-model.number="scale">
        <option v-for="i in scaleList"
                :key="i">{{i}}</option>
      </select>
      <span>minute</span>
    </header>
    <div class="container">
      <v-gantt-chart :startTime="startTime"
                     :endTime="endTime"
                     :cellWidth="cellWidth"
                     :cellHeight="cellHeight"
                     :timeLines="timeLines"
                     :titleHeight="titleHeight"
                     :scale="scale"
                     :titleWidth="titleWidth"
                     showCurrentTime
                     :hideHeader="hideHeader"
                     :dataKey="dataKey"
                     :arrayKeys="arrayKeys"
                     :scrollToPostion="positionA"
                     @scrollLeft="scrollLeftA"
                     :datas="datasA">
        <template v-slot:block="{data,item}">
          <Test :data="data"
                :updateTimeLines="updateTimeLines"
                :cellHeight="cellHeight"
                :currentTime="currentTime"
                :item="item"></Test>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data"></TestLeft>
        </template>
        <template v-slot:title>
          铁胆火车侠日程表
        </template>
      </v-gantt-chart>
      <v-gantt-chart :startTime="startTime"
                     :endTime="endTime"
                     :cellWidth="cellWidth"
                     :cellHeight="cellHeight"
                     :timeLines="timeLines"
                     :titleHeight="titleHeight"
                     :scale="scale"
                     :titleWidth="titleWidth"
                     showCurrentTime
                     hideHeader
                     :dataKey="dataKey"
                     :arrayKeys="arrayKeys"
                     :scrollToPostion="positionB"
                     @scrollLeft="scrollLeftB"
                     customGenerateBlocks
                     :datas="datasB">
        <template v-slot:block="{data,getPositonOffset,getWidthAbout2Times,isInRenderingTimeRange}">
          <div class="gantt-block-item"
               v-for="(item,index) in data.gtArray"
               v-if="isInRenderingTimeRange(item.start)||isInRenderingTimeRange(item.end)"
               :key="item.id"
               :style="{left:getPositonOffset(item.start)+'px',width:getWidthAbout2Times(item.start,item.end)+'px'}">
            <Test :data="data"
                  :updateTimeLines="updateTimeLines"
                  :cellHeight="cellHeight"
                  :currentTime="currentTime"
                  :item="item"></Test>
          </div>
        </template>
        <template v-slot:left="{data}">
          <TestLeft :data="data"></TestLeft>
        </template>
        <template v-slot:title>
          铁胆火车侠日程表
        </template>
      </v-gantt-chart>
    </div>
    <footer class="main-footer">MIT ©wuchouchou<span style="float:right">注:该demo由两个甘特组件组合而成</span></footer>
  </div>
</template>

<script>
import Test from "./components/test.vue";
import TestLeft from "./components/test-left.vue";
import { mockDatas } from "../mock/index.js";
import moment from "moment";

const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360,720,1440`
  .split(",")
  .map(n => parseInt(n));
export default {
  name: "App",
  components: { Test, TestLeft },
  data() {
    return {
      timeLines: [
        {
          time: moment()
            .add(2, "h")
            .toString()
        },
        {
          time: moment()
            .add(5, "h")
            .toString(),
          color: "#747e80"
        }
      ],
      currentTime: moment(),
      startTime: moment()
        .subtract(5, "h")
        .toString(),
      endTime: moment()
        .add(2, "d")
        .add(2, "h")
        .add(5, "s")
        .toString(),
      cellWidth: 50,
      cellHeight: 30,
      titleHeight: 40,
      titleWidth: 250,
      scale: 60,
      datasNum: 100,
      datasA: mockDatas(100),
      datasB: mockDatas(100),
      dataKey: "id",
      scaleList: scaleList,
      scrollToTime: moment()
        .add(1, "d")
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ["gtArray", "error"],
      scrollToY: 0,
      positionB: {},
      positionA: {}
    };
  },
  watch: {
    datasNum(newV) {
      this.datasA = mockDatas(newV);
      this.datasB = mockDatas(newV);
    },
    scrollToY(val) {
      this.positionA = { x: val };
    }
  },
  methods: {
    updateTimeLines(timeA, timeB) {
      this.timeLines = [
        {
          time: timeA
        },
        {
          time: timeB,
          color: "#747e80"
        }
      ];
    },
    scrollLeftA(val) {
      this.positionB = { x: val };
    },
    scrollLeftB(val) {
      this.positionA = { x: val };
    }
  }
};
</script>

<style scoped>
body {
  font: 12px;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  height: calc(100vh - 2px);
}

label {
  margin-left: 10px;
}
input {
  width: 40px;
  height: 20px;
  vertical-align: middle;
}
input[type="range"] {
  width: 100px;
}
.top-bar {
  /* height: 30px; */
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.main-footer {
  /* height: 30px; */
}

>>> .el-slider {
  width: 100px;
}
</style>