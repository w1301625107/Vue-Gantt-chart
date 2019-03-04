<template>
  <div id="app">
    <header class="top-bar">Vue-Gantt-Chart
      <label for="cellWidth">cellWidth</label>
      <input id="cellWidth"
             v-model.number.lazy="cellWidth">
      <label for="cellHeight">cellHeight</label>
      <input id="cellHeight"
             v-model.number.lazy="cellHeight">
      <label for="scale">scale</label>
      <select id="scale"
              v-model.number="scale">
        <option v-for="i in scaleList"
                :key="i">{{i}}</option>
      </select>
      <span>minute</span>
    </header>
    <gantt :start="start"
           :end="end"
           :cellWidth="cellWidth"
           :cellHeight="cellHeight"
           :descHeight="descHeight"
           :scale="scale"
           :descWidth="descWidth"
           :datas="datas"></gantt>
    <footer class="main-footer">wuchouchou</footer>
  </div>
</template>

<script>
import { mockDatas } from "@src/mock/index.js";
import {
  scaleList
} from "@src/utils/timeblock.js";
import moment from "moment";
import Gantt from "@views/gantt.vue";
export default {
  name: "App",
  components: { Gantt },
  data() {
    return {
      markLineTime: moment(),
      markLineTimeList: [moment()],
      start: moment(),
      end: moment()
        .add(1, "d")
        .add(2, "h")
        .add(5, "s"),
      cellWidth: 50,
      cellHeight: 20,
      descHeight: 40,
      descWidth: 200,
      scale: 60,
      datas: mockDatas(100),
      scaleList:scaleList
    };
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