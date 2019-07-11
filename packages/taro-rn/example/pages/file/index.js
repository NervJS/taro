import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { downloadFile } from '../../../dist/api/file'

function handleDownloadFile () {
  console.log('downloadFile')
  downloadFile({
    url: 'https://nervjs.github.io/taro/img/logo-taro.png',
    success (res) {
      console.log('success')
    },
    fail (res) {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleUploadFile () {
  console.log('handleUploadFile')
}

export function File () {
  return (
    <View>
      <Text style={styles.index}>文件</Text>
      <View>
        <View style={{flexDirection: 'row'}}>
          <Button onPress={handleDownloadFile} title='downloadFile' color='#19AD1A' />
          <Button onPress={handleUploadFile} title='uploadFile' color='#19AD1A' />
        </View>
      </View>
    </View>
  )
}
