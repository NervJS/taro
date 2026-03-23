import * as Taro from '@tarojs/taro-h5'

describe('pxtransform', () => {
  test('pxTransform', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
    })
    expect(Taro.pxTransform(20)).toBe('0.5rem')
  })

  test('pxTransform, designWidth=640', () => {
    Taro.initPxTransform({
      designWidth: 640,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
    })
    expect(Taro.pxTransform(20)).toBe('0.585rem')
  })

  test('pxTransform, targetUnit=px', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
      targetUnit: 'px'
    })
    expect(Taro.pxTransform(20)).toBe('10px')
  })

  test('pxTransform, targetUnit=px, designWidth=640', () => {
    Taro.initPxTransform({
      designWidth: 640,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
      targetUnit: 'px'
    })
    expect(Taro.pxTransform(20)).toBe('11.7px')
  })

  test('pxTransform, targetUnit=vw', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
      targetUnit: 'vw'
    })
    expect(Taro.pxTransform(375)).toBe('50vw')
  })

  test('pxTransform, targetUnit=vw, designWidth=640', () => {
    Taro.initPxTransform({
      designWidth: 640,
      deviceRatio: {
        640: 2.34 / 2,
        750: 1,
        828: 1.81 / 2,
      },
      targetUnit: 'vw'
    })
    expect(Taro.pxTransform(320)).toBe('50vw')
  })

  test('pxTransform, deviceRatio=function', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: (designWidth) => {
        return {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2,
        }[designWidth]
      },
    })
    expect(Taro.pxTransform(20)).toBe('0.5rem')
    expect(Taro.pxTransform(20, 640)).toBe('0.585rem')
  })

  test('pxTransform, deviceRatio=function, targetUnit=px', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: (designWidth) => {
        return {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2,
        }[designWidth]
      },
      targetUnit: 'px'
    })
    expect(Taro.pxTransform(20)).toBe('10px')
    expect(Taro.pxTransform(20, 640)).toBe('11.7px')
  })

  test('pxTransform, deviceRatio=function, targetUnit=vw', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: (designWidth) => {
        return {
          640: 2.34 / 2,
          750: 1,
          828: 1.81 / 2,
        }[designWidth]
      },
      targetUnit: 'vw'
    })
    expect(Taro.pxTransform(375)).toBe('50vw')
    expect(Taro.pxTransform(320, 640)).toBe('50vw')
  })

  test('pxTransform, deviceRatio=object, missing designWidth', () => {
    Taro.initPxTransform({
      designWidth: 750,
      deviceRatio: {
        750: 1,
      },
    })
    expect(() => Taro.pxTransform(20, 640)).toThrow('deviceRatio 配置中不存在 640 的设置！')
  })
})
