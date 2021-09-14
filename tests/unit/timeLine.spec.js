/* eslint-disable */
import { expect } from "chai";
import { shallowMount, mount } from "@vue/test-utils";
import TimeLine from "../../src/components/time-line/index.vue";
import Vue from "vue";
import dayjs from "dayjs";
import { getPositionOffset as _getPositionOffset } from "../../src/utils/gtUtils";
import {
  getBeginTimeOfTimeLine,
  scaleList
} from "../../src/utils/timeLineUtils.js";
// Vue.config.silent = true;

describe("time-line.vue 非lazy渲染测试", () => {
  const defaultValue = {
    start: dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    end: dayjs("Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    cellWidth: 50,
    titleHeight: 40,
    scale: 60,
    lazy: false
  };

  const wrapper = shallowMount(TimeLine, { propsData: defaultValue });

  it("scale 小于一天时刻度总数 渲染正确", (done) => {
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(48);
      done();
    });
  });

  it("scale 变化后刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 120 });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(24);
      done();
    });
  });
  it("scale 为一天时刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 1440 });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(2);
      done();
    });
  });

  it("scale 大于一天的刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 2880 });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1);
      done();
    });
  });

  it("每天共多少scale计算对照", (done) => {
    Vue.config.errorHandler = done;

    const tests = scaleList.map((scale) => {
      return new Promise((resolve, reject) => {
        wrapper.setProps({ scale });
        Vue.nextTick(() => {
          wrapper.vm.allDayBlocks.forEach((day) => {
            expect(wrapper.vm.getTimeScales(day).length).to.equal(
              wrapper.vm.getDayWidth(day)
            );
          });
          resolve();
        });
      });
    });

    Promise.all(tests).finally(() => done());
  });
});

describe("time-line.vue lazy渲染测试", () => {
  function getPositionOffset(scale, cellWidth, start) {
    const options = {
      scale,
      cellWidth,
      beginTime: getBeginTimeOfTimeLine(start, scale)
    };
    const f = _getPositionOffset(options);
    return f;
  }

  function DrygetPositionOffset(cellWidth, start) {
    const f = (scale) => getPositionOffset(scale, cellWidth, start);

    return f;
  }

  const cellWidth = 50;
  const dry = DrygetPositionOffset(
    cellWidth,
    dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)")
  );

  const defaultValue = {
    start: dayjs("Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"),
    end: dayjs("Fri, 13 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"),
    cellWidth,
    titleHeight: 40,
    scale: 60,
    lazy: true,
    startTimeOfRenderArea: dayjs(
      "Thu, 12 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"
    ),
    endTimeOfRenderArea: dayjs(
      "Fri, 12 Dec 2019 23:59:00 GMT+0800 (中国标准时间)"
    ),
    getPositionOffset: dry(60)
  };

  const wrapper = shallowMount(TimeLine, { propsData: defaultValue });

  it("scale 小于一天时刻度总数 渲染正确", (done) => {
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(24);
      done();
    });
  });

  it("scale 变化后刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 120, getPositionOffset: dry(120) });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-scale div").length).to.equal(12);
      done();
    });
  });
  it("scale 为一天时刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 1440, getPositionOffset: dry(1440) });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1);
      done();
    });
  });

  it("scale 大于一天的刻度总数 渲染正确", (done) => {
    wrapper.setProps({ scale: 2880, getPositionOffset: dry(2880) });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.findAll(".gantt-timeline-block").length).to.equal(1);
      done();
    });
  });

  it("paddingWidth  测试", (done) => {
    wrapper.setProps({ scale: 1440, getPositionOffset: dry(1440) });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.vm.paddingWidth).to.equal(0);
      done();
    });
  });
  it("paddingWidth  测试2", (done) => {
    wrapper.setProps({
      scale: 1440,
      getPositionOffset: dry(1440),
      startTimeOfRenderArea: dayjs(
        "Fri, 13 Dec 2019 00:00:00 GMT+0800 (中国标准时间)"
      )
    });
    Vue.config.errorHandler = done;
    Vue.nextTick(() => {
      expect(wrapper.vm.paddingWidth).to.equal(cellWidth);
      done();
    });
  });
});
