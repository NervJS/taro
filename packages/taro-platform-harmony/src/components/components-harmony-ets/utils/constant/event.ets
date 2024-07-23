export class TOUCH_EVENT_MAP {
  static readonly TouchTypeUp = 'touchend'
  static readonly TouchTypeMove = 'touchmove'
  static readonly TouchTypeDown = 'touchstart'
  static readonly TouchTypeCancel = 'touchcancel'

  static get (event: TouchType) {
    switch (event) {
      case TouchType.Up: return TOUCH_EVENT_MAP.TouchTypeUp
      case TouchType.Move: return TOUCH_EVENT_MAP.TouchTypeMove
      case TouchType.Down: return TOUCH_EVENT_MAP.TouchTypeDown
      case TouchType.Cancel: return TOUCH_EVENT_MAP.TouchTypeCancel
    }
    return TOUCH_EVENT_MAP.TouchTypeUp
  }

  static values () {
    return [
      TOUCH_EVENT_MAP.TouchTypeUp,
      TOUCH_EVENT_MAP.TouchTypeMove,
      TOUCH_EVENT_MAP.TouchTypeUp,
      TOUCH_EVENT_MAP.TouchTypeUp,
    ]
  }
}
