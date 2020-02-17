import { Component, h, ComponentInterface, State, Event, EventEmitter } from '@stencil/core'
import * as Taro from '@tarojs/taro-h5'
import { PullToRefresh } from './pull-to-refresh'

@Component({
  tag: 'taro-view',
  styleUrl: './style/index.css'
})
export class PullDownRefresh implements ComponentInterface {
  @State() refreshing = false

  private isBound = false
  private listeners: any[] = []

  @Event({
    eventName: 'refresh'
  }) onRefresh: EventEmitter

  startPullDownRefresh = () => {
    this.onRefresh.emit()
    this.refreshing = true
  }

  stopPullDownRefresh = () => {
    this.refreshing = false
  }

  bindEvent = () => {
    if (this.isBound) return
    this.isBound = true

    this.listeners = [
      ['__taroStartPullDownRefresh', ({ successHandler, errorHandler }) => {
        try {
          this.startPullDownRefresh()
          successHandler({
            errMsg: 'startPullDownRefresh: ok'
          })
        } catch (e) {
          errorHandler({
            errMsg: 'startPullDownRefresh: fail'
          })
        }
      }],
      ['__taroStopPullDownRefresh', ({ successHandler, errorHandler }) => {
        try {
          this.stopPullDownRefresh()
          successHandler({
            errMsg: 'stopPullDownRefresh: ok'
          })
        } catch (e) {
          errorHandler({
            errMsg: 'stopPullDownRefresh: fail'
          })
        }
      }]
    ]
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.on(evtName, callback)
    })
  }

  unbindEvent = () => {
    this.isBound = false
    this.listeners.forEach(([evtName, callback]) => {
      Taro.eventCenter.off(evtName, callback)
    })
  }

  componentDidLoad () {
    this.bindEvent()
  }

  componentDidUnload () {
    this.unbindEvent()
  }

  render () {
    return (
      <PullToRefresh
        distanceToRefresh={100}
        damping={200}
        refreshing={this.refreshing}
        onRefresh={this.startPullDownRefresh}
      >
        <slot />
      </PullToRefresh>
    )
  }
}
