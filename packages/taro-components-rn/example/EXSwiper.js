import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text, Swiper } from '../src'

export default class EXSwiper extends Component {
  render () {
    return (
      <View style={{ width: 300, height: 250 }}>
        <Swiper
          showsPagination={true}
          indicatorColor="white"
          indicatorActiveColor="purple"
          autoplay={true}
          current={1}
          interval={6000}
          circular={false}
          vertical={true}
          onChange={() => null}
          onAnimationFinish={() => null}
          style={{
            backgroundColor: 'black'
          }}
        >
          <View style={[styles.page, { backgroundColor: 'red' }]}>
            <Text>Hello Swiper</Text>
          </View>
          <View style={[styles.page, { backgroundColor: 'green' }]}>
            <Text>Beautiful</Text>
          </View>
          <View style={[styles.page, { backgroundColor: 'blue' }]}>
            <Text>And simple</Text>
          </View>
        </Swiper>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

