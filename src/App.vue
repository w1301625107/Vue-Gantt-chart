<template>
  <div id="app">
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
import moment from 'moment'
import Gantt from "@views/gantt.vue";
export default {
  name: "App",
  components: { Gantt },
  data() {
    return {
      markLineTime: moment(),
      markLineTimeEnd: moment(),
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
      datas: mockDatas(100)
    };
  }
};
</script>

