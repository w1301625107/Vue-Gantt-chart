/* eslint-disable */
import { expect } from "chai"
import { shallowMount, mount } from "@vue/test-utils"
import TimeLine from "../../src/components/time-line/index.vue"
import Vue from "vue"
import dayjs from 'dayjs'

// Vue.config.silent = true;

describe("time-line.vue 渲染测试", () => {
  const defaultValue = {
    start:dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    end:dayjs("Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    cellWidth:50,
    titleHeight:40,
    scale:60
  }

  const wrapper = shallowMount(TimeLine,{propsData:defaultValue})

  it("刻度总数 渲染正确", done => {
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

  it("scale 大于一天的刻度总数 渲染正确", done => {
    wrapper.setProps({scale:2880})
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1)
      done()
    })
  })


})
