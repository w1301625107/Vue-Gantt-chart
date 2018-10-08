import Vue from 'vue'
import Vuex from 'vuex'
import {
  datas
} from '../mock/index.js'
import moment from 'moment'

Vue.use(Vuex)
Vue.config.devtools = true;
export default new Vuex.Store({
  state: {
    showTimeBlock: true,
    showProject: true,
    showPlan: true,
    showActual: true,
    time: moment()
      .add(6, "h")
      .add(5, "s"),
    start: moment(),
    end: moment()
      .add(2, "d")
      .add(2, "h")
      .add(5, "s"),
    cellWidth: 50,
    cellHeight: 20,
    descHeight: 40,
    descWidth: 200,
    scale: 60,
    forbidden: [{
        start: moment()
          .add(5, "h")
          .add(10, "m"),
        end: moment()
          .add(9, "h")
          .add(29, "m")
      },
      {
        start: moment()
          .add(11, "h")
          .add(10, "m"),
        end: moment()
          .add(16, "h")
          .add(29, "m")
      }
    ],
    //可用缩放尺度
    scaleList: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60],
    datas
  },
  getters: {
    correctScale: state => {
      let {
        scale,
        scaleList
      } = state
      let val = 60;
      if (-1 != scaleList.indexOf(scale)) {
        val = scale;
      }
      return val;
    },
    totalWidth: (state, getters) => {
      let {
        descWidth,
        cellWidth,
      } = state;
      let {
        totalBlocks
      } = getters;
      return descWidth + cellWidth * totalBlocks;
    },
    totalBlocks: state => {
      let {
        start,
        end,
        scale
      } = state;
      let hoursToBlock = ((end.diff(start, "h") - 1) * 60) / scale;
      let startToBlock = 60 / scale - Math.floor(start.minutes() / scale);
      let endToBlock = Math.ceil(end.minutes() / scale);
      return hoursToBlock + endToBlock + startToBlock;
    },
    //获取开始时间块的时间
    startBlockTime: state => {
      let {
        start,
        scale
      } = state;
      let startBlock = Math.floor(start.minutes() / scale);
      let startClone = start.clone();
      startClone.minutes(startBlock * scale).seconds(0);
      return startClone;
    }
  },
  mutations: {
    updateShowTimeBlock(state, value) {
      state.showTimeBlock = value
    },
    updateShowProject(state, value) {
      state.showProject = value
    },
    updateShowPlan(state, value) {
      state.showPlan = value
    },
    updateShowActual(state, value) {
      state.showActual = value
    },
    updateCellWidth(state, value) {
      state.cellWidth = value
    },
    updateCellHeight(state, value) {
      state.cellHeight = value
    },
    updateDescHeight(state, value) {
      state.descHeight = value
    },
    updateDescWidth(state, value) {
      state.descWidth = value
    },
    updateScale(state, value) {
      state.scale = value
    },
  }
})