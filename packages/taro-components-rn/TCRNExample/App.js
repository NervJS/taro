/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Provider, ScrollView, View, Text, Button } from '../dist'
import EXButton from './example/EXButton'
import EXCheckbox from './example/EXCheckbox'
import EXIcon from './example/EXIcon'
import EXImage from './example/EXImage'
import EXTextinput from './example/EXTextinput'
import EXSwitch from './example/EXSwitch'
import EXSlider from './example/EXSlider'
import EXRadio from './example/EXRadio'
import EXProgress from './example/EXProgress'
import EXRichText from './example/EXRichText'
import EXPicker from './example/EXPicker'
import EXForm from './example/EXForm'
// import EXAudio from './example/EXAudio'
// import EXVideo from './example/EXVideo'
// import EXMap from './example/EXMap'
import EXWebView from './example/EXWebView'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
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
    return (
      <Provider>
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
          // scrollX={true}
        >
          <Text>Welcome to React Native!</Text>

          <Text>Picker</Text>
          <EXPicker />

          {/* <EXMap /> */}

          <EXImage />

          {/* <EXVideo /> */}

          <Text numberOfLines={1}>Welcome to React Native!Welcome to React Native!Welcome to React Native!Welcome to React Native!</Text>

          {/* <EXAudio /> */}

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: 200 }}>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
            <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
          </View>

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
              onClick={() => { console.log('Hey, click button nested in view!') }}
              style={{
                width: 200
              }}
            >
              default
            </Button>
          </View>
          </View>

          <Text>Icon</Text>
          <EXIcon />

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
          {/* <EXImage /> */}

          <Text>Checkbox（Single & Group）</Text>
          <EXCheckbox />

          <Text>Input & Textarea</Text>
          <EXTextinput />

          <Text>Button</Text>
          <EXButton />

          <Text>Form</Text>
          <EXForm />

          <Text>WebView</Text>
          <EXWebView />
        </ScrollView>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
});
