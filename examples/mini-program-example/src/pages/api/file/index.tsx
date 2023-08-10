import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from '@/util/util'

/**
 * 文件
 * @returns
 */
let fileSystemManager
let openFd
let openSyncFd
export default class Index extends React.Component {
  state = {
    list: [
      {
        id: 'saveFile',
        func: () => {
          TestConsole.consoleTest('saveFile')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleSuccess(res)
                },
                fail: function (res) {
                  TestConsole.consoleFail(res)
                },
                complete: function (res) {
                  TestConsole.consoleComplete(res)
                },
              }).then((ret) => {
                TestConsole.consoleReturn(ret)
              })
            },
          })
        },
      },
      {
        id: 'getSavedFileList',
        func: () => {
          TestConsole.consoleTest('getSavedFileList')
          Taro.getSavedFileList({
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'getSavedFileInfo',
        func: () => {
          TestConsole.consoleTest('getSavedFileInfo')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  Taro.getSavedFileInfo({
                    filePath: res.savedFilePath,
                    success: function (res) {
                      TestConsole.consoleSuccess(res)
                    },
                    fail: function (res) {
                      TestConsole.consoleFail(res)
                    },
                    complete: function (res) {
                      TestConsole.consoleComplete(res)
                    },
                  }).then((ret) => {
                    TestConsole.consoleReturn(ret)
                  })
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'getFileInfo',
        func: () => {
          TestConsole.consoleTest('getFileInfo')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  Taro.getFileInfo({
                    filePath: res.savedFilePath,
                    success: function (res) {
                      TestConsole.consoleSuccess(res)
                    },
                    fail: function (res) {
                      TestConsole.consoleFail(res)
                    },
                    complete: function (res) {
                      TestConsole.consoleComplete(res)
                    },
                  }).then((ret) => {
                    TestConsole.consoleReturn(ret)
                  })
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'removeSavedFile',
        func: () => {
          TestConsole.consoleTest('removeSavedFile')
          Taro.getSavedFileList({
            success: function (res) {
              TestConsole.consoleNormal('getSavedFileList success ', res)
              if (res.fileList.length > 0) {
                Taro.removeSavedFile({
                  filePath: res.fileList[0].filePath,
                  success: function (res) {
                    TestConsole.consoleSuccess(res)
                  },
                  fail: function (res) {
                    TestConsole.consoleFail(res)
                  },
                  complete: function (res) {
                    TestConsole.consoleComplete(res)
                  },
                }).then((ret) => {
                  TestConsole.consoleReturn(ret)
                })
              }
            },
          })
        },
      },
      {
        id: 'getFileSystemManager',
        func: () => {
          TestConsole.consoleTest('getFileSystemManager')
          fileSystemManager = Taro.getFileSystemManager()
          TestConsole.consoleNormal('getFileSystemManager: ', fileSystemManager)
        },
      },
      {
        id: 'fileSystem_access',
        func: () => {
          TestConsole.consoleTest('fileSystem_access')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.access({
                    path: res.savedFilePath,
                    success: function (res) {
                      TestConsole.consoleSuccess(res)
                    },
                    fail: function (res) {
                      TestConsole.consoleFail(res)
                    },
                    complete: function (res) {
                      TestConsole.consoleComplete(res)
                    },
                  })
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_accessSync',
        func: () => {
          TestConsole.consoleTest('fileSystem_accessSync')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.accessSync(res.savedFilePath)
                  TestConsole.consoleNormal('accessSync success ')
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_appendFile',
        func: () => {
          TestConsole.consoleTest('fileSystem_appendFile')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.appendFile({
                    data: 'append test',
                    filePath: res.savedFilePath,
                    encoding: 'utf8',
                    success: function (res) {
                      TestConsole.consoleSuccess(res)
                    },
                    fail: function (res) {
                      TestConsole.consoleFail(res)
                    },
                    complete: function (res) {
                      TestConsole.consoleComplete(res)
                    },
                  })
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_appendFileSync',
        func: () => {
          TestConsole.consoleTest('fileSystem_appendFileSync')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.appendFileSync(res.savedFilePath, 'sync test', 'utf8')
                  TestConsole.consoleNormal('appendFileSync success ')
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_open',
        func: () => {
          TestConsole.consoleTest('fileSystem_open')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (res) {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.open({
                    filePath: res.savedFilePath,
                    flag: 'r',
                    success: function (res) {
                      openFd = res.fd
                      TestConsole.consoleSuccess(res)
                    },
                    fail: function (res) {
                      TestConsole.consoleFail(res)
                    },
                    complete: function (res) {
                      TestConsole.consoleComplete(res)
                    },
                  })
                },
                fail: function (res) {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: function (res) {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_close',
        func: () => {
          TestConsole.consoleTest('fileSystem_close')
          fileSystemManager.close({
            fd: openFd,
            success: function (res) {
              TestConsole.consoleSuccess(res)
            },
            fail: function (res) {
              TestConsole.consoleFail(res)
            },
            complete: function (res) {
              TestConsole.consoleComplete(res)
            },
          })
        },
      },
      {
        id: 'fileSystem_openSync',
        func: () => {
          TestConsole.consoleTest('fileSystem_openSync')
          Taro.chooseImage({
            success: function (res) {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: function (sucRes) {
                  TestConsole.consoleNormal('saveFile success ', sucRes)
                  openSyncFd = fileSystemManager.openSync({
                    filePath: sucRes.savedFilePath,
                    flag: 'r',
                  })
                  TestConsole.consoleNormal('openSync success ', openSyncFd)
                },
                fail: function (failRes) {
                  TestConsole.consoleNormal('saveFile fail ', failRes.errMsg)
                },
                complete: function (comRes) {
                  TestConsole.consoleNormal('saveFile complete ', comRes)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_closeSync',
        func: () => {
          TestConsole.consoleTest('fileSystem_closeSync')
          fileSystemManager.closeSync({
            fd: openSyncFd,
          })
          TestConsole.consoleNormal('closeSync success ', openSyncFd)
        },
      },
      {
        id: 'fileSystem_fstat',
        func: () => {
          TestConsole.consoleTest('fileSystem_fstat')
          fileSystemManager.fstat({
            fd: openFd,
            success: function (openSuc) {
              TestConsole.consoleSuccess(openSuc)
            },
            fail: function (openFail) {
              TestConsole.consoleFail(openFail)
            },
            complete: function (openCom) {
              TestConsole.consoleComplete(openCom)
            },
          })
        },
      },
      {
        id: 'fileSystem_fstatSync_暂不支持',
        func: () => {
          TestConsole.consoleTest('fileSystem_fstatSync')
          fileSystemManager.fstatSync({
            fd: openFd,
          })
          TestConsole.consoleNormal('closeSync success ', openFd)
        },
      },
    ],
  }
  render() {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
