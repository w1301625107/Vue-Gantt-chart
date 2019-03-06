<template>
  <div id="app">
    <header class="top-bar">Vue-Gantt-Chart
      <label for="cellWidth">cellWidth</label>
      <input id="cellWidth"
             v-model.number.lazy="cellWidth">
      <label for="cellHeight">cellHeight</label>
      <input id="cellHeight"
             v-model.number.lazy="cellHeight">
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
           :titleHeight="titleHeight"
           :scale="scale"
           :titleWidth="titleWidth"
           :datas="datas">
      <template v-slot:block="{data,item}">
        <Test :data="data"
              :item="item"></Test>
      </template>
      <template v-slot:left="{data,item}">
        <TestLeft :item="item"></TestLeft>
      </template>
      <template v-slot:title>
        hola
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
import { scaleList } from "@src/lib/utils/timeLineUtils.js";
import moment from "moment";
export default {
  name: "App",
  components: { Test, TestLeft },
  data() {
    return {
      markLineTime: moment(),
      markLineTimeList: [moment()],
      startTime: moment().toString(),
      endTime: moment()
        .add(2, "d")
        .add(2, "h")
        .add(5, "s").toString(),
      cellWidth: 50,
      cellHeight: 20,
      titleHeight: 40,
      titleWidth: 200,
      scale: 60,
      datasNum: 100,
      datas: mockDatas(100),
      scaleList: scaleList
    };
  },
  watch: {
    datasNum(newV, oldV) {
      this.datas = mockDatas(newV);
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
  vertical-align: bottom;
}
</style>