import { Component } from 'react'

export interface Instance extends Component {
  componentDidShow?(): void
  componentDidHide?(): void
  onShow?(): void
  onHide?(): void
  onPullDownRefresh?(): void
  onReachBottom?(): void
  onPageScroll?(obj: { scrollTop: number }): void
  onShareAppMessage?(obj: { from: string, target: Record<string, string>, webViewUrl: string }): void
  onResize?(): void
  onTabItemTap?(obj: { index: string, pagePath: string, text: string }): void
  componentWillPreload?(): void
  onTitleClick?(): void
  onOptionMenuClick?(): void
  onPopMenuClick?(): void
  onPullIntercept?(): void
}
