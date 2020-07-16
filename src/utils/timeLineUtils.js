// import dayjs from "dayjs";

export const scaleList = [
  1,
  2,
  3,
  4,
  5,
  6,
  10,
  12,
  15,
  20,
  30,
  60,
  120,
  180,
  240,
  360,
  720,
  1440
];

export const MINUTE_OF_ONE_DAY = 60 * 24;

export function isDayScale(scale) {
  return scale >= MINUTE_OF_ONE_DAY && scale % MINUTE_OF_ONE_DAY === 0;
}

/**
 * 验证是否合法scale值
 *
 * @export
 * @param {number} scale
 * @returns
 */
export function validateScale(scale) {
  if (!scaleList.includes(scale) && !isDayScale(scale)) {
    throw new RangeError(
      `错误的scale值，输入值为${scale},可用的scale值为${scaleList.join(
        ","
      )},或者为1440的整数倍`
    );
  }
  return true;
}

/**
 * 根据给出的scale 和 start 时间 计算出用于计算和生成图表的启始时间
 * eg：Start 为10:10分 刻度为60，getBeginTimeOfTimeLine函数给出的时间 为 10:00分
 *                    刻度为5，getBeginTimeOfTimeLine函数给出的时间 为 10:10分
 *                    刻度为3，getBeginTimeOfTimeLine函数给出的时间 为 10:09分
 *
 * @export
 * @param {dayjs} start
 * @param {number} [scale=60]
 * @returns {dayjs}计算的启始时间
 */
export function getBeginTimeOfTimeLine(start, scale = 60) {
  validateScale(scale);
  let timeBlocks;
  let result = start.clone();
  let rate = scale / 60;
  if (scale > 60) {
    timeBlocks = Math.floor(start.hour() / rate);
    result = result
      .hour(timeBlocks * rate)
      .minute(0)
      .second(0);
  } else {
    timeBlocks = Math.floor(start.minute() / scale);
    result = result.minute(timeBlocks * scale).second(0);
  }

  return result;
}
/**
 * 根据所给 scale计算 两个时间差一共可以分成多少个刻度
 * 注意： timdStart 并不是实际的开始计算的时间，会通过getBeginTimeOfTimeLine 函数计算出分割开始时间
 *
 * @export
 * @param {dayjs} timeStart 开始时间
 * @param {dayjs} timeEnd 结束时间
 * @param {number} [scale=60] 分割的刻度
 * @returns 时间块数量
 */
export function calcScalesAbout2Times(timeStart, timeEnd, scale = 60) {
  if (timeStart.isAfter(timeEnd)) {
    throw new TypeError(
      "错误的参数顺序，函数calcScalesAbout2Times的第一个时间参数必须大于第二个时间参数"
    );
  }

  validateScale(scale);

  let startBlocksTime = getBeginTimeOfTimeLine(timeStart, scale);
  let result = 0;
  while (!startBlocksTime.isAfter(timeEnd)) {
    result++;
    startBlocksTime = startBlocksTime.add(scale, "minute");
  }

  return result;
}
