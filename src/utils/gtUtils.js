// import dayjs from 'dayjs' //替换dayjs 兼容性会好一点，但是速度就很慢了，之前测了一下，大概快30倍？有点忘记了
/**
 *
 * @export
 * @param {{scale:number,cellWidth:number,beginTime:string}} option
 * @returns function ({string} time) return number
 */

let c = [0, 0];
let d = [0, 0];
export function getPositionOffset(option) {
  const { scale, cellWidth, beginTime } = option;
  const denominator = cellWidth / (scale * 1000 * 60);
  const pBeginTime =
    beginTime == undefined ? 0 : parseTime(beginTime).getTime();
  return function calc(time) {
    if (c[0] == time) {
      return c[1];
    }

    let res = (parseTime(time).getTime() - pBeginTime) * denominator;
    if (c[0] == 0) {
      c[0] = time;
      c[1] = res;
    } else if (d[0] == 0) {
      d[0] = time;
    } else {
      c[0] = time;
      c[1] = res;
      d[0] = d[1] = 0;
    }
    return res;
  };
}

function parseTime(time) {
  return new Date(time);
}

/**
 * 计算两个时间相差的分钟数
 *
 * @param {string} start
 * @param {string} end
 * @returns
 */
// function diffTimeByMinutes(start, end) {
//   const diff = end.getTime() - start.getTime();
//   return diff / 1000 / 60;
// }

// function parseTime(time){
//   return dayjs(time)
// }

// function diffTimeByMinutes(start,end){
//   return end.diff(start, "m", true)
// }
