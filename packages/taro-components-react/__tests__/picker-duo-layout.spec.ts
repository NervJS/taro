import { duoInfoSignature, HALF_SHEET_MAX_CSS_PX, resolveDuoSheetLayout } from '../src/components/picker/duo-layout'

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
