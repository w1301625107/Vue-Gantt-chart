// TODO : 速度还可以再快一点，width 可以通过计算两次margin 相减而得
// 这样计算宽度和偏移一共就3次解析字符串时间，一次减法，如果BeginTimeOfTimeLine缓存一下应该更快，这样就只有2次。相比目前4次解析会快一点

// import moment from 'moment' //替换moment 兼容性会好一点，但是速度就很慢了，之前测了一下，大概快30倍？有点忘记了

//缓存 解析值，加速一点点吧
const cacheParseTime = function() {
  let cacheString = {}
  let cacheValue = {}
  return function(timeName, timeString) {

    if (cacheString[timeName] !== timeString) {
      cacheString[timeName] = timeString;
      cacheValue[timeName] = parseTime(timeString)
    }

    return cacheValue[timeName]
  }
}()

// pStart 关于缓存这个值是因为getWidthAbout2Times和getPositonOffset通常是前后连续调用，start 值会再两个函数中分别用到一次

/**
 * 根据配置项计算两个时间的在gantt 图中的长度
 *
 * @export
 * @param {*} start
 * @param {*} end
 * @param {*} arg
 * @returns
 */
export function getWidthAbout2Times(start, end, arg) {
  let {
    scale,
    cellWidth
  } = arg;
  let pStart = cacheParseTime('pStart', start);
  let pEnd = parseTime(end)
  return diffTimeByMinutes(pStart, pEnd) / scale * cellWidth;
}

/**
 * 根据配置项计算 相对于 时间轴起始时间的距离 是 getWidthAbout2Times 的特化
 *
 * @export
 * @param {*} time
 * @param {*} beginTimeOfTimeLine
 * @param {*} arg
 * @returns
 */
export function getPositonOffset(time, beginTimeOfTimeLine, arg) {
  // console.log('?')
  let {
    scale,
    cellWidth,
  } = arg;
  let pTime = cacheParseTime('pStart', time);
  let pBeginTimeOfTimeLine = cacheParseTime('pBeginTimeOfTimeLine', beginTimeOfTimeLine);
  return diffTimeByMinutes(pBeginTimeOfTimeLine, pTime) / scale * cellWidth;
}

function parseTime(time) {
  return new Date(time)
}

function diffTimeByMinutes(start, end) {
  let diff = end.getTime() - start.getTime()
  return (diff / 1000 / 60).toFixed(4)
}



// function parseTime(time){
//   return moment(time)
// }

// function diffTimeByMinutes(start,end){
//   return end.diff(start, "m", true)
// }