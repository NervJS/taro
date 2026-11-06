import * as Taro from '@tarojs/taro-h5'

const TRANSITION_END = 'transitionend'

/** 构造一个含 stepCount 个关键帧的动画，返回 export() 出来的动画标识 */
function buildAnimation (stepCount: number): string {
  const ani: any = Taro.createAnimation({ duration: 100 })
  for (let i = 0; i < stepCount; i++) {
    ani.translateX(i * 10).step()
  }
  return ani.export()
}

/** 挂一个带动画属性的元素到 body 上 */
function mount (attr: 'animation' | 'data-animation', value: string) {
  const el = document.createElement('div')
  el.setAttribute(attr, value)
  document.body.appendChild(el)
  return el
}

const fireTransitionEnd = (el: HTMLElement) =>
  el.dispatchEvent(new Event(TRANSITION_END, { bubbles: true }))

describe('createAnimation', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('test unit', () => {
    const ani: any = Taro.createAnimation()
    const { rules, transform } = ani
    ani.left(10)
    expect(rules[0]).toEqual({ key: 'left', rule: 'left: 10px' })
    ani.top('10')
    expect(rules[1]).toEqual({ key: 'top', rule: 'top: 10px' })
    ani.right('10%')
    expect(rules[2]).toEqual({ key: 'right', rule: 'right: 10%' })
    ani.translate(10, '10%')
    expect(transform[0]).toEqual({ key: 'translate', transform: 'translate(10px, 10%)' })
    ani.translateX('10')
    expect(transform[1]).toEqual({ key: 'translateX', transform: 'translateX(10px)' })
    ani.translate3d('10', 10, '20%')
    expect(transform[2]).toEqual({ key: 'translate3d', transform: 'translate3d(10px, 10px, 20%)' })
  })

  it('多次调用 createAnimation 不应在 document.body 上累积 transitionend 监听器', () => {
    const spy = jest.spyOn(document.body, 'addEventListener')
    try {
      for (let i = 0; i < 50; i++) {
        Taro.createAnimation()
      }
      const transitionEndCalls = spy.mock.calls.filter(
        call => String(call[0]).toLowerCase() === TRANSITION_END
      )
      expect(transitionEndCalls.length).toBeLessThanOrEqual(1)
    } finally {
      spy.mockRestore()
    }
  })

  it('transitionend 应逐帧推进动画，并在最后一帧后停止', () => {
    const data = buildAnimation(3)
    const el = mount('animation', data)

    fireTransitionEnd(el)
    expect(el.getAttribute('animation')).toBe(`${data}--1`)

    fireTransitionEnd(el)
    expect(el.getAttribute('animation')).toBe(`${data}--2`)

    // 已是最后一帧，不再推进
    fireTransitionEnd(el)
    expect(el.getAttribute('animation')).toBe(`${data}--2`)
  })

  it('多个 Animation 实例的动画互不干扰，各自推进', () => {
    const dataA = buildAnimation(2)
    const dataB = buildAnimation(2)
    expect(dataA).not.toBe(dataB)

    const elA = mount('animation', dataA)
    const elB = mount('animation', dataB)

    fireTransitionEnd(elA)
    expect(elA.getAttribute('animation')).toBe(`${dataA}--1`)
    expect(elB.getAttribute('animation')).toBe(dataB)

    fireTransitionEnd(elB)
    expect(elB.getAttribute('animation')).toBe(`${dataB}--1`)
  })

  it('使用 data-animation 的环境下应同时写回 animation 属性', () => {
    const data = buildAnimation(2)
    const el = mount('data-animation', data)

    fireTransitionEnd(el)
    expect(el.getAttribute('data-animation')).toBe(`${data}--1`)
    expect(el.getAttribute('animation')).toBe(`${data}--1`)
  })

  it('使用 data-animation 的多帧动画应保持两个属性逐帧同步', () => {
    const data = buildAnimation(3)
    const el = mount('data-animation', data)

    fireTransitionEnd(el)
    expect(el.getAttribute('data-animation')).toBe(`${data}--1`)
    expect(el.getAttribute('animation')).toBe(`${data}--1`)

    // 第一帧之后元素同时带上了 animation；若此后只更新 animation，
    // data-animation 会停在上一帧，而生成的 CSS 同时匹配两个属性，
    // 旧帧规则会把后续帧的样式盖掉。
    fireTransitionEnd(el)
    expect(el.getAttribute('data-animation')).toBe(`${data}--2`)
    expect(el.getAttribute('animation')).toBe(`${data}--2`)

    // 已是最后一帧，两个属性都不再推进
    fireTransitionEnd(el)
    expect(el.getAttribute('data-animation')).toBe(`${data}--2`)
    expect(el.getAttribute('animation')).toBe(`${data}--2`)
  })

  it('无关元素的 transitionend 不应影响后续动画的推进', () => {
    const data = buildAnimation(2)
    // 页面上任意一个不带动画属性的元素先触发一次 transitionend
    const unrelated = document.createElement('div')
    document.body.appendChild(unrelated)
    expect(() => fireTransitionEnd(unrelated)).not.toThrow()

    const el = mount('animation', data)
    fireTransitionEnd(el)
    expect(el.getAttribute('animation')).toBe(`${data}--1`)
  })

  it('非 Taro 动画的元素不应被改写', () => {
    const el = mount('animation', 'some-other-animation')
    expect(() => fireTransitionEnd(el)).not.toThrow()
    expect(el.getAttribute('animation')).toBe('some-other-animation')
  })
})
