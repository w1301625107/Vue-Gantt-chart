/* eslint-disable */
var func = require('../../src/utils/gtUtils')
import { expect } from "chai";
import dayjs from 'dayjs'

describe('测试gtUtils.js', function() {

  describe('测试getWidthAbout2Times函数', function() {
    it('相同时间 计算结果为0', function() {
      expect(func.getWidthAbout2Times(dayjs(
          '2018-10-10 10:00:00'), dayjs(
        '2018-10-10 10:00:00'), {
          scale: 60,
          cellWidth: 60
        }))
        .to.be.equal(0);
    });

    it('数据测试1', function() {
      expect(func.getWidthAbout2Times(dayjs(
        '2018-10-10 10:00:00'), dayjs(
      '2018-10-10 11:00:00'), {
        scale: 60,
        cellWidth: 60
      })).to.equal(60)
    });

    it('数据测试2', function() {
      expect(func.getWidthAbout2Times(dayjs(
        '2018-10-10 00:00:00'), dayjs(
      '2018-10-10 01:10:00'), {
        scale: 1,
        cellWidth: 1
      })).to.equal(70)
    });

    it('数据测试3', function() {
      expect(func.getWidthAbout2Times(dayjs(
        '2018-10-11 10:00:00'), dayjs(
      '2018-10-11 00:00:00'), {
        scale: 10,
        cellWidth: 10
      })).to.equal(-600)
    });

    it('数据测试4', function() {
      expect(func.getWidthAbout2Times(dayjs(
        '2018-10-10 00:00:00'), dayjs(
      '2018-10-10 10:00:00'), {
        scale: 10,
        cellWidth: 60
      })).to.equal(3600)
    });
  });

  describe('测试getPositonOffset函数', function() {
    it('相同时间 计算结果为0', function() {
      expect(func.getPositonOffset(dayjs(
          '2018-10-10 10:00:00'), dayjs(
        '2018-10-10 10:00:00'), {
          scale: 60,
          cellWidth: 60
        }))
        .to.be.equal(0);
    });

    it('数据测试1', function() {
      expect(func.getPositonOffset(dayjs(
        '2018-10-10 10:00:00'), dayjs(
      '2018-10-10 11:00:00'), {
        scale: 60,
        cellWidth: 60
      })).to.equal(-60)
    });

    it('数据测试2', function() {
      expect(func.getPositonOffset(dayjs(
        '2018-10-10 00:00:00'), dayjs(
      '2018-10-10 01:10:00'), {
        scale: 60,
        cellWidth: 60
      })).to.equal(-70)
    });

    it('数据测试3', function() {
      expect(func.getPositonOffset(dayjs(
        '2018-10-11 10:00:00'), dayjs(
      '2018-10-11 00:00:00'), {
        scale: 60,
        cellWidth: 60
      })).to.equal(+600)
    });

    it('数据测试4', function() {
      expect(func.getPositonOffset(dayjs(
        '2018-10-10 00:00:00'), dayjs(
      '2018-10-10 10:00:00'), {
        scale: 60,
        cellWidth: 60
      })).to.equal(-600)
    });
  });

});