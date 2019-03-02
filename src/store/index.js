import Vue from 'vue'
import Vuex from 'vuex'
import {
  mockDatas
} from '../mock/index.js'
import moment from 'moment'
import * as mutations from './mutation-type.js'
import {
  getStartBlocksTime,
  countTimeBlockWithScale
} from "@src/utils/timeblock.js";
Vue.use(Vuex)
Vue.config.devtools = __DEV__;
export default new Vuex.Store({
  strict: __DEV__,
  state: {
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
      .add(1, "d")
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
    datas: mockDatas(10)
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

      return countTimeBlockWithScale(start,
        end,
        scale);
    },
    //获取第一个时间块的时间
    startBlockTime: state => {
      let {
        start,
        scale
      } = state;

      return getStartBlocksTime(start,
        scale);
    }
  },
  mutations: {
    [mutations.updateMarkLineTime](state, value) {
      state.markLineTime = value;
    },
    [mutations.updateMarkLineTimeEnd](state, value) {
      state.markLineTimeEnd = value;
    },
  }
})