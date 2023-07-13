import './movable-view.scss'

import React from 'react'
import { Button, MovableArea, MovableView, View } from '@tarojs/components'

import Header from '../../../components/head/head'
import ComponentState from '../../../components/component_state/component_state'

export default class PageView extends React.Component {

  state = {
    x: 0,
    y: 0,
    scale: 2,
  }

  tap = () => {
    this.setState({
      x: 30,
      y: 30
    })
  }

  tap2 = () => {
    this.setState({
      scale: 3
    })
  }

  onChange(e) {
    console.log(e.detail)
  }

  onScale(e) {
    console.log(e.detail)
  }

  render() {
    return (
      <View className='components-page'>
        <View className='components-page__header'>
          <Header title='Image'></Header>
           <ComponentState platform='H5' rate='90'> </ComponentState>
        </View>
        <View className='components-page__body'>
          <View className="page-section">
            <View className="page-section-title first">movable-view区域小于movable-area</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} x={this.state.x} y={this.state.y} direction="all">text</MovableView>
            </MovableArea>
          </View>
          <View className="btn-area">
            <Button onClick={this.tap} className="page-body-button" type="primary">点击移动到 (30px, 30px)</Button>
          </View>

          <View className="page-section">
            <View className="page-section-title">movable-view区域大于movable-area</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} class="max" direction="all">text</MovableView>
            </MovableArea>
          </View>

          <View className="page-section">
            <View className="page-section-title">只可以横向移动</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} direction="horizontal">text</MovableView>
            </MovableArea>
          </View>

          <View className="page-section">
            <View className="page-section-title">只可以纵向移动</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} direction="vertical">text</MovableView>
            </MovableArea>
          </View>

          <View className="page-section">
            <View className="page-section-title">可超出边界</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} direction="all" out-of-bounds>text</MovableView>
            </MovableArea>
          </View>

          <View className="page-section">
            <View className="page-section-title">带有惯性</View>
            <MovableArea className={"movable-area"}>
              <MovableView className={"movable-view"} direction="all" inertia>text</MovableView>
            </MovableArea>
          </View>

          <View className="page-section">
            <View className="page-section-title">可放缩</View>
            <MovableArea className={"movable-area"} scale-area>
              <MovableView className={"movable-view"} direction="all" bindchange={this.onChange} bindscale={this.onScale} scale scale-min="0.5"
                           scale-max="4" scale-value={this.state.scale}>text
              </MovableView>
            </MovableArea>
          </View>

          <View className="btn-area">
            <Button onClick={this.tap2} className="page-body-button" type="primary">点击放大3倍</Button>
          </View>
        </View>
      </View>
    )
  }
}
