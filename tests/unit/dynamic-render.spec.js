/* eslint-disable */
import { expect } from "chai"
import { shallowMount, mount } from "@vue/test-utils"
import dynamicRender from "../../src/components/dynamic-render.js"
import Vue from "vue"

const dynamicRenderComp = Vue.extend(dynamicRender)

// Vue.config.silent = true;

describe("dynamic-render.js 渲染测试", () => {
  const wrapper = mount(dynamicRenderComp, {
    propsData: {
      scrollTop: 0,
      heightOfBlocksWrapper: 100,
      cellHeight: 10,
      datas: Array(20)
    }
  })

  beforeEach(function() {
    wrapper.setProps({ scrollTop: 0, preload: 1, heightOfBlocksWrapper: 100,cellHeight:10 })
  })

  it("初始渲染行数正确", () => {
    wrapper.setProps({ preload: 1 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(11)
  })

  it("改变预渲染行数正确", () => {
    wrapper.setProps({ preload: 2 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(12)
  })

  it("全部渲染行数正确", () => {
    wrapper.setProps({ preload: 0 })
    expect(wrapper.vm.showDatas.length).to.equal(20)
  })

  it("容器高度变化后渲染行数正确", () => {
    wrapper.setProps({ heightOfBlocksWrapper: 0 })
    expect(wrapper.vm.showDatas.length).to.equal(0)
    wrapper.setProps({ heightOfBlocksWrapper: 10 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(2)
  })

  it("行高变化后渲染行数正确", () => {
    wrapper.setProps({ cellHeight: 0 })
    expect(wrapper.vm.showDatas.length).to.equal(0)
    wrapper.setProps({ cellHeight: 20 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(6)
  })

  it("滚动后渲染行数正确", () => {
    wrapper.setProps({ scrollTop: 5})
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(12)
    wrapper.setProps({ scrollTop: 10 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(12)
    wrapper.setProps({ scrollTop: 0 })
    expect(wrapper.vm.startRenderNum).to.equal(0)
    expect(wrapper.vm.endRenderNum).to.equal(11)
    wrapper.setProps({ scrollTop: 200 })
    expect(wrapper.vm.startRenderNum).to.equal(9)
    expect(wrapper.vm.endRenderNum).to.equal(20)
  })
})
