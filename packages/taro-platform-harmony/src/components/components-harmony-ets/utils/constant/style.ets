// 各种组件的默认样式

export const TEXT_DEFAULT_STYLE = {
  COLOR: 'black',
  FONT_SIZE: '24',
  FONT_WEIGHT: FontWeight.Normal,
  FONT_FAMILY: 'HarmonyOS Sans'
}

export const BUTTON_THEME_COLOR = {
  default: {
    text: '#000',
    background: '#f7f7f7',
  },
  primary: {
    text: '#fff',
    background: '#1aad19',
  },
  warn: {
    text: '#fff',
    background: '#e64340'
  }
}

export const INPUT_TYPE_MAP = {
  text: InputType.Normal,
  number: InputType.Number,
  idcard: InputType.Number,
  ['safe-password']: InputType.Password,
}

export const INPUT_CONFIRM_MAP = {
  go: EnterKeyType.Go,	// 右下角按钮为“前往”
  send: EnterKeyType.Send,	// 右下角按钮为“发送”
  done: EnterKeyType.Done,	// 右下角按钮为“完成”
  next: EnterKeyType.Next,	// 右下角按钮为“下一个”
  search: EnterKeyType.Search,	// 右下角按钮为“搜索”
}

export const CurveMap = {
  default: Curve.Linear,
  linear: Curve.Linear,
  easeInCubic: Curve.EaseIn,
  easeOutCubic: Curve.EaseOut,
  easeInOutCubic: Curve.EaseInOut,
}
