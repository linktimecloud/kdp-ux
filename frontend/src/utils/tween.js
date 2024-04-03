/**
  * t: current time（当前时间）
  * b: beginning value（初始值）
  * c: change of value（变化量）
  * d: duration（持续时间）
 */

export default {
  easeInOut: (t, b, c, d) => {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b
    return -c / 2 * ((--t) * (t - 2) - 1) + b
  }
}
