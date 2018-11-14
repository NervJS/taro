import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  View,
  Button,
  Tabbar,
  TabbarContainer,
  TabbarPanel,
} from './src'
import EXButton from './example/EXButton'
import EXCheckbox from './example/EXCheckbox'
import EXIcon from './example/EXIcon'
import EXImage from './example/EXImage'
import EXSwiper from './example/EXSwiper'
import EXTextinput from './example/EXTextinput'
import EXSwitch from './example/EXSwitch'
import EXSlider from './example/EXSlider'
import EXRadio from './example/EXRadio'
import EXProgress from './example/EXProgress'
import EXRichText from './example/EXRichText'
import EXPicker from './example/EXPicker'
import EXForm from './example/EXForm'
import EXAudio from './example/EXAudio'
import EXVideo from './example/EXVideo'

export default class App extends Component {
  state = {
    // 更改scrollTop可滚动
    scrollTop: 0
  }

  onViewTouchstart = () => {
    console.log('view toucstart')
  }

  onViewTouchmove = () => {
    console.log('view touchmove')
  }

  onViewTouchend = () => {
    console.log('view touchend')
  }

  render() {
    // return (
    //   <TabbarContainer>
    //     <TabbarPanel style={{ backgroundColor: 'red' }}>
    //       <Text>heheheheheheh</Text>
    //     </TabbarPanel>
    //     <Tabbar
    //       conf={{
    //         list: [
    //           { text: '首页', selectedIconPath: 'http://via.placeholder.com/27', iconPath: 'http://via.placeholder.com/27' },
    //           { text: '签到', selectedIconPath: 'http://via.placeholder.com/27', iconPath: 'http://via.placeholder.com/27' },
    //           { text: '我的', selectedIconPath: 'http://via.placeholder.com/27', iconPath: 'http://via.placeholder.com/27' }
    //         ]
    //       }}
    //     />
    //   </TabbarContainer>
    // )
    // for (let key in global) {
    //   if (global.hasOwnProperty(key)) {
    //     console.log(key)
    //   }
    // }
    for (let key in global.window) {
      if (global.window.hasOwnProperty(key)) {
        console.log(key)
      }
    }
    return (
      <ScrollView
        style={{
          backgroundColor: '#f5fcff',
          alignItems: 'center',
          paddingVertical: 50
        }}
        scrollTop={this.state.scrollTop}
        scrollWithAnimation={true}
        enableBackToTop={false}
        onScrollToUpper={() => {
          console.log('to upper')
        }}
        onScrollToLower={() => {
          console.log('to lower')
        }}
        onScroll={(e) => {
          console.log('onScroll', e)
        }}
      >
        <Text>Welcome to React Native!</Text>

        <EXVideo />

        <Text numberOfLines={1}>Welcome to React Native!Welcome to React Native!Welcome to React Native!Welcome to React Native!</Text>

        <EXAudio />

        <View
          hoverStyle={{ backgroundColor: 'green' }}
          style={{ padding: 50, backgroundColor: 'orange' }}
        >
          <View
            onClick={() => { console.log('you click me') }}
            // onLongPress={() => { console.log('you longpress me') }}
            // onTouchstart={this.onViewTouchstart}
            // onTouchmove={this.onViewTouchmove}
            // onTouchend={this.onViewTouchend}
            style={{
              width: 250,
              height: 250,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'pink'
            }}
            hoverStyle={{
              backgroundColor: 'green'
            }}
          >
            <Button
              onClick={() => { alert('Hey, click button nested in view!') }}
              style={{
                width: 200
              }}
            >
              default
            </Button>
          </View>
        </View>

        <Text>Swiper</Text>
        <EXSwiper />

        <Text>Icon</Text>
        <EXIcon />

        <Text>Picker</Text>
        <EXPicker />

        <Text>RichText</Text>
        <EXRichText />

        <Text>Progress</Text>
        <EXProgress />

        <Text>Radio（Single|Group）</Text>
        <EXRadio />

        <Text>Slider</Text>
        <EXSlider />

        <Text>Switch</Text>
        <EXSwitch />

        <Text>Image</Text>
        <EXImage />

        <Text>Checkbox（Single & Group）</Text>
        <EXCheckbox />

        <Text>Input & Textarea</Text>
        <EXTextinput />

        <Text>Button</Text>
        <EXButton />

        <Text>Form</Text>
        <EXForm />
      </ScrollView>
    )
  }
}
