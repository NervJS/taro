import { parseWXML } from '../src/wxml'

// 参数顺序  必要在前
interface Option {
  wxml?: string
  path: string
}

jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // 保留原始的其他函数
  appendFile: jest.fn(),
}))

describe('event convertor', () => {
  const option: Option = {
    path: '',
    wxml: ``
  }
  // 解析wxml会通过path进行缓存，得改变path，以下用例涉及parseWXML的同理
  // 事件 bindtap 转换为 onCLick
  test('bindtap', () => {
    option.path = 'bindtap'
    option.wxml = `<button bindtap="handleTap">点击事件1</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onClick')
  })
  // 事件 bind:tap 转换为 onClick
  test('bind:tap', () => {
    option.path = 'bind:tap'
    option.wxml = `<button bind:tap="handleTap">点击事件2</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onClick')
  })

  // 事件 bindtimeupdate 转换为 onTimeUpdate
  test('bindtimeupdate', () => {
    option.path = 'bindtimeupdate'
    option.wxml = `<video bindtimeupdate="handleTimeUpdate">video bindtimeupdate事件</video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTimeUpdate')
  })
  // 事件 bind:timeupdate 转换为 onTimeUpdate
  test('bind:timeupdate', () => {
    option.path = 'bind:timeupdate'
    option.wxml = `<video bind:timeupdate="handleTimeUpdate">video bind:timeupdate</video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTimeUpdate')
  })

  // 事件 bindgetphoneNumber 转换为 onGetPhoneNumber
  test('bindgetphoneNumber', () => {
    option.path = 'bindgetphoneNumber'
    option.wxml = `<button bindgetPhoneNumber="handleGetPhoneNumber">bindgetPhoneNumber 获取手机号码</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onGetPhoneNumber')
  })
  // 事件 bind:getphoneNumber 转换为 onGetPhoneNumber
  test('bind:getPhoneNumber', () => {
    option.path = 'bind:getPhoneNumber'
    option.wxml = `<button bind:getPhoneNumber="handleGetPhoneNumber">bind:getPhoneNumber 获取手机号码</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onGetPhoneNumber')
  })

  // 事件 bindchooseavatar 转换为 onChooseAvatar
  test('bindchooseavatar', () => {
    option.path = 'bindchooseavatar'
    option.wxml = `<button bindchooseavatar="handleChooseAvatar">选择头像</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onChooseAvatar')
  })
  // 事件 bind:chooseavatar 转换为 onChooseAvatar
  test('bind:chooseavatar', () => {
    option.path = 'bind:chooseavatar'
    option.wxml = `<button bind:chooseavatar="handleChooseAvatar">选择头像</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onChooseAvatar')
  })

  // 事件 bindgetrealnameauthinfo 转换为 onGetRealnameAuthInfo
  test('bindgetrealnameauthinfo', () => {
    option.path = 'bindgetrealnameauthinfo'
    option.wxml = `<button bindgetrealnameauthinfo="handleGetRealNameAuthInfo">获取实名认证信息</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onGetRealnameAuthInfo')
  })
  // 事件 bind:getrealnameauthinfo 转换为 onGetRealnameAuthInfo
  test('bind:getrealnameauthinfo', () => {
    option.path = 'bind:getrealnameauthinfo'
    option.wxml = `<button bind:getrealnameauthinfo="handleGetRealNameAuthInfo">获取实名认证信息</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onGetRealnameAuthInfo')
  })

  // 事件 bindopensetting 转换为 onOpenSetting
  test('bindopensetting', () => {
    option.path = 'bindopensetting'
    option.wxml = `<button bindopensetting="handleOpenSetting">打开设置</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onOpenSetting')
  })
  // 事件 bind:opensetting 转换为 onOpenSetting
  test('bind:opensetting', () => {
    option.path = 'bind:opensetting'
    option.wxml = `<button bind:opensetting="handleOpenSetting">打开设置</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onOpenSetting')
  })

  // 事件 bindscancode 转换为 onScanCode
  test('bindscancode', () => {
    option.path = 'bindscancode'
    option.wxml = `<button bindscancode="handleScanCode">扫码</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScanCode')
  })
  // 事件 bind:scancode 转换为 onScanCode
  test('bind:scancode', () => {
    option.path = 'bind:scancode'
    option.wxml = `<button bind:scancode="handleScanCode">扫码</button>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScanCode')
  })

  // 事件 bindstatechange 转换为 onStateChange
  test('bindstatechange', () => {
    option.path = 'bindstatechange'
    option.wxml = `<video bindstatechange="handleVideoStateChange"></video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onStateChange')
  })
  // 事件 bind:statechange 转换为 onStateChange
  test('bind:statechange', () => {
    option.path = 'bind:statechange'
    option.wxml = `<video bind:statechange="handleVideoStateChange"></video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onStateChange')
  })

  // 事件 bindhtouchmove 转换为 onHTouchMove
  test('bindhtouchmove', () => {
    option.path = 'bindhtouchmove'
    option.wxml = `<view bindhtouchmove="handleTouchMove">触摸移动</view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onHTouchMove')
  })
  // 事件 bind:htouchmove 转换为 onHTouchMove
  test('bind:htouchmove', () => {
    option.path = 'bind:htouchmove'
    option.wxml = `<view bind:htouchmove="handleTouchMove">触摸移动</view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onHTouchMove')
  })

  // 事件 bindvtouchmove 转换为 onVTouchMove
  test('bindvtouchmove', () => {
    option.path = 'bindvtouchmove'
    option.wxml = `<movable-view bindvtouchmove="bindvtouchmove">可移动的视图</movable-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onVTouchMove')
  })
  // 事件 bind:vtouchmove 转换为 onVTouchMove
  test('bind:vtouchmove', () => {
    option.path = 'bind:vtouchmove'
    option.wxml = `<movable-view bind:vtouchmove="bindvtouchmove">可移动的视图</movable-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onVTouchMove')
  })

  // 事件 bindcolumnchange 转换为 onColumnChange
  test('bindcolumnchange', () => {
    option.path = 'bindcolumnchange'
    option.wxml = `<picker-view bindcolumnchange="handleColumnChange">
                            <picker-view-column>
                                <!-- 列的内容 -->
                            </picker-view-column>
                            <picker-view-column>
                                <!-- 列的内容 -->
                            </picker-view-column>
                        </picker-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onColumnChange')
  })
  // 事件 bind:columnchange 转换为 onColumnChange
  test('bind:columnchange', () => {
    option.path = 'bind:columnchange'
    option.wxml = `<picker-view bind:columnchange="handleColumnChange">
                            <picker-view-column>
                                <!-- 列的内容 -->
                            </picker-view-column>
                            <picker-view-column>
                                <!-- 列的内容 -->
                            </picker-view-column>
                        </picker-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onColumnChange')
  })

  // 事件 bindscrolltoupper 转换为 onScrollToUpper
  test('bindscrolltoupper', () => {
    option.path = 'bindscrolltoupper'
    option.wxml = `<scroll-view bindscrolltoupper="handleScrollToUpper">
                            <!-- 内容 -->
                        </scroll-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScrollToUpper')
  })
  // 事件 bind:scrolltoupper 转换为 onScrollToUpper
  test('bind:scrolltoupper', () => {
    option.path = 'bind:scrolltoupper'
    option.wxml = `<scroll-view bind:scrolltoupper="handleScrollToUpper">
                            <!-- 内容 -->
                        </scroll-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScrollToUpper')
  })

  // 事件 bindscrolltolower 转换为 onScrollToLower
  test('bindscrolltolower', () => {
    option.path = 'bindscrolltolower'
    option.wxml = `<scroll-view bindscrolltolower="handleScrollToLower">
                            <!-- 内容 -->
                        </scroll-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScrollToLower')
  })
  // 事件 bind:scrolltolower 转换为 onScrollToLower
  test('bind:scrolltolower', () => {
    option.path = 'bind:scrolltolower'
    option.wxml = `<scroll-view bind:scrolltolower="handleScrollToLower">
                            <!-- 内容 -->
                        </scroll-view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onScrollToLower')
  })

  // 事件 bindanimationfinish 转换为 onAnimationFinish
  test('bindanimationfinish', () => {
    option.path = 'bindanimationfinish'
    option.wxml = `<animation bindanimationfinish="handleAnimationFinish">
                            <!-- 动画内容 -->
                        </animation>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationFinish')
  })
  // 事件 bind:animationfinish 转换为 onAnimationFinish
  test('bind:animationfinish', () => {
    option.path = 'bind:animationfinish'
    option.wxml = `<animation bind:animationfinish="handleAnimationFinish">
                            <!-- 动画内容 -->
                        </animation>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationFinish')
  })

  // 事件 bindfullscreenchange 转换为 onFullscreenChange
  test('bindfullscreenchange', () => {
    option.path = 'bindfullscreenchange'
    option.wxml = `<video bindfullscreenchange="handleFullScreenChange"></video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onFullscreenChange')
  })
  // 事件 bind:fullscreenchange 转换为 onFullscreenChange
  test('bind:fullscreenchange', () => {
    option.path = 'bind:fullscreenchange'
    option.wxml = `<video bind:fullscreenchange="handleFullScreenChange"></video>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onFullscreenChange')
  })

  // 事件 bindtouchstart 转换为 onTouchStart
  test('bindtouchstart', () => {
    option.path = 'bindtouchstart'
    option.wxml = `<view bindtouchstart="handleTouchStart">
                        <!-- 触摸区域内容 -->
                    </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchStart')
  })
  // 事件 bind:touchstart 转换为 onTouchStart
  test('bind:touchstart', () => {
    option.path = 'bind:touchstart'
    option.wxml = `<view bind:touchstart="handleTouchStart">
                          <!-- 触摸区域内容 -->
                      </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchStart')
  })

  // 事件 bindtouchmove 转换为 onTouchMove
  test('bindtouchmove', () => {
    option.path = 'bindtouchmove'
    option.wxml = `<view bindtouchmove="handleTouchMove">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchMove')
  })
  // 事件 bind:touchmove 转换为 onTouchMove
  test('bind:touchmove', () => {
    option.path = 'bind:touchmove'
    option.wxml = `<view bind:touchmove="handleTouchMove">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchMove')
  })

  // 事件 bindtouchcancel 转换为 onTouchCancel
  test('bindtouchcancel', () => {
    option.path = 'bindtouchcancel'
    option.wxml = `<view bindtouchcancel="handleTouchCancel">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchCancel')
  })
  // 事件 bind:touchcancel 转换为 onTouchCancel
  test('bind:touchcancel', () => {
    option.path = 'bind:touchcancel'
    option.wxml = `<view bind:touchcancel="handleTouchCancel">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchCancel')
  })

  // 事件 bindtouchend 转换为 onTouchEnd
  test('bindtouchend', () => {
    option.path = 'bindtouchend'
    option.wxml = `<view bindtouchend="handleTouchEnd">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchEnd')
  })
  // 事件 bind:touchend 转换为 onTouchEnd
  test('bind:touchend', () => {
    option.path = 'bind:touchend'
    option.wxml = `<view bind:touchend="handleTouchEnd">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchEnd')
  })

  // 事件 bindlongpress 转换为 onLongPress
  test('bindlongpress', () => {
    option.path = 'bindlongpress'
    option.wxml = `<view bindlongpress="handleLongPress">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onLongPress')
  })
  // 事件 bind:longpress 转换为 onLongPress
  test('bind:longpress', () => {
    option.path = 'bind:longpress'
    option.wxml = `<view bind:longpress="handleLongPress">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onLongPress')
  })

  // 事件 bindlongclick 转换为 onLongClick
  test('bindlongclick', () => {
    option.path = 'bindlongclick'
    option.wxml = `<view bindlongclick="handleLongPress">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onLongClick')
  })
  // 事件 bind:longclick 转换为 onLongClick
  test('bind:longclick', () => {
    option.path = 'bind:longclick'
    option.wxml = `<view bind:longclick="handleLongPress">
                            <!-- 触摸区域内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onLongClick')
  })

  // 事件 bindtransitionend 转换为 onTransitionEnd
  test('bindtransitionend', () => {
    option.path = 'bindtransitionend'
    option.wxml = `<view bindtransitionend="handleTransitionEnd" style="transition: all 1s;">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTransitionEnd')
  })
  // 事件 bind:transitionend 转换为 onTransitionEnd
  test('bind:transitionend', () => {
    option.path = 'bind:transitionend'
    option.wxml = `<view bind:transitionend="handleTransitionEnd" style="transition: all 1s;">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTransitionEnd')
  })

  // 事件 bindanimationstart 转换为 onAnimationStart
  test('bindanimationstart', () => {
    option.path = 'bindanimationstart'
    option.wxml = `<view bindanimationstart="handleAnimationStart" animation="{{myAnimation}}">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationStart')
  })
  // 事件 bind:animationstart 转换为 onAnimationStart
  test('bind:animationstart', () => {
    option.path = 'bind:animationstart'
    option.wxml = `<view bind:animationstart="handleAnimationStart" animation="{{myAnimation}}">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationStart')
  })

  // 事件 bindanimationiteration 转换为 onAnimationIteration
  test('bindanimationiteration', () => {
    option.path = 'bindanimationiteration'
    option.wxml = `<view bindanimationiteration="handleAnimationIteration" animation="{{myAnimation}}">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationIteration')
  })
  // 事件 bind:animationiteration 转换为 onAnimationIteration
  test('bind:animationiteration', () => {
    option.path = 'bind:animationiteration'
    option.wxml = `<view bind:animationiteration="handleAnimationIteration" animation="{{myAnimation}}">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationIteration')
  })

  // 事件 bindanimationend 转换为 onAnimationEnd
  test('bindanimationend', () => {
    option.path = 'bindanimationend'
    option.wxml = `<view bindanimationend="handleAnimationEnd" animation="{{myAnimation}}" >
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationEnd')
  })
  // 事件 bind:animationend 转换为 onAnimationEnd
  test('bind:animationend', () => {
    option.path = 'bind:animationend'
    option.wxml = `<view bind:animationend="handleAnimationEnd" animation="{{myAnimation}}" >
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onAnimationEnd')
  })

  // 事件 bindtouchforcechange 转换为 onTouchForceChange
  test('bindtouchforcechange', () => {
    option.path = 'bindtouchforcechange'
    option.wxml = `<view bindtouchforcechange="handleTouchForceChange">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchForceChange')
  })
  // 事件 bind:touchforcechange 转换为 onTouchForceChange
  test('bind:touchforcechange', () => {
    option.path = 'bind:touchforcechange'
    option.wxml = `<view bind:touchforcechange="handleTouchForceChange">
                            <!-- 元素内容 -->
                        </view>`
    const { wxml }: any = parseWXML(option.path, option.wxml)
    expect(wxml.openingElement.attributes[0].name.name).toBe('onTouchForceChange')
  })
})