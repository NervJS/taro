import React from 'react'
import Taro from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import './index.scss'
import { TestConsole } from '@/util/util'
import ButtonList from '@/components/buttonList'

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
        func: (apiIndex) => {
          TestConsole.consoleTest('saveFile')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleSuccess.call(this, res, apiIndex)
                },
                fail: (res) => {
                  TestConsole.consoleFail.call(this, res, apiIndex)
                },
                complete: (res) => {
                  TestConsole.consoleComplete.call(this, res, apiIndex)
                },
              }).then((res) => {
                TestConsole.consoleReturn.call(this, res, apiIndex)
              })
            },
          })
        },
      },
      {
        id: 'openDocument',
        inputData: {
          filePath: '',
          showMenu: false,
          fileType: []
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('openDocument')
          Taro.openDocument({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'getSavedFileList',
        func: (apiIndex) => {
          TestConsole.consoleTest('getSavedFileList')
          Taro.getSavedFileList({
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'getSavedFileInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('getSavedFileInfo')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  Taro.getSavedFileInfo({
                    filePath: res.savedFilePath,
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  }).then((res) => {
                    TestConsole.consoleReturn.call(this, res, apiIndex)
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'getFileInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('getFileInfo')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  Taro.getFileInfo({
                    filePath: res.savedFilePath,
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  }).then((res) => {
                    TestConsole.consoleReturn.call(this, res, apiIndex)
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
              })
            },
          })
        },
      },
      {
        id: 'removeSavedFile',
        func: (apiIndex) => {
          TestConsole.consoleTest('removeSavedFile')
          Taro.getSavedFileList({
            success: (res) => {
              TestConsole.consoleNormal('getSavedFileList success ', res)
              if (res.fileList.length > 0) {
                Taro.removeSavedFile({
                  filePath: res.fileList[0].filePath,
                  success: (res) => {
                    TestConsole.consoleSuccess.call(this, res, apiIndex)
                  },
                  fail: (res) => {
                    TestConsole.consoleFail.call(this, res, apiIndex)
                  },
                  complete: (res) => {
                    TestConsole.consoleComplete.call(this, res, apiIndex)
                  },
                }).then((res) => {
                  TestConsole.consoleReturn.call(this, res, apiIndex)
                })
              }
            },
          })
        },
      },
      {
        id: 'getFileSystemManager',
        func: (apiIndex) => {
          TestConsole.consoleTest('getFileSystemManager')
          fileSystemManager = Taro.getFileSystemManager()
          TestConsole.consoleNormal('getFileSystemManager: ', fileSystemManager)
        },
      },
      {
        id: 'fileSystem_access',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_access')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.access({
                    path: res.savedFilePath,
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_accessSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_accessSync')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.accessSync(res.savedFilePath)
                  TestConsole.consoleNormal('accessSync success ')
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_appendFile',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_appendFile')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.appendFile({
                    data: 'append test',
                    filePath: res.savedFilePath,
                    encoding: 'utf8',
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_appendFileSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_appendFileSync')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.appendFileSync(res.savedFilePath, 'sync test', 'utf8')
                  TestConsole.consoleNormal('appendFileSync success ')
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_open',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_open')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                filePath: 'D:/common',
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.open({
                    filePath: res.savedFilePath,
                    flag: 'r',
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_close',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_close')
          fileSystemManager.close({
            fd: openFd,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'fileSystem_openSync',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_openSync')
          Taro.chooseImage({
            success: (res) => {
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
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_closeSync')
          fileSystemManager.closeSync({
            fd: openSyncFd,
          })
          TestConsole.consoleNormal('closeSync success ', openSyncFd)
        },
      },
      {
        id: 'fileSystem_fstat',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_fstat')
          fileSystemManager.fstat({
            fd: openFd,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'fileSystem_fstatSync_暂不支持',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_fstatSync')
          fileSystemManager.fstatSync({
            fd: openFd,
          })
          TestConsole.consoleNormal('closeSync success ', openFd)
        },
      },
      {
        id: 'fileSystem_getFileInfo',
        func: (apiIndex) => {
          TestConsole.consoleTest('fileSystem_getFileInfo')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: (res) => {
                  TestConsole.consoleNormal('saveFile success ', res)
                  fileSystemManager.getFileInfo({
                    filePath: res.savedFilePath,
                    success: (res) => {
                      TestConsole.consoleSuccess.call(this, res, apiIndex)
                    },
                    fail: (res) => {
                      TestConsole.consoleFail.call(this, res, apiIndex)
                    },
                    complete: (res) => {
                      TestConsole.consoleComplete.call(this, res, apiIndex)
                    },
                  })
                },
                fail: (res) => {
                  TestConsole.consoleNormal('saveFile fail ', res.errMsg)
                },
                complete: (res) => {
                  TestConsole.consoleNormal('saveFile complete ', res)
                },
              })
            },
          })
        },
      },
      {
        id: 'fileSystem_readFile',
        inputData: {
          filePath: '',
          position: 0,
          length: 1,
          encoding: '',
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('fileSystem_readFile')
          fileSystemManager.readFile({
            ...data,
            success: (res) => {
              TestConsole.consoleSuccess.call(this, res, apiIndex)
            },
            fail: (res) => {
              TestConsole.consoleFail.call(this, res, apiIndex)
            },
            complete: (res) => {
              TestConsole.consoleComplete.call(this, res, apiIndex)
            },
          })
        },
      },
      {
        id: 'fileSystem_readFileSync',
        inputData: {
          encoding: '',
          position: 1,
          length: 1000,
        },
        func: (apiIndex, data) => {
          TestConsole.consoleTest('fileSystem_readFileSync')
          Taro.chooseImage({
            success: (res) => {
              var tempFilePaths = res.tempFilePaths
              Taro.saveFile({
                tempFilePath: tempFilePaths[0],
                success: function (sucRes) {
                  TestConsole.consoleNormal('saveFile success ', sucRes)
                  fileSystemManager.readFileSync(sucRes.savedFilePath, data.encoding, data.position, data.length)
                  TestConsole.consoleNormal('readFileSync success ')
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
    ],
  }
  render () {
    const { list } = this.state
    return (
      <View className='api-page'>
        <ButtonList buttonList={list} />
      </View>
    )
  }
}
