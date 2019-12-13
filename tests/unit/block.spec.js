/* eslint-disable */
import { expect } from "chai"
import { shallowMount, mount } from "@vue/test-utils"
import Gantt from "./help.vue"
import Vue from "vue"

// Vue.config.silent = true;

describe("block.vue 渲染测试", () => {
  const wrapper = mount(Gantt)
  const ganttInstance = wrapper.find(".gantt-chart")
  ganttInstance.setData({ widthOfRenderAera: 1000, heightOfRenderAera: 228 })

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
    ganttInstance.setData({ scrollLeft: 0})
    wrapper.setData({ cellWidth: 150})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })

  it("scale变动后 gantt 渲染块数量正确", done => {
    ganttInstance.setData({ scrollLeft: 0})
    wrapper.setData({ scale: 10,cellWidth: 50})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })

  it("blockwraper 大小变动时 渲染块数量正确", done => {
    ganttInstance.setData({ scrollLeft: 0,widthOfRenderAera: 300,})

    wrapper.setData({ scale: 60,cellWidth: 50})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-block-item").length).to.equal(2)
      done()
    })
  })


})
