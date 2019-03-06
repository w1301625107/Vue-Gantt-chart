import moment from 'moment'

export const scaleList = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60, 120, 180,
  240,
  360, 720, 1440
]

export function validateScale(scale) {
  if (!scaleList.includes(scale)) {
    throw new RangeError(
      `错误的scale值，输入值为${scale},可用的scale值为${scaleList.join(',')}`)
  }
  return true;
}

/**
 * 根据给出的scale 和 start 时间 计算出用于计算的启始时间
 * eg：Start 为10:10分 刻度为60，getStartBlocksTime函数给出的时间 为 10:00分
 *                    刻度为5，getStartBlocksTime函数给出的时间 为 10:10分
 *                    刻度为3，getStartBlocksTime函数给出的时间 为 10:09分
 *
 * @export
 * @param {*} start 
 * @param {number} [scale=60]
 * @returns 计算的启始时间
 */
export function getStartBlocksTime(start, scale = 60) {
  validateScale(scale)
  let timeBlocks;
  let startClone = start.clone();
  let rate = scale / 60;
  if (scale > 60) {
    timeBlocks = Math.floor(start.hour() / rate);
    startClone.hour(timeBlocks * rate).minute(0).seconds(0);
  } else {
    timeBlocks = Math.floor(start.minutes() / scale);
    startClone.minutes(timeBlocks * scale).seconds(0);
  }

  return startClone;
}
/**
 * 根据所给 scale计算 两个时间差一共可以分成多少块
 * 注意： timdStart 并不是实在开始计算的时间，会通过getStartBlocksTime 函数计算出分割开始时间
 *
 * @export
 * @param {*} timeStart 开始时间
 * @param {*} timeEnd 结束时间
 * @param {number} [scale=60] 分割的刻度
 * @returns 时间块数量
 */
export function countTimeBlockWithScale(timeStart, timeEnd, scale = 60) {
  if (!moment.isMoment(timeStart) || !moment.isMoment(timeEnd)) {
    throw new TypeError('参数必须为moment 对象')
  }
  if (timeStart.isAfter(timeEnd)) {
    throw new TypeError('错误的参数顺序，函数countTimeBlockWithScale的第一个时间参数必须大于第二个时间参数')
  }

  validateScale(scale);

  let startBlocksTime = getStartBlocksTime(timeStart, scale);
  let count = 0;
  while (!startBlocksTime.isAfter(timeEnd)) {
    count++;
    startBlocksTime.add(scale, "m")
  }

  return count;

}