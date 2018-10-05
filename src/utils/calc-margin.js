//计算时间块长度
export function calcBlockwidth(block, options) {
  let {
    start,
    end
  } = block;
  let {
    scale,
    cellWidth
  } = options;
  let width = end.diff(start, "h", true) / scale;
  return width * cellWidth;
}

//计算时间块偏移
export function calcBlockMargin(block, options) {
  let {
    start
  } = block;
  let {
    scale,
    cellWidth,
    startBlockTime
  } = options;
  let width =
    start.diff(startBlockTime, "h", true) / scale;
  return width * cellWidth;
}