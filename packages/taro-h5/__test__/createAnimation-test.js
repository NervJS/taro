/* eslint-disable */
import { createAnimation } from '../src/api/createAnimation'

describe('createAnimation', () => {
  it('test unit', () => {
    const ani = createAnimation()
    const { rules, transform } = ani
    ani.left(10)
    expect(rules[0]).toEqual(`left: 10px`)
    ani.top('10')
    expect(rules[1]).toEqual(`top: 10px`)
    ani.right('10%')
    expect(rules[2]).toEqual(`right: 10%`)
    ani.translate(10, '10%')
    expect(transform[1]).toEqual(`translate(10px, 10%)`)
    ani.translateX('10')
    expect(transform[2]).toEqual(`translateX(10px)`)
    ani.translate3d('10', 10, '20%')
    expect(transform[3]).toEqual(`translate3d(10px, 10px, 20%)`)
  })
})
