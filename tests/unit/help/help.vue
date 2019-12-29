<template>
  <div id="app" style="width:1000px">
    <v-gantt-chart
      :startTime="times[0]"
      :endTime="times[1]"
      :cellWidth="cellWidth"
      :cellHeight="cellHeight"
      :timeLines="timeLines"
      :titleHeight="titleHeight"
      :scale="scale"
      :titleWidth="titleWidth"
      showCurrentTime
      :hideHeader="hideHeader"
      hideXScrollBar
      hideYScrollBar
      :dataKey="dataKey"
      :arrayKeys="arrayKeys"
      :scrollToPostion="positionA"
      :timeRangeCorrection="timeRangeCorrection"
      @scrollLeft="scrollLeftA"
      :datas="datasA"
    >
    </v-gantt-chart>
  </div>
</template>

<script>
// import { mockDatas } from "../../src/demo/mock/index.js";
import { fakeOneRecord } from "./fakeData";
import dayjs from "dayjs";
import vGanttChart from "../../../src/gantt.vue";
export default {
  name: "App",
  components: { vGanttChart },
  data() {
    return {
      timeLines: [
        {
          time: dayjs().toString()
        },
        {
          time: dayjs()
            .add(5, "hour")
            .toString(),
          color: "#747e80"
        }
      ],
      currentTime: dayjs(),
      cellWidth: 50,
      cellHeight: 30,
      titleHeight: 40,
      titleWidth: 0,
      scale: 60,
      times: [
        "Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)",
        "Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"
      ],
      datasA: fakeOneRecord,
      dataKey: "id",
      scrollToTime: dayjs()
        .add(1, "day")
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      arrayKeys: ["gtArray", "error"],
      positionA: {},
      timeRangeCorrection: true
    };
  },
  watch: {},
  mounted() {},
  methods: {
    scrollLeftA() {}
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
</style>
