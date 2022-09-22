/**
 * 是否没有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isUndef(v) {
  return v === undefined || v === null;
}
/**
 * 是否有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isDef(v) {
  return v !== undefined && v !== null;
}

export function warn(str) {
  // eslint-disable-next-line
  console.warn(str)
}

export function error(str) {
  // eslint-disable-next-line
  console.error(str)
}

export function debug(str) {
  // eslint-disable-next-line
  console.debug(str)
}

export function noop() {}
