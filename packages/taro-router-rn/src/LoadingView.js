import React from 'react'
import { Animated, StyleSheet, Easing } from 'react-native'

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
        source='data:image/png;base64,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'
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
    width: 25,
    height: 25
  }
})

export default LoadingView
