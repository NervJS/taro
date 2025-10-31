// 各种组件的默认样式

export class TEXT_DEFAULT_STYLE {
  static COLOR = 'black'
  static FONT_SIZE = '24'
  static FONT_WEIGHT = FontWeight.Normal
  static FONT_FAMILY = 'HarmonyOS Sans'
  static TEXT_ALIGN = TextAlign.Start
  static TEXT_OVERFLOW = TextOverflow.Clip
}

interface IBUTTON_THEME_COLOR {
  text: Color
  background: string
  plainText: string | Color
}

export class BUTTON_THEME_COLOR {
  static get (type: string): IBUTTON_THEME_COLOR {
    switch (type) {
      case 'primary': return {
        text: Color.White,
        background: '#1aad19',
        plainText: '#1aad19'
      }
      case 'warn': return {
        text: Color.White,
        background: '#e64340',
        plainText: '#e64340'
      }
      default: return {
        text: Color.Black,
        background: '#f7f7f7',
        plainText: Color.Black
      }
    }
  }
}

export class INPUT_TYPE_MAP {
  static get (type: string) {
    switch (type) {
      case 'text': return InputType.Normal;
      case 'number': return InputType.Number;
      case 'idcard': return InputType.Number;
      case 'safe-password': return InputType.Password;
    }
    return InputType.Normal
  }
}

export class INPUT_CONFIRM_MAP {
  static go = EnterKeyType.Go	// 右下角按钮为“前往”
  static send = EnterKeyType.Send	// 右下角按钮为“发送”
  static done = EnterKeyType.Done	// 右下角按钮为“完成”
  static next = EnterKeyType.Next	// 右下角按钮为“下一个”
  static search = EnterKeyType.Search	// 右下角按钮为“搜索”

  static get (type: string) {
    switch (type) {
      case 'go': return EnterKeyType.Go
      case 'send': return EnterKeyType.Send
      case 'done': return EnterKeyType.Done
      case 'next': return EnterKeyType.Next
      case 'search': return EnterKeyType.Search
    }
    return EnterKeyType.Done
  }
}

export class CurveMap {
  static default = Curve.Linear
  static linear = Curve.Linear
  static easeInCubic = Curve.EaseIn
  static easeOutCubic = Curve.EaseOut
  static easeInOutCubic = Curve.EaseInOut
}

export class BORDER_STYLE_MAP {
  static solid = BorderStyle.Solid
  static dotted = BorderStyle.Dotted
  static dashed = BorderStyle.Dashed

  static get(type: string): BorderStyle {
    switch (type) {
      case 'dotted': return BorderStyle.Dotted;
      case 'dashed': return BorderStyle.Dashed;
      default: return BorderStyle.Solid;
    }
  }
}
