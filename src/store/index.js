import Vue from 'vue'
import Vuex from 'vuex'
import {
  mockDatas
} from '../mock/index.js'
import moment from 'moment'
import * as mutations from './mutation-type.js'
Vue.use(Vuex)
Vue.config.devtools = true;
export default new Vuex.Store({
  strict: process.env.__DEV__,
  state: {
    showTimeBlock: true,
    showProject: true,
    showPlan: true,
    showActual: true,
    markLineTime: moment()
      .add(6, "h")
      .add(5, "s"),
    markLineTimeEnd: moment()
      .add(7, "h")
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
    
    //可用缩放尺度
    scaleList: [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120, 180, 240,
      360, 720, 1440
    ],
    datas: mockDatas(1000)
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
    //计算表格总高度
    totalHeight: state => {
      let {
        datas,
        showActual,
        showPlan,
        showProject,
        cellHeight
      } = state;
      let rate = 0;
      if (showActual) rate += 1;
      if (showPlan) rate += 1;
      if (showProject) rate += 1;
      return datas.length * rate * cellHeight
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
        let rate = scale / 60;
        startToBlock = (24 - Math.floor((start.hour() + start.minutes() /
            60) /
          rate) * rate) / rate;
        endToBlock = Math.ceil((end.hour() + end.minutes() / 60) / rate);
        if (start.format("MM/DD") == end.format("MM/DD")) {
          hoursToBlock = 0
        } else {
          let sc = start.clone().hour(0).minutes(0).second(0);
          let ec = end.clone().hour(0).minutes(0).second(0);
          hoursToBlock = 24 * (ec.diff(sc, "d") - 1) / rate
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
    [mutations.updateShowTimeBlock](state, value) {
      state.showTimeBlock = value
    },
    [mutations.updateShowProject](state, value) {
      state.showProject = value
    },
    [mutations.updateShowPlan](state, value) {
      state.showPlan = value
    },
    [mutations.updateShowActual](state, value) {
      state.showActual = value
    },
    [mutations.updateCellWidth](state, value) {
      state.cellWidth = value
    },
    [mutations.updateCellHeight](state, value) {
      state.cellHeight = value
    },
    [mutations.updateDescHeight](state, value) {
      state.descHeight = value
    },
    [mutations.updateDescWidth](state, value) {
      state.descWidth = value
    },
    [mutations.updateScale](state, value) {
      let {
        scaleList
      } = state
      let temp = 60;
      if (-1 != scaleList.indexOf(value)) {
        temp = value;
      }
      state.scale = temp;
    },
    [mutations.updateMarkLineTime](state, value) {
      state.markLineTime = value;
    },
    [mutations.updateMarkLineTimeEnd](state, value) {
      state.markLineTimeEnd = value;
    },
  }
})