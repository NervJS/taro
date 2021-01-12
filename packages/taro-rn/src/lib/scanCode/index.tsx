import { SafeAreaView } from 'react-native-safe-area-context'
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { BackHandler, Image, TouchableOpacity, StyleSheet, View, Dimensions, Platform } from 'react-native'
import iconClose from './icon_close.png'
import iconPic from './icon_pic.png'
import * as Permissions from 'expo-permissions'
import RootSiblings from 'react-native-root-siblings'
import { chooseMedia, MEDIA_TYPE } from '../media'
import React from 'react'

export let scannerView

const codeMap = {
  aztec: 'AZTEC',
  codabar: 'CODABAR',
  code39: 'CODE_39',
  code93: 'CODE_93',
  code128: 'CODE_128',
  code39mod43: 'CODE_93', // 未准确对应
  datamatrix: 'DATA_MATRIX',
  ean13: 'EAN_13',
  ean8: 'EAN_8',
  interleaved2of5: 'ITF', // 未准确对应
  itf14: 'ITF', // 未准确对应
  maxicode: 'MAXICODE',
  pdf417: 'PDF_417',
  rss14: 'RSS_14',
  rssexpanded: 'RSS_EXPANDED',
  upc_a: 'UPC_A',
  upc_e: 'UPC_E',
  upc_ean: 'UPC_EAN_EXTENSION',
  qr: 'QR_CODE'
}

const typeMap = {
  barCode: ['aztec', 'codabar', 'code39', 'code93', 'code128', 'code39mod43', 'ean13', 'ean8', 'interleaved2of5', 'itf14', 'maxicode', 'rss14', 'rssexpanded', 'upc_a', 'upc_e', 'upc_ean'],
  qrCode: ['qr'],
  datamatrix: ['datamatrix'],
  pdf417: ['pdf417']
}

const BarCodeType = BarCodeScanner.Constants.BarCodeType

function findKey (value:string, data, compare = (a, b) => a === b):string {
  return Object.keys(data).find(k => compare(data[k], value)) || ''
}

const { width, height } = Dimensions.get('window')

function getBarCodeTypes(types:string[]):string[] {
  const result:string[] = []
  for (const t of types) {
    result.push(...typeMap[t].map(type => {
      return BarCodeType[type]
    }))
  }
  return result.filter(r => !!r)
}

function formatCodeType(type:string):keyof Taro.scanCode.QRType {
  return codeMap[findKey(type, BarCodeType)]
}

function safeViewWrapper(element:any) {
  if (Platform.OS === 'ios') {
    return <SafeAreaView>{element}</SafeAreaView>
  }
  return element
}

let backAction: any = null

function hide(view) {
  if (!(view instanceof RootSiblings)) {
    return
  }
  view.destroy()
  BackHandler.removeEventListener('hardwareBackPress', backAction)
}

backAction = () => {
  hide(scannerView)
  return true
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    zIndex: 1000
  },
  closeIcon: {
    position: 'absolute',
    left: 20,
    top: 10
  },
  closeImg: {
    width: 25,
    height: 25,
  },
  closeBtnBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  albumIcon: {
    position: 'absolute',
    right: 20,
    bottom: 40
  },
  albumImg: {
    width: 20,
    height: 20,
  },
  albumBtnBg: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

function scanFromPhoto(callback, errorCallBack) {
  chooseMedia({
    sourceType: ['album'],
    maxDuration: 60,
    camera: 'back',
    success: function (res) {
      const imageUrl = res.tempFilePaths[0]
      if (imageUrl) {
        BarCodeScanner.scanFromURLAsync(imageUrl).then(res => {
          res && res.length > 0 && callback(res[0].data, res[0].type)
        })
      }
    }
  }, MEDIA_TYPE.IMAGES).catch(errorCallBack)
}

export async function scanCode(option: Taro.scanCode.Option = {}): Promise<Taro.scanCode.SuccessCallbackResult> {
  const { success, fail, complete, onlyFromCamera, scanType = ['barCode', 'qrCode'] } = option
  const { status } = await Permissions.askAsync(Permissions.CAMERA)
  if (status !== 'granted') {
    const res = { errMsg: 'Permissions denied!' }
    fail?.(res)
    complete?.(res)
    return Promise.reject(res)
  }
  const barCodeTypes = getBarCodeTypes(scanType)
  return new Promise((resolve, reject) => {
    scannerView = new RootSiblings(
      (<View style={[styles.container]}>
          <Camera
              onBarCodeScanned={({ type, data }: {type: string, data: string}) => {
                const res = {
                  charSet: 'UTF-8', // todo
                  path: '', // todo
                  rawData: '', // todo
                  errMsg: 'scanCode:ok',
                  result: data,
                  scanType: formatCodeType(type),
                }
                success?.(res)
                complete?.(res)
                hide(scannerView)
                resolve(res)
              }}
              barCodeScannerSettings={{
                barCodeTypes,
              }}
              style={{ width, height }}
              ratio='16:9'
          />
          <TouchableOpacity style={styles.closeIcon} onPress={() => hide(scannerView)}>
            {safeViewWrapper(<Image source={iconClose} style={styles.closeImg}/>)}
          </TouchableOpacity>
          {!onlyFromCamera && (<TouchableOpacity style={styles.albumIcon} onPress={() => {
            scanFromPhoto((data, type) => {
              const res = {
                charSet: 'UTF-8', // todo
                path: '', // todo
                rawData: '', // todo
                errMsg: 'scanCode:ok',
                result: data,
                scanType: formatCodeType(type),
              }
              success?.(res)
              complete?.(res)
              hide(scannerView)
              resolve(res)
            }, (err) => {
              const res = {
                errMsg: 'scanCode fail',
                err
              }
              fail?.(res)
              complete?.(res)
              hide(scannerView)
              reject(res)
            })
          }}>
            {safeViewWrapper(<Image source={iconPic} style={styles.albumImg}/>)}
          </TouchableOpacity>)}
        </View>)
    )
    BackHandler.addEventListener('hardwareBackPress', backAction)
  })
}
