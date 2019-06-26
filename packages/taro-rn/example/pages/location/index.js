import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { getLocation } from '../../../dist/api/location'

function handleGetLocation () {
  console.log('getImageInfo')
  getLocation().then(res => console.log(res))
}

export function Location () {
  return (
    <View>
      <Text style={styles.index}>位置</Text>
      <View style={{flexDirection: 'row'}}>
        <Button onPress={handleGetLocation} title='getLocation' color='#19AD1A' />
      </View>
    </View>
  )
}
