import {
  DUO_MASK_COLOR_DARK,
  DUO_MASK_COLOR_LIGHT,
  duoInfoSignature,
  HALF_SHEET_MAX_CSS_PX,
  resolveDuoMaskColor,
  resolveDuoSheetLayout,
  toNativeMaskColor
} from '../src/components/picker/duo-layout'

const base = {
  platform: 'ios',
  windowWidth: 800,
  windowHeight: 600,
  screenWidth: 800,
  deviceOrientation: 'landscape'
}

describe('resolveDuoSheetLayout', () => {
  it('非 iOS 或没有 foldState 时不生效（样式与改前一致）', () => {
    expect(resolveDuoSheetLayout({ ...base, foldState: 'halfOpen', platform: 'android' })).toBeNull()
    expect(resolveDuoSheetLayout({ ...base })).toBeNull()
    expect(resolveDuoSheetLayout({ ...base, foldState: 'unknown' })).toBeNull()
    expect(resolveDuoSheetLayout(null)).toBeNull()
  })

  it('全开 / 折叠：以整窗为内容区，超过上限后限宽并居中', () => {
    const layout = resolveDuoSheetLayout({ ...base, foldState: 'fullyOpen' })
    expect(layout).toEqual({ left: (800 - HALF_SHEET_MAX_CSS_PX) / 2, width: HALF_SHEET_MAX_CSS_PX })
    // 窗口比上限窄：撑满
    expect(
      resolveDuoSheetLayout({ ...base, windowWidth: 500, screenWidth: 500, foldState: 'closed' })
    ).toEqual({ left: 0, width: 500 })
  })

  it('半折叠横屏：内容区为中缝左侧，面板撑满左半窗', () => {
    expect(resolveDuoSheetLayout({ ...base, foldState: 'halfOpen' })).toEqual({ left: 0, width: 400 })
  })

  it('半折叠横屏：左半窗宽于上限时在左半窗内居中', () => {
    const layout = resolveDuoSheetLayout({
      ...base,
      windowWidth: 1600,
      screenWidth: 1600,
      foldState: 'halfOpen'
    })
    expect(layout).toEqual({ left: (800 - HALF_SHEET_MAX_CSS_PX) / 2, width: HALF_SHEET_MAX_CSS_PX })
  })

  it('半折叠竖屏与全开竖屏一致（整窗）', () => {
    expect(
      resolveDuoSheetLayout({
        ...base,
        windowWidth: 400,
        windowHeight: 800,
        screenWidth: 400,
        deviceOrientation: 'portrait',
        foldState: 'halfOpen'
      })
    ).toEqual({ left: 0, width: 400 })
  })

  it('foldState 别名归一（half_open / HalfOpen）', () => {
    expect(resolveDuoSheetLayout({ ...base, foldState: 'half_open' })).toEqual({ left: 0, width: 400 })
    expect(resolveDuoSheetLayout({ ...base, foldState: 'HalfOpen' })).toEqual({ left: 0, width: 400 })
  })

  it('dp → CSS px：按 lengthScaleRatio 换算（实测 867 / 951 / 0.929）', () => {
    const info = {
      platform: 'ios',
      windowWidth: 867,
      windowHeight: 669,
      screenWidth: 951,
      lengthScaleRatio: 0.929,
      deviceOrientation: 'landscape'
    }
    // 半折叠：中缝 floor(951/0.929/2)=511
    expect(resolveDuoSheetLayout({ ...info, foldState: 'halfOpen' })).toEqual({ left: 0, width: 511 })
    // 全开：整窗 867/0.929≈933 超过上限 → 653 居中
    const full = resolveDuoSheetLayout({ ...info, foldState: 'fullyOpen' })!
    expect(full.width).toBe(653)
    expect(full.left).toBeCloseTo((867 / 0.929 - 653) / 2, 5)
  })

  it('全开横屏按业务window居中，不把screen侧栏当内容区', () => {
    const info = { ...base, foldState: 'fullyOpen', windowWidth: 867, screenWidth: 951, lengthScaleRatio: 0.929 }
    const original = resolveDuoSheetLayout(info)!
    const covered = resolveDuoSheetLayout(info)!
    expect(original.left + original.width / 2).toBeCloseTo(867 / 0.929 / 2)
    expect(covered.left + covered.width / 2).toBeCloseTo(867 / 0.929 / 2)
    expect(covered.width).toBe(653)
  })

  it('halfOpen横屏仍按中缝左半区和avoidAreas限制', () => {
    const info = { ...base, foldState: 'halfOpen', windowWidth: 867, screenWidth: 951, lengthScaleRatio: 0.929, avoidAreas: [{ left: 470, width: 20 }] }
    expect(resolveDuoSheetLayout(info)).toEqual(resolveDuoSheetLayout(info))
  })

  it.each([undefined, 0, NaN])('screenWidth=%s时覆盖布局回退到window', (screenWidth) => {
    const info = { ...base, foldState: 'fullyOpen', screenWidth }
    expect(resolveDuoSheetLayout(info)).toEqual(resolveDuoSheetLayout(info))
  })

  it.each(['closed', 'fullyOpen', 'halfOpen'])('%s窄窗按业务窗口布局，不使用整屏/物理中缝居中', (foldState) => {
    const info = { ...base, foldState, screenWidth: 951, windowWidth: 400, lengthScaleRatio: 0.929 }
    expect(resolveDuoSheetLayout(info)).toEqual({ left: 0, width: 400 / 0.929 })
  })

  it('各折叠状态/方向/比例/窄窗组合面板边界均落在业务窗口内', () => {
    for (const foldState of ['closed', 'fullyOpen', 'halfOpen']) {
      for (const deviceOrientation of ['portrait', 'landscape']) {
        for (const windowWidth of [306, 400, 500, 867, 1600]) {
          for (const lengthScaleRatio of [0.5, 0.929, 1, 1.5]) {
            const info = { ...base, foldState, deviceOrientation, windowWidth, screenWidth: 1800, lengthScaleRatio }
            const layout = resolveDuoSheetLayout(info)!
            expect(layout.left).toBeGreaterThanOrEqual(0)
            expect(layout.width).toBeLessThanOrEqual(653)
            expect((layout.left + layout.width) * lengthScaleRatio).toBeLessThanOrEqual(windowWidth + 1e-8)
          }
        }
      }
    }
  })

  it('avoidAreas 落在中缝右侧并压进内容区时收窄；在左侧则忽略', () => {
    const info = { ...base, foldState: 'halfOpen' }
    expect(
      resolveDuoSheetLayout({ ...info, avoidAreas: [{ left: 390, top: 0, width: 20, height: 600 }] })
    ).toEqual({ left: 0, width: 390 })
    expect(
      resolveDuoSheetLayout({ ...info, avoidAreas: [{ left: 0, top: 0, width: 40, height: 600 }] })
    ).toEqual({ left: 0, width: 400 })
  })
})

describe('duoInfoSignature', () => {
  it('折叠 / 旋转 / 尺寸任一变化签名都不同，相同信息签名相同', () => {
    const a = { ...base, foldState: 'fullyOpen' }
    expect(duoInfoSignature(a)).toBe(duoInfoSignature({ ...a }))
    expect(duoInfoSignature(a)).not.toBe(duoInfoSignature({ ...a, foldState: 'halfOpen' }))
    expect(duoInfoSignature(a)).not.toBe(duoInfoSignature({ ...a, windowWidth: 400 }))
    expect(duoInfoSignature(a)).not.toBe(duoInfoSignature({ ...a, deviceOrientation: 'portrait' }))
    expect(duoInfoSignature(null)).toBe('')
  })
})

describe('蒙层色转换（导航栏屏蔽时的原生背景色）', () => {
  it('hex / rgba 转成 #RRGGBB(AA)，无法转换返回 undefined', () => {
    expect(toNativeMaskColor('#000')).toBe('#000000')
    expect(toNativeMaskColor('#0008')).toBe('#00000088')
    expect(toNativeMaskColor('rgba(0, 0, 0, 0.6)')).toBe('#00000099')
    expect(toNativeMaskColor('rgba(20,20,20,0.7)')).toBe('#141414B3')
    expect(toNativeMaskColor('rgb(255,0,0)')).toBe('#FF0000')
    expect(toNativeMaskColor('var(--x)')).toBeUndefined()
    expect(toNativeMaskColor(undefined)).toBeUndefined()
  })

  it('默认按主题取 Picker 默认蒙层色，自定义优先', () => {
    expect(resolveDuoMaskColor(undefined, 'light')).toBe(DUO_MASK_COLOR_LIGHT)
    expect(resolveDuoMaskColor(undefined, 'dark')).toBe(DUO_MASK_COLOR_DARK)
    expect(DUO_MASK_COLOR_LIGHT).toBe('#00000099')
    expect(resolveDuoMaskColor('#112233', 'dark')).toBe('#112233')
  })
})
