import Vue from 'vue'
import Vuex from 'vuex'
import {
  mockDatas
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
    markLineTime: moment()
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
    scaleList: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120, 180, 240,
      360, 720, 1440
    ],
    datas: mockDatas(150)
  },
  getters: {
    //计算表格总宽度
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
    //计算时间块的数量
    totalBlocks: state => {
      let {
        start,
        end,
        scale
      } = state;

      let hoursToBlock, startToBlock, endToBlock;
      if (scale > 60) {
        startToBlock = (24 - Math.floor((start.hour() + start.minutes() /
              60) /
            (scale / 60)) * (
            scale / 60)) /
          (scale / 60);
        endToBlock = Math.ceil((end.hour() + end.minutes() / 60) / (scale /
          60));
        if (start.format("MM/DD") == end.format("MM/DD")) {
          hoursToBlock = 0
        } else {
          let sc = start.clone().hour(0).minutes(0).second(0);
          let ec = end.clone().hour(0).minutes(0).second(0);
          hoursToBlock = 24 * (ec.diff(sc, "d") - 1) / (scale / 60)
        }
      } else {
        hoursToBlock = ((end.diff(start, "h") - 1) * 60) / scale;
        startToBlock = 60 / scale - Math.floor(start.minutes() / scale);
        endToBlock = Math.ceil(end.minutes() / scale);
      }
      return hoursToBlock + endToBlock + startToBlock;
    },
    //获取第一个时间块的时间
    startBlockTime: state => {
      let {
        start,
        scale
      } = state;
      let startBlock;
      let startClone = start.clone();
      if (scale > 60) {
        startBlock = Math.floor(start.hour() / (scale / 60));
        startClone.hour(startBlock * (scale / 60)).minute(0).seconds(0);
      } else {
        startBlock = Math.floor(start.minutes() / scale);

        startClone.minutes(startBlock * scale).seconds(0);
      }

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
      let {
        scaleList
      } = state
      let temp = 60;
      if (-1 != scaleList.indexOf(value)) {
        temp = value;
      }
      state.scale = temp;
    },
    updateMarkLineTime(state, value) {
      state.markLineTime = value;
    },
  }
})