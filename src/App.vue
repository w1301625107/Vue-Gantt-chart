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
      <label for="datasNum">datasNum</label>
      <input id="datasNum"
             v-model.number.lazy="datasNum">
      <label for="scale">scale</label>
      <select id="scale"
              v-model.number="scale">
        <option v-for="i in scaleList"
                :key="i">{{i}}</option>
      </select>
      <span>minute</span>
    </header>
    <div :style="{height:'calc(100vh - 30px - 30px)'}">
      <v-gantt-chart :startTime="startTime"
                     :endTime="endTime"
                     :cellWidth="cellWidth"
                     :cellHeight="cellHeight"
                     :timeLines="timeLines"
                     :titleHeight="titleHeight"
                     :scale="scale"
                     :titleWidth="titleWidth"
                     showCurrentTime
                     :dataKey="dataKey"
                     :datas="datas">
        <template v-slot:block="{data,item}">
          <Test :data="data"
                :updateTimeLines="updateTimeLines"
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
    </div>
    <footer class="main-footer">wuchouchou</footer>
  </div>
</template>

<script>
import Test from "./test.vue";
import TestLeft from "./test-left.vue";
import { mockDatas } from "@src/mock/index.js";
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
            .format("YYYY-MM-DD HH:mm:ss")
        },
        {
          time: moment()
            .add(5, "h")
            .format("YYYY-MM-DD HH:mm:ss"),
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
      datas: mockDatas(100),
      dataKey: "id",
      scaleList: scaleList,
      scrollToTime: moment()
        .add(1, "d")
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 }
    };
  },
  watch: {
    datasNum(newV, oldV) {
      this.datas = mockDatas(newV);
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
    }
  }
};
</script>

<style scoped>
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
</style>