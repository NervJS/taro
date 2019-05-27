import React, { Component } from 'react'
import { AppRegistry, View, StyleSheet } from 'react-native'
import {
  JDText
} from '@jdreact/jdreact-core-lib'

class JDReactTaroDemo extends Component {
  render () {
    return (
      <View style={styles.container}>
        <JDText>Hello, JDReactTaroDemo</JDText>
      </View>
    )
  }
}

AppRegistry.registerComponent('JDReactTaroDemo', () => JDReactTaroDemo)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
var app = document.getElementById('m_common_content')
if (!app) {
  app = document.createElement('div')
  document.body.appendChild(app)
}
AppRegistry.runApplication('JDReactTaroDemo', {
  rootTag: app
})
