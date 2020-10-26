/* eslint-disable no-console */
import React from 'react'
import { View, Text, Button } from 'react-native'
import { styles } from '../styles'
import { downloadFile, saveFile, removeSavedFile, getSavedFileInfo, getFileInfo, getSavedFileList } from '../../../dist/api/file'
import { chooseImage } from '../../../dist/api/media'
import * as FileSystem from 'expo-file-system'

function handleDownloadFile () {
  console.log('downloadFile')
  downloadFile({
    url: 'https://nervjs.github.io/taro/img/logo-taro.png',
    success () {
      console.log('success')
    },
    fail () {
      console.log('fail')
    }
  }).then(res => console.log(res)).catch(e => console.log(e))
}

function handleUploadFile () {
  console.log('handleUploadFile')
}

function handleSaveFile () {
  console.log('saveFile')
  chooseImage({
    success: function (res) {
      const tempFilePaths = res.tempFilePaths
      console.log(tempFilePaths)
      saveFile({ tempFilePath: tempFilePaths[0] })
        .then(res => console.log(res))
        .catch(e => console.log('error', e))
    }
  })
}

function handleRemoveSavedFile () {
  console.log('handleRemoveSavedFile')
  getSavedFileList({
    success (res) {
      console.log(res)
      if (res.fileList.length > 0) {
        removeSavedFile({
          filePath: res.fileList[0].filePath,
          complete (res) {
            console.log(res)
          }
        })
      }
    }
  })
}

function handleGetSavedFileList () {
  console.log('getSavedFileList')
  getSavedFileList()
    .then(res => console.log(res))
    .catch(e => console.log('error', e))
}

function handleGetSavedFileInfo () {
  console.log('handleGetSavedFileInfo')
  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(res => console.log(res))
  getSavedFileInfo({ filePath: FileSystem.documentDirectory + 'logo-taro.png' })
    .then(res => console.log(res))
    .catch(e => console.log('error', e))
}

function handleGetFileInfo () {
  console.log('getFileInfo')
  // FileSystem.readDirectoryAsync(FileSystem.documentDirectory).then(res => console.log(res))
  getFileInfo({ filePath: FileSystem.documentDirectory + 'logo-taro.png' })
    .then(res => console.log(res))
    .catch(e => console.log('error', e))
}

export function File () {
  return (
    <View>
      <Text style={styles.index}>上传下载</Text>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleDownloadFile} title='downloadFile' color='#19AD1A' />
          <Button onPress={handleUploadFile} title='uploadFile' color='#19AD1A' />
        </View>
      </View>
      <Text style={styles.index}>文件</Text>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleSaveFile} title='saveFile' color='#19AD1A' />
          <Button onPress={handleRemoveSavedFile} title='removeSavedFile' color='#19AD1A' />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleGetSavedFileList} title='getSavedFileList' color='#19AD1A' />
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button onPress={handleGetSavedFileInfo} title='getSavedFileInfo' color='#19AD1A' />
          <Button onPress={handleGetFileInfo} title='getFileInfo' color='#19AD1A' />
        </View>
      </View>
    </View>
  )
}
