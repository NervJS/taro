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

  renderItem = ({ item }) => {
    switch (item.name) {
      case 'welcome':
        return <Text>Welcome to React Native!</Text>
      case 'Block':
        return (
          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Block</Text>
            </View>
            <Block />
          </View>
        )
      case 'Button':
        return (
          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Button</Text>
            </View>
            <EXButton />
          </View>
        )
      case 'Checkbox':
        return (
          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Checkbox</Text>
            </View>
            <EXCheckbox />
          </View>
        )
      case 'Form':
        return (
          <View style={styles.section}>
            <View style={styles.sectionTit}>
              <Text style={styles.sectionTitTxt}>Form</Text>
            </View>
            <EXForm />
          </View>
        )
    }
  }

  render () {
    return (
      <Provider>
        <ScrollView
          style={{
            flex: 1,
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
          data={[
            { name: 'welcome' },
            { name: 'Block' },
            { name: 'Button' },
            { name: 'Checkbox' },
            { name: 'Form' },
          ]}
          renderItem={this.renderItem}
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
