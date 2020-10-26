import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, Icon } from '../../dist'

export default class EXIcon extends Component {
  render () {
    return (
      <View style={styles.wrapper}>
        {/* <Icon type='circle' style={styles.icon} /> */}
        <Icon type='download' style={styles.icon} />
        <Icon type='info' style={styles.icon} />
        {/* <Icon type='safe_success' style={styles.icon} /> */}
        {/* <Icon type='safe_warn' style={styles.icon} /> */}
        <Icon type='success' style={styles.icon} />
        {/* <Icon type='success_circle' style={styles.icon} /> */}
        <Icon type='success_no_circle' style={styles.icon} />
        <Icon type='waiting' style={styles.icon} />
        {/* <Icon type='waiting_circle' style={styles.icon} /> */}
        <Icon type='warn' style={styles.icon} />
        {/* <Icon type='info_circle' style={styles.icon} /> */}
        <Icon type='cancel' style={styles.icon} />
        <Icon type='search' style={styles.icon} />
        <Icon type='clear' style={styles.icon} />
        {/* <Icon type='back' style={styles.icon} /> */}
        {/* <Icon type='delete' style={styles.icon} /> */}
        <Icon type='waiting' color='purple' size={46} style={styles.icon} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: 2
  }
})
