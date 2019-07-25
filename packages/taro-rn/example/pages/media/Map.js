import React from 'react'
import { View, Text } from 'react-native'
import { styles } from '../styles'

export default class Map extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <View>
        <Text style={styles.index}>地图</Text>
      </View>
    )
  }
}
