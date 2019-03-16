/**
 * 是否没有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isUndef(v){
  return v === undefined || v === null
}
/**
 * 是否有值
 *
 * @export
 * @param {*} v
 * @returns
 */
export function isDef(v){
  return v !== undefined && v !== null
}

export function warn(str){
  // eslint-disable-next-line
  console.warn(str)
}