import _display from '@ohos.display'
import { TaroAny } from '@tarojs/runtime';
import { systemContext } from './system'


interface ILayout {
  width: number;
  height: number;
}

interface IPXTransformParam {
  baseFontSize?: number;
  deviceRatio?: Record<string | number, number>;
  designWidth?: number | ((size?: string | number) => number);
  targetUnit?: string;
  unitPrecision?: number;
}

const FOLD_SPLIT_MAX_WIDTH = 1500;

export function initStyleSheetConfig(layout: ILayout = { width: 0, height: 0 }, config: IPXTransformParam = {},
  navHeight = 0) {
  const display = _display.getDefaultDisplaySync()

  let logicWidth = layout.width ? layout.width * display.densityPixels : display.width
  logicWidth = logicWidth > FOLD_SPLIT_MAX_WIDTH ? logicWidth / 2 : logicWidth
  const designWidth: number =
    (typeof config.designWidth === 'function' ? config.designWidth(0) : config.designWidth) || 750
  return {
    // 设计稿比例基准
    designRatio: logicWidth / designWidth / display.densityPixels,
    // vp -> px比例，逻辑像素和物理像素的比值
    densityPixels: display.densityPixels,
    // 屏幕宽度:单位vp
    deviceWidth: display.width / display.densityPixels,
    // 屏幕高度:单位vp
    deviceHeight: display.height / display.densityPixels,
    // 窗口宽度:单位vp
    viewportWidth: layout.width || (display.width / display.densityPixels),
    // 窗口高度:单位vp
    viewportHeight: (layout.height || (display.height / display.densityPixels)) - navHeight,
    // 安全区域:单位vp
    safeArea: systemContext.safeArea,
    // 显示设备的显示字体的缩放因子。该参数为浮点数，通常与densityPixels相同
    scaledDensity: display.scaledDensity,
    // 表示屏幕当前显示的方向
    orientation: display.orientation,
    // 显示设备屏幕的物理像素密度，表示每英寸上的像素点数。该参数为浮点数，单位为px，支持的范围为[80.0，640.0]。一般取值160.0、480.0等，实际能取到的值取决于不同设备设置里提供的可选值
    densityDPI: display.densityDPI
  } as TaroAny as Record<string, number>
}
