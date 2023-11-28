class ETouchEvent {
  static readonly TouchTypeUp = 'touchend';
  static readonly TouchTypeMove = 'touchmove';
  static readonly TouchTypeDowm = 'touchstart';
  static readonly TouchTypeCancel = 'touchcancel';
}

export function TOUCH_EVENT_MAP(event: TouchType) {
  switch (event) {
    case TouchType.Up: return ETouchEvent.TouchTypeUp
    case TouchType.Move: return ETouchEvent.TouchTypeMove
    case TouchType.Down: return ETouchEvent.TouchTypeDowm
    case TouchType.Cancel: return ETouchEvent.TouchTypeCancel
  }
}