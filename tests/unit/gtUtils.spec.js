/* eslint-disable */
var func = require("../../src/utils/gtUtils");
import { expect } from "chai";
import dayjs from "dayjs";

describe("测试gtUtils.js", function() {
  const option = {
    scale: 60,
    cellWidth: 60
  };
  describe("测试getPositionOffset函数", function() {
    it("相同时间 计算结果为0", function() {
      let f = func.getPositionOffset({
        ...option,
        beginTime: dayjs("2018-10-10 10:00:00")
      });
      expect(f(dayjs("2018-10-10 10:00:00"))).to.be.equal(0);
    });

    it("数据测试1", function() {
      let f = func.getPositionOffset({
        ...option,
        beginTime: dayjs("2018-10-10 11:00:00")
      });
      expect(f(dayjs("2018-10-10 10:00:00"))).to.be.equal(-60);
    });

    it("数据测试2", function() {
      let f = func.getPositionOffset({
        ...option,
        beginTime: dayjs("2018-10-10 01:10:00")
      });
      expect(f(dayjs("2018-10-10 00:00:00"))).to.be.equal(-70);
    });

    it("数据测试3", function() {
      let f = func.getPositionOffset({
        ...option,
        beginTime: dayjs("2018-10-11 00:00:00")
      });
      expect(f(dayjs("2018-10-11 10:00:00"))).to.be.equal(600);
    });

    it("数据测试4", function() {
      let f = func.getPositionOffset({
        ...option,
        beginTime: dayjs("2018-10-10 10:00:00")
      });
      expect(f(dayjs("2018-10-10 00:00:00"))).to.be.equal(-600);
    });
  });
});
