// TODO : 速度还可以再快一点，width 可以通过计算两次margin 相减而得
// 这样计算宽度和偏移一共就3次解析字符串时间，一次减法，如果startBlockTime缓存一下应该更快，这样就只有2次。相比目前4次解析会快一点

// import moment from 'moment' //替换moment 兼容性会好一点，但是速度就很慢了，之前测了一下，大概快30倍？有点忘记了

//缓存 解析值，加速一点点吧
let startBlockTimeCache = null;
let startBlockTimeStringCache = null;
let timeCache = null;
let timeString = null
//计算时间块长度
export function calcBlockwidth(start, end, arg) {
  let {
    scale,
    cellWidth
  } = arg;
  // let pStart = transferTime(start);
  let pStart;
  if (start != timeString) {
    timeCache = transferTime(start)
    timeString = start
  }
  pStart = timeCache
  let pEnd = transferTime(end)
  let width = diffTime(pStart, pEnd) / scale;
  return width * cellWidth;
}

//计算时间块偏移
export function calcBlockMargin(time, arg) {
  // console.log('?')
  let {
    scale,
    cellWidth,
    startBlockTime
  } = arg;
  // let pTime = transferTime(time)
  let pTime;
  if (time != timeString) {
    timeCache = transferTime(time)
    timeString = time
  }
  pTime = timeCache
  let pStartBlockTime;
  //缓存pStartBlockTime，调用很多次
  if (startBlockTimeStringCache !== startBlockTime) {
    startBlockTimeStringCache = startBlockTime;
    startBlockTimeCache = transferTime(startBlockTime)
  }
  pStartBlockTime = startBlockTimeCache;
  let width = diffTime(pStartBlockTime, pTime) / scale;
  return width * cellWidth;
}

function transferTime(time) {
  return new Date(time)
}

function diffTime(start, end) {
  let diff = end.getTime() - start.getTime()
  return (diff / 1000 / 60).toFixed(4)
}

// function transferTime(time){
//   return moment(time)
// }

// function diffTime(start,end){
//   return end.diff(start, "m", true)
// }