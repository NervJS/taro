import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  Provider,
  Block,
  // ScrollView,
  View,
  Text,
  Button,
  Image
} from '../dist'
import ScrollView from '../dist/components/ScrollView/ScrollViewExperimental'
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
          onScrollToUpper={() => {
            console.log('to upper')
          }}
          onScrollToLower={() => {
            console.log('to lower')
          }}
          lowerThreshold={500}
          onScroll={(e) => {
            // console.log('onScroll', e)
          }}
          bounces={false}

          // Experimental
          data={[{ height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }, { height: 50 }, { height: 80 }, { height: 60 }]}
          heightForItem={(item) => item.height}
          renderHeader={() => (
            <View>
              <Text>Welcome to React Native!</Text>
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
            </View>
          )}
          renderItem={(item, index) => {
            return (
              <View style={{ flex: 1, margin: 5, backgroundColor: 'red' }} />
            )
          }}
        />
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
