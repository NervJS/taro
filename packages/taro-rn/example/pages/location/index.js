import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { getLocation } from '../../../dist/api/location'

function handleGetLocation () {
  console.log('getLocation')
  getLocation().then(res => console.log(res)).catch(e => console.log(e))
}

export function Location () {
  return (
    <View>
      <Text style={styles.index}>位置</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={handleGetLocation} title='getLocation' color='#19AD1A' />
      </View>
    </View>
  )
}
