<template>
  <div id="app">
    <header class="top-bar">
      <el-form :inline="true" size="small">
        <el-form-item label="Vue-Gantt-Chart">
          <el-date-picker
            v-model="times"
            size="small"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:300px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="行数">
          <el-input
            v-model.number="rowNum"
            size="small"
            style="width:60px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="块数">
          <el-input
            v-model.number="colNum"
            size="small"
            style="width:60px"
            placeholder=""
          ></el-input>
        </el-form-item>
        <el-form-item label="cellHeight">
          <el-slider
            v-model="cellHeight"
            :min="20"
            :max="100"
            style="width:60px"
            size="small"
          ></el-slider>
        </el-form-item>
        <el-form-item label="cellWidth">
          <el-slider
            v-model="cellWidth"
            :min="20"
            :max="100"
            style="width:60px"
            size="small"
          ></el-slider>
        </el-form-item>
        <el-form-item label="scale">
          <el-select
            v-model="scale"
            placeholder=""
            style="width:80px"
            size="small"
          >
            <el-option
              v-for="item in scaleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="hideHeader">hideHeader</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="hideSecondGantt">hideSecondGantt</el-checkbox>
        </el-form-item>
      </el-form>
    </header>
    <div class="container">
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
        :dataKey="dataKey"
        :arrayKeys="arrayKeys"
        :scrollToPostion="positionA"
        @scrollLeft="scrollLeftA"
        :datas="datasA"
      >
        <template v-slot:block="{ data, item }">
          <Test
            :data="data"
            :updateTimeLines="updateTimeLines"
            :cellHeight="cellHeight"
            :currentTime="currentTime"
            :item="item"
          ></Test>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data"></TestLeft>
        </template>
        <!-- <template v-slot:timeline="{ day , getTimeScales }">
          <TestTimeline :day="day" :getTimeScales="getTimeScales"></TestTimeline>
        </template> -->
        <template v-slot:title>铁胆火车侠日程表 </template>
      </v-gantt-chart>
      <v-gantt-chart
        v-if="!hideSecondGantt"
        :startTime="times[0]"
        :endTime="times[1]"
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
        :datas="datasB"
      >
        <template
          v-slot:block="{
            data,
            getPositonOffset,
            getWidthAbout2Times,
            isInRenderingTimeRange,
            startTimeOfRenderArea,
            endTimeOfRenderArea,
            isAcrossRenderingTimeRange
          }"
        >
          <div
            class="gantt-block-item"
            v-for="(item, index) in data.gtArray"
            v-if="
              isInRenderingTimeRange(item.start) ||
                isInRenderingTimeRange(item.end) ||
                isAcrossRenderingTimeRange(item.start, item.end)
            "
            :key="item.id"
            :style="{
              left: getPositonOffset(item.start) + 'px',
              width: getWidthAbout2Times(item.start, item.end) + 'px'
            }"
          >
            <Test
              :data="data"
              :updateTimeLines="updateTimeLines"
              :cellHeight="cellHeight"
              :currentTime="currentTime"
              :item="item"
            ></Test>
          </div>
        </template>
        <template v-slot:left="{ data }">
          <TestLeft :data="data"></TestLeft>
        </template>
        <template v-slot:title>
          铁胆火车侠日程表
        </template>
      </v-gantt-chart>
    </div>
    <footer class="main-footer">
      MIT ©wuchouchou<span style="float:right"
        >注:该demo由两个甘特组件组合而成</span
      >
    </footer>
  </div>
</template>

<script>
import Test from "./components/test.vue"
import TestLeft from "./components/test-left.vue"
import TestTimeline from "./components/test-timeline.vue"
import { mockDatas } from "./mock/index.js"
import dayjs from "dayjs"

const scaleList = `1,2,3,4,5,6,10,12,15,20,30,60,120,180,240,360,720,1440,2880,4320`
  .split(",")
  .map(n => {
    let value = parseInt(n)
    let label
    if(value<60){
        label=value+'minute'
    }else if(value>=60 && value< 1440){
        label=value/60+'hour'
    }else{
      label = value/1440 +'day'
    }
    return {
      value,
      label
    }
  })
export default {
  name: "App",
  components: { Test, TestLeft,TestTimeline },
  data() {
    return {
      timeLines: [
        {
          time: dayjs()
            .add(2, "hour")
            .toString()
        },
        {
          time: dayjs()
            .add(5, "hour")
            .toString(),
          color: "#747e80"
        }
      ],
      currentTime: dayjs(),
      cellWidth: 100,
      cellHeight: 30,
      titleHeight: 40,
      titleWidth: 250,
      scale: 60,
      times: [
        dayjs()
          .subtract(5, "hour")
          .toString(),
        dayjs()
          .add(29, "day")
          .add(2, "hour")
          .toString()
      ],
      rowNum: 100,
      colNum: 10,
      datasA: [],
      datasB: [],
      dataKey: "id",
      scaleList: scaleList,
      scrollToTime: dayjs()
        .add(1, "day")
        .toString(),
      scrollToPostion: { x: 10000, y: 10000 },
      hideHeader: false,
      hideSecondGantt: false,
      arrayKeys: ["gtArray", "error"],
      scrollToY: 0,
      positionB: {},
      positionA: {}
    };
  },
  watch: {
    rowNum: "updateData",
    colNum: "updateData",
    times: "updateData",
    scrollToY(val) {
      this.positionA = { x: val };
    }
  },
  mounted() {
    this.updateData();
  },
  methods: {
    updateData() {
      this.datasA = mockDatas(this.rowNum, this.colNum, this.times);
      this.datasB = mockDatas(this.rowNum, this.colNum, this.times);
    },
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
}
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
  height: 40px;
}

.container {
  height: calc(100% - 58px);
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
