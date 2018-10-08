//计算时间块长度
export function calcBlockwidth(block, arg) {
  let {
    start,
    end
  } = block;
  let {
    scale,
    cellWidth
  } = arg;
  let width = end.diff(start, "m", true) / scale;
  return width * cellWidth;
}

//计算时间块偏移
export function calcBlockMargin(block, arg) {
  let {
    start
  } = block;
  let {
    scale,
    cellWidth,
    startBlockTime
  } = arg;
  let width =
    start.diff(startBlockTime, "m", true) / scale;
  return width * cellWidth;
}