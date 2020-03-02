/* eslint-disable */
import { expect } from "chai"
import { shallowMount, mount } from "@vue/test-utils"
import TimeLine from "../../src/components/time-line/index.vue"
import Vue from "vue"
import dayjs from 'dayjs'
import {
  getPositonOffset as _getPositonOffset
} from "../../src/utils/gtUtils";
import {
  getBeginTimeOfTimeLine
} from "../../src/utils/timeLineUtils.js";
// Vue.config.silent = true;

describe("time-line.vue 非lazy渲染测试", () => {
  const defaultValue = {
    start:dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    end:dayjs("Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    cellWidth:50,
    titleHeight:40,
    scale:60,
    lazy:false
  }

  const wrapper = shallowMount(TimeLine,{propsData:defaultValue})

  it("scale 小于一天时刻度总数 渲染正确", done => {
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(48)
      done()
    })
  })

  it("scale 变化后刻度总数 渲染正确", done => {
    wrapper.setProps({scale:120})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(24)
      done()
    })
  })
  it("scale 为一天时刻度总数 渲染正确", done => {
    wrapper.setProps({scale:1440})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(2)
      done()
    })
  })

  it("scale 大于一天的刻度总数 渲染正确", done => {
    wrapper.setProps({scale:2880})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1)
      done()
    })
  })
})


describe("time-line.vue lazy渲染测试", () => {

  // function getPositonOffset(date,scale,cellWidth,start) {
  //   const options = {
  //     scale,cellWidth
  //   };
  //   return _getPositonOffset(date, getBeginTimeOfTimeLine(start, scale).toString(), options);
  // }

  function getPositonOffset(scale,cellWidth,start) {
    const options = {
      scale,cellWidth
    };
    return (date)=> _getPositonOffset(date, getBeginTimeOfTimeLine(start, scale).toString(), options);
  }


  function DryGetPositonOffset(cellWidth,start) {
    return (scale) => (date)=> _getPositonOffset(date, getBeginTimeOfTimeLine(start, scale).toString(), { scale,cellWidth});
  }

  let dry = DryGetPositonOffset(50,dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"))

  const defaultValue = {
    start:dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    end:dayjs("Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    cellWidth:50,
    titleHeight:40,
    scale:60,
    lazy:true,
    startTimeOfRenderArea:dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    endTimeOfRenderArea:dayjs("Thu, 12 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    getPositonOffset:dry(60)
  }

  const wrapper = shallowMount(TimeLine,{propsData:defaultValue})

  it("scale 小于一天时刻度总数 渲染正确", done => {
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(24)
      done()
    })
  })

  it("scale 变化后刻度总数 渲染正确", done => {
    wrapper.setProps({scale:120,getPositonOffset:dry(120)})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(12)
      done()
    })
  })
  it("scale 为一天时刻度总数 渲染正确", done => {
    wrapper.setProps({scale:1440,getPositonOffset:dry(1440)})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1)
      done()
    })
  })

  it("scale 大于一天的刻度总数 渲染正确", done => {
    wrapper.setProps({scale:2880,getPositonOffset:dry(2880)})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1)
      done()
    })
  })
})
