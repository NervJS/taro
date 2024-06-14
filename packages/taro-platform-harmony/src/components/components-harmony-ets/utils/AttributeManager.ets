import { convertNumber2VP, TaroAny } from '@tarojs/runtime'
import matrix4 from '@ohos.matrix4'

type matrixNums = [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number]

interface IRotate {
  x?: number,
  y?: number,
  z?: number,
  angle: number | string,
  centerX?: number | string,
  centerY?: number | string
}

interface ITranslate {
  x?: number | string,
  y?: number | string,
  z? : number | string
}

interface IScale {
  x?: number,
  y?: number,
  z?: number,
  centerX?: number | string,
  centerY?: number | string
}

interface ITransform {
  rotate: IRotate
  translate: ITranslate
  scale: IScale
  transform?: matrix4.Matrix4Transit
}

class AttributeManager {

  static getNodeStyle<T = TaroAny> (style: TaroAny = {}, name: string, defaultValue?: TaroAny): T {
    const res: TaroAny = style[name]

    if (res === undefined) return defaultValue

    return res
  }

  static getTextAlign (style: TaroAny = {}): TextAlign {
    const value: string = style.textAlign
    switch (value) {
      case 'right':
        return TextAlign.End
      case 'center':
        return TextAlign.Center
      default:
        return TextAlign.Start
    }
  }

  static getNodeAnimationData (style: TaroAny = {}): TaroAny {
    let res: TaroAny = {}
    const dataValue: string = AttributeManager.getNodeStyle(style, 'animation')

    if (dataValue) {
      let values: string[] = dataValue.toString().trim().split(new RegExp("/\s+/"))
      switch (values.length) {
        case 4:
          res = { duration: values[0], curve: values[1], delay: values[2] }
          break
        case 8:
          res = { duration: values[0], curve: values[1], delay: values[2], iterations: values[3], playMode: values[4] }
          break
        default:
          break
      }

      Object.keys(res).forEach(key => {
        if (!isNaN(res[key]) && values.length > 1) {
          res[key] = convertNumber2VP(res[key])
        }
      })
    }

    let playMode: PlayMode
    switch (AttributeManager.getNodeStyle(style, 'animationDirection') || res.playMode) {
      case 'reverse':
        playMode = PlayMode.Reverse
        break
      case 'alternate':
        playMode = PlayMode.Alternate
        break
      case 'alternate-reverse':
        playMode = PlayMode.AlternateReverse
        break
      case 'normal':
      default:
        playMode = PlayMode.Normal
    }
    return {
      duration: AttributeManager.parseTime2Number(AttributeManager.getNodeStyle(style, 'animationDuration') || res.duration || 1000),
      tempo: 1,
      curve: AttributeManager.getNodeStyle(style, 'animationTimingFunction') || res.curve || Curve.EaseInOut,
      delay: AttributeManager.parseTime2Number(AttributeManager.getNodeStyle(style, 'animationDelay') || res.delay || 0),
      iterations: Number(AttributeManager.getNodeStyle(style, 'animationIterationCount') || res.iterations) || 1,
      playMode,
      // TODO onFinish
    }
  }

  static parseTime2Number (time = ''): number {
    if (typeof time === 'number') return time
    if (time === 'infinite') return Infinity
    if (time === 'auto') return 0

    const matchs = time.match(new RegExp("/^(\d*)([a-z]*)$/")) || []

    const value = matchs[1]
    const unit = matchs[2]

    let ms = Number(value)
    switch (unit) {
      case 's':
        ms *= 1000
        break
      case 'ms':
      default:
        ms *= 1
    }
    return ms
  }

  static getTransform(style: TaroAny = {}): ITransform {
    const transform: string = style.transform || ''
    const transformOrigin: string = AttributeManager.getNodeStyle(style, 'transformOrigin') || '0 0'

    const origin: (string | number)[] = transformOrigin.split(new RegExp("/\s+/")).map(item => item)

    const result: ITransform = {
      rotate: { angle: 0 },
      translate: {},
      scale: {},
    }
    let resultTransform: matrix4.Matrix4Transit

    const matches: string[] = transform.match(new RegExp("/(\w+)\(([^)]+)\)/g")) || [];

    // 处理matrix

    matches.forEach(match => {
      const matchs = match.split(new RegExp("/\(|\)/")).filter(Boolean);
      const name: string = matchs[0]
      const params: string[] = []
      for (let i = 1; i < matchs.length; i++) {
        params.push(matchs[i])
      }

      switch (name) {
        case 'translateX':
          result.translate.x = parseTransformUnit(params[0])
          break;
        case 'translateY':
          result.translate.y = parseTransformUnit(params[0])
          break;
        case 'translateZ':
          result.translate.z = parseTransformUnit(params[0])
          break;
        case 'scaleX':
          result.scale.x = parseFloat(params[0])
          break;
        case 'scaleY':
          result.scale.y = parseFloat(params[0])
          break;
        case 'scaleZ':
          result.scale.z = parseFloat(params[0])
          break;
        case 'rotateX':
          result.rotate.x = parseFloat(params[0])
          break;
        case 'rotateY':
          result.rotate.y = parseFloat(params[0])
          break;
        case 'rotateZ':
          result.rotate.z = parseFloat(params[0])
          break;
        case 'translate':
          const xy = params[0].split(new RegExp("/\s*,\s*/"))
          result.translate.x = parseTransformUnit(xy[0])
          result.translate.y = parseTransformUnit(xy[1])
          break;
        case 'translate3d':
          const xyz = params[0].split(new RegExp("/\s*,\s*/"))
          result.translate.x = parseTransformUnit(xyz[0])
          result.translate.y = parseTransformUnit(xyz[1])
          result.translate.z = parseTransformUnit(xyz[2])
          break;
        case 'scale':
          result.scale.x = parseFloat(params[0])
          result.scale.y = parseFloat(params[1]) || result.scale.x
          break;
        case 'scale3d':
          result.scale.x = parseFloat(params[0])
          result.scale.y = parseFloat(params[1]) || result.scale.x
          result.scale.z = parseFloat(params[2]) || result.scale.x
          break;
        case 'rotate':
          const angle = parseFloat(params[0])
          const axis = parseTransformUnit(params[1]) || 'z';
          switch (axis) {
            case 'x': result.rotate.x = angle; break
            case 'y': result.rotate.y = angle; break
            case 'z': result.rotate.z = angle; break
          }
          break;
        case 'rotate3d':
          result.rotate.x = parseFloat(params[0]) || 0
          result.rotate.y = parseFloat(params[1]) || 0
          result.rotate.z  = parseFloat(params[2]) || 0
          break;
        case 'matrix':
          const matrixArr: number[] = params[0].split(',').map(item => parseFloat(item))
          result.transform = matrix4.init(convertMatrixToMatrix3d(matrixArr))
          break;
        case 'matrix3d':
          const matrix3dArr: number[] = params[0].split(',').map(item => parseFloat(item))
          result.transform = matrix4.init(matrix3dArr as matrixNums)
          break;
      }
    })

    return result
  }
}


function parseTransformUnit (val: string) {
  return parseFloat(val) === 0 ? 0 : val
}


// matrix 转 matrix3d
function convertMatrixToMatrix3d(matrix2d: number[]): matrixNums {
  const matrix3d: number[] = new Array(16).fill(0);
  matrix3d[0] = matrix2d[0];
  matrix3d[5] = matrix2d[3];
  matrix3d[10] = 1;
  matrix3d[15] = 1;
  matrix3d[12] = matrix2d[4];
  matrix3d[13] = matrix2d[5];
  return matrix3d as matrixNums;
}

export { AttributeManager }
