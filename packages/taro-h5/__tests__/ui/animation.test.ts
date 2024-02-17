import * as Taro from '@tarojs/taro-h5'

describe('createAnimation', () => {
  it('test unit', () => {
    const ani: any = Taro.createAnimation()
    const { rules, transform } = ani
    ani.left(10)
    expect(rules[0]).toEqual({ 'key': 'left', 'rule': 'left: 10px' })
    ani.top('10')
    expect(rules[1]).toEqual({ 'key': 'top', 'rule': 'top: 10px' })
    ani.right('10%')
    expect(rules[2]).toEqual({ 'key': 'right', 'rule': 'right: 10%' })
    ani.translate(10, '10%')
    expect(transform[0]).toEqual({ 'key': 'translate', 'transform': 'translate(10px, 10%)' })
    ani.translateX('10')
    expect(transform[1]).toEqual({ 'key': 'translateX', 'transform': 'translateX(10px)' })
    ani.translate3d('10', 10, '20%')
    expect(transform[2]).toEqual({ 'key': 'translate3d', 'transform': 'translate3d(10px, 10px, 20%)' })
  })
})
