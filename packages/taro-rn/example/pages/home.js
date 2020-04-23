import React from 'react'
import { Component } from '@tarojs/taro-rn'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Device } from './device'
import { Media } from './media'
import { File } from './file'
import { Location } from './location'
import { Interface } from './interface'

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: 'row'
  },
  left: {
    width: 70,
    height: 700,
    backgroundColor: '#F7F7F7'
  },
  left_tab_selected: {
    backgroundColor: 'lightgrey'
  },
  left_tab: {
    paddingLeft: 5,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1E8FEE'
  },
  right: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10
  },
  index: {
    fontSize: 18
    // textAlign: 'center'
  }
})

const tabMap = {
  basic: {
    name: '基础',
    component: ''
  },
  interface: {
    name: '界面',
    component: <Interface />
  },
  network: {
    name: '网络',
    component: ''
  },
  storage: {
    name: '数据缓存',
    component: ''
  },
  media: {
    name: '媒体',
    component: <Media />
  },
  location: {
    name: '位置',
    component: <Location />
  },
  share: {
    name: '分享',
    component: ''
  },
  canvas: {
    name: '画布',
    component: ''
  },
  file: {
    name: '文件',
    component: <File />
  },
  open: {
    name: '开放接口',
    component: ''
  },
  device: {
    name: '设备',
    component: <Device />
  },
  worker: {
    name: 'Worker',
    component: ''
  }
}

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tabKey: 'file'
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onPressButton (key) {
    this.setState({ tabKey: key })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.left}>
          {Object.keys(tabMap).map((key) => {
            const tabStyle = this.state.tabKey === key ? [styles.left_tab, styles.left_tab_selected] : styles.left_tab
            return (
              <TouchableOpacity key={key} onPress={this.onPressButton.bind(this, key)}>
                <Text style={tabStyle}>{tabMap[key].name}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
        <View style={styles.right}>
          {tabMap[this.state.tabKey].component}
        </View>
      </View>
    )
  }
}
