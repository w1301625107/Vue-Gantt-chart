//计算时间块长度
export function calcBlockwidth(start,end, arg) {
  let {
    scale,
    cellWidth
  } = arg;
  let width = end.diff(start, "m", true) / scale;
  return width * cellWidth;
}

//计算时间块偏移
export function calcBlockMargin(time, arg) {
  let {
    scale,
    cellWidth,
    startBlockTime
  } = arg;
  let width =
  time.diff(startBlockTime, "m", true) / scale;
  return width * cellWidth;
}