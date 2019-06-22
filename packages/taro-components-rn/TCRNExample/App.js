import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Provider,
  Block,
  ScrollView,
  View,
  Text,
  Button,
  Image
} from '../dist'
// import EXAudio from './example/EXAudio'
import EXButton from './example/EXButton'
import EXCheckbox from './example/EXCheckbox'
import EXForm from './example/EXForm'
import EXIcon from './example/EXIcon'
import EXImage from './example/EXImage'
import EXInput from './example/EXInput'
// import EXMap from './example/EXMap'
import EXPicker from './example/EXPicker'
import EXProgress from './example/EXProgress'
import EXRadio from './example/EXRadio'
import EXRichText from './example/EXRichText'
import EXSlider from './example/EXSlider'
import EXSwiper from './example/EXSwiper'
import EXSwitch from './example/EXSwitch'
// import EXVideo from './example/EXVideo'
import EXWebView from './example/EXWebView'

export default class App extends Component {
  state = {
    // 更改 scrollTop 可滚动
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

  componentDidMount () {
    // setTimeout(() => {
    //   this.setState({ scrollTop: 2200 })
    // }, 0)
  }

  render () {
    return (
      <Provider>
        <ScrollView
          style={{
            backgroundColor: '#f5fcff',
            alignItems: 'center'
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
          bounces={false}
        >
          <Text>Welcome to React Native!</Text>

          {/* <EXAudio /> */}

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Block</Text>
            </View>
            <Block />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Button</Text>
            </View>
            <EXButton />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Checkbox</Text>
            </View>
            <EXCheckbox />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Form</Text>
            </View>
            <EXForm />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Icon</Text>
            </View>
            <EXIcon />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Image</Text>
            </View>
            <EXImage />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Input & Textarea</Text>
            </View>
            <EXInput />
          </View>

          {/* <EXMap /> */}

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Picker</Text>
            </View>
            <EXPicker />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Progress</Text>
            </View>
            <EXProgress />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Radio</Text>
            </View>
            <EXRadio />
          </View>

          <View style={[styles.section, { backgroundColor: 'green' }]}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>RichText</Text>
            </View>
            <EXRichText />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>ScrollView (scrollX)</Text>
            </View>
            <ScrollView
              scrollX
              style={{
                display: 'flex',
                width: 300,
                backgroundColor: 'red',
                // top: 0,
                // zIndex: 1,
                // position: 'absolute',
                // left: 60,
                // flexDirection: 'row'
              }}
            >
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
              <View><Text>LongLong~</Text></View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Slider</Text>
            </View>
            <EXSlider />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Swiper</Text>
            </View>
            <EXSwiper />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Switch</Text>
            </View>
            <EXSwitch />
          </View>

          {/* <EXVideo /> */}

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>WebView</Text>
            </View>
            <EXWebView />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>其它</Text>
            </View>
            <Text numberOfLines={1}>Welcome to React Native!Welcome to React Native!Welcome to React Native!Welcome to React Native!</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 300, height: 200 }}>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'red' }}></View>
              <View style={{ width: '33.33%', height: 100, backgroundColor: 'green' }}></View>
            </View>

            <View
              hoverStyle={{ backgroundColor: 'green' }}
              style={{ width: 300, padding: 50, backgroundColor: 'orange' }}
            >
              <View
                onClick={() => { console.log('you click me') }}
                // onLongPress={() => { console.log('you longpress me') }}
                // onTouchstart={this.onViewTouchstart}
                // onTouchend={this.onViewTouchend}
                style={{
                  width: 200,
                  height: 200,
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
                    width: 150
                  }}
                >
                  default
                </Button>
              </View>
            </View>

            <Image
              onClick={() => { console.log('click on Image') }}
              src={'https://storage.360buyimg.com/mtd/home/jdlogo1529462435227.png'}
              style={{
                width: 250,
                height: 50
              }}
            />

            <View style={{ flexDirection: 'row', width: '100%', height: 50 }}>
              <View style={{ flex: 1, backgroundColor: 'red' }} onClick={() => {}} />
              <View style={{ flex: 1, backgroundColor: 'green' }} onClick={() => {}} />
              <View style={{ flex: 1, backgroundColor: 'yellow' }} onClick={() => {}} />
            </View>
          </View>

          <Text>- THE END -</Text>
        </ScrollView>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gold'
  },
  sectionTit: {
    marginBottom: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'tomato',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#666',
    borderRightWidth: 3,
    borderRightColor: '#666'
  },
  sectionTitTxt: {
    fontSize: 18,
    color: 'white'
  }
})
