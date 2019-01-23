/**
 * @author zhongxin
 * @description 日期选择器相关函数
 *
 */

/**
 * 校验日期合法性，返回合法性和日期数组
 *
 * @param {String} date
 * @param {String} start
 * @param {String} end
 * @returns
 */
function verifyDate (date) {
  if (!date) return false
  date = new Date(date.replace(/-/g, '/'))
  return isNaN(date.getMonth()) ? false : date
}

/**
 * 获取当月最大天数
 *
 * @param {Number} year
 * @param {Number} month
 * @returns
 */
function getMaxDay (year, month) {
  if (month === 4 || month === 6 || month === 9 || month === 11) return 30
  if (month === 2) {
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) return 29
    else return 28
  }
  return 31
}
export {
  verifyDate,
  getMaxDay
}
