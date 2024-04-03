import Tween from '@/utils/tween'

describe('tween utils', () => {
  // easeInOut: 前半段从0开始加速，后半段减速到0的缓动
  // https://stackoverflow.com/questions/13462001/ease-in-and-ease-out-animation-formula
  it('easeInOut should return easeInOut time', () => {
    // when t <= 0.5: f(x) = 2 * x * x + b with x in [0;0.5] (
    expect(Tween.easeInOut(10, 0, 100, 100)).toBe(2)
    // when t > 0.5: f(x) = 2 * x * (1 - x) + b with x in [0;0.5]
    expect(Tween.easeInOut(60, 0, 100, 100)).toBe(68)
  })
})
