/* eslint-disable */
import { expect } from "chai"
import { shallowMount, mount } from "@vue/test-utils"
import Gantt from "./help/help.vue"
import Vue from "vue"

// Vue.config.silent = true;

describe("block.vue 渲染测试", () => {
  const wrapper = mount(Gantt)
  const ganttInstance = wrapper.find(".gantt-chart")
  
  beforeEach(function() {
    ganttInstance.setData({ widthOfBlocksWrapper: 1000, heightOfBlocksWrapper: 228 ,scrollLeft:0})
    wrapper.setData({cellWidth: 50,scale: 60,times: ["Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)","Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"],timeRangeCorrection:true,})
  });

  it("初始 gantt 渲染块数量正确", done => {
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(5)
      done()
    })
  })

  it("渲染块跨越时间轴时渲染数量正确", done => {
    ganttInstance.setData({ scrollLeft: 600})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(1)
      done()
    })
  })

  it("滚动一次后 gantt 渲染块数量正确", done => {
    ganttInstance.setData({ scrollLeft: 1400})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(4)
      done()
    })
  })

  it("cellwidth变动后 gantt 渲染块数量正确", done => {
    wrapper.setData({ cellWidth: 150})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })

  it("scale变动后 gantt 渲染块数量正确", done => {
    wrapper.setData({ scale: 10})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })

  it("blockwraper 宽度变动时 渲染块数量正确", done => {
    ganttInstance.setData({ widthOfBlocksWrapper: 300,})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })

  it("blockwraper 宽度为0时 渲染块数量正确", done => {
    ganttInstance.setData({ widthOfBlocksWrapper: 0,})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      // 因为第一个元素和时间轴开始时间正好是同一个时间
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(1)
      done()
    })
  })

  it("时间范围变化时 渲染块数量正确", done => {
    wrapper.setData({times: ["Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)","Thu, 12 Dec 2019 06:00:00 GMT+0800 (中国标准时间)"],timeRangeCorrection:false})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      // 因为第一个元素和时间轴开始时间正好是同一个时间
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })


})
