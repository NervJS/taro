import React from 'react'
import { Animated, StyleSheet, Easing } from 'react-native'
import loading from './loading.png'

class LoadingView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      rotateValue: new Animated.Value(0) // 初始值
    }
  }

  startAnimation () {
    this.state.rotateValue.setValue(0)
    Animated.timing(this.state.rotateValue, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear
    }).start(() => this.startAnimation())
  }

  componentDidMount () {
    this.startAnimation()
  }

  render () {
    return (
      <Animated.Image
        source={loading}
        style={[
          styles.toastLoading, {
            transform: [
              {
                rotateZ: this.state.rotateValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
          }]}
      />
    )
  }
}

const styles = StyleSheet.create({
  toastLoading: {
    width: 35,
    height: 35,
    margin: 10
  }
})

export default LoadingView
