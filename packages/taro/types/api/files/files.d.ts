declare namespace Taro {
  namespace saveFile {
    type Promised = {
      /**
       * 文件的保存路径
       */
      savedFilePath: any
    }
    type Param = {
      /**
       * 需要保存的文件的临时路径
       */
      tempFilePath: string
    }
  }
  /**
   * 保存文件到本地。**注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用**
   *
   * **bug & tip：**
   *
   * 1.  `tip`: 本地文件存储的大小限制为 10M
   *
   * **示例代码：**
   *
   ```javascript
   Taro.chooseImage({
     success: function(res) {
       var tempFilePaths = res.tempFilePaths
       Taro.saveFile({
         tempFilePath: tempFilePaths[0],
         success: function(res) {
           var savedFilePath = res.savedFilePath
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFile.html
   */
  function saveFile(OBJECT: saveFile.Param): Promise<saveFile.Promised>

  namespace removeSavedFile {
    type Param = {
      /**
       * 需要删除的文件路径
       */
      filePath: string
    }
  }
  /**
   * 删除本地存储的文件
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileList({
     success: function(res) {
       if (res.fileList.length > 0){
         Taro.removeSavedFile({
           filePath: res.fileList[0].filePath,
           complete: function(res) {
             console.log(res)
           }
         })
       }
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.removeSavedFile.html
   */
  function removeSavedFile(OBJECT: removeSavedFile.Param): Promise<any>

  namespace openDocument {
    type Param = {
      /**
       * 文件路径，可通过 downFile 获得
       */
      filePath: string
      /**
       * 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
       *
       * @since 1.4.0
       */
      fileType?: string
    }
  }
  /**
   * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
   *
   * **示例代码：**
   *
   ```javascript
   Taro.downloadFile({
     url: 'http://example.com/somefile.pdf',
     success: function (res) {
       var filePath = res.tempFilePath
       Taro.openDocument({
         filePath: filePath,
         success: function (res) {
           console.log('打开文档成功')
         }
       })
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html
   */
  function openDocument(OBJECT: openDocument.Param): Promise<any>

  namespace getSavedFileList {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
      /**
       * 文件列表
       */
      fileList: PromisedPropFileList
    }
    /**
     * 文件列表
     */
    type PromisedPropFileList = PromisedPropFileListItem[]
    type PromisedPropFileListItem = {
      /**
       * 文件的本地路径
       */
      filePath: string
      /**
       * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
       */
      createTime: number
      /**
       * 文件大小，单位B
       */
      size: number
    }
    type Param = {}
  }
  /**
   * 获取本地已保存的文件列表
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileList({
     success: function(res) {
       console.log(res.fileList)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileList.html
   */
  function getSavedFileList(OBJECT?: getSavedFileList.Param): Promise<getSavedFileList.Promised>

  namespace getSavedFileInfo {
    type Promised = {
      /**
       * 接口调用结果
       */
      errMsg: string
      /**
       * 文件大小，单位B
       */
      size: number
      /**
       * 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
       */
      createTime: number
    }
    type Param = {
      /**
       * 文件路径
       */
      filePath: string
    }
  }
  /**
   * 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 [Taro.getFileInfo](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html) 接口。
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getSavedFileInfo({
     filePath: 'wxfile://somefile', //仅做示例用，非真正的文件路径
     success: function(res) {
       console.log(res.size)
       console.log(res.createTime)
     }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileInfo.html
   */
  function getSavedFileInfo(OBJECT: getSavedFileInfo.Param): Promise<getSavedFileInfo.Promised>

  namespace getFileInfo {
    type Promised = {
      /**
       * 文件大小，单位：B
       */
      size: number
      /**
       * 按照传入的 digestAlgorithm 计算得出的的文件摘要
       */
      digest: string
      /**
       * 调用结果
       */
      errMsg: string
    }
    type Param = {
      /**
       * 本地文件路径
       */
      filePath: string
      /**
       * 计算文件摘要的算法，默认值 md5，有效值：md5，sha1
       */
      digestAlgorithm?: string
    }
  }
  /**
   * @since 1.4.0
   *
   * 获取文件信息
   *
   * **示例代码：**
   *
   ```javascript
   Taro.getFileInfo({
       success(res) {
           console.log(res.size)
           console.log(res.digest)
       }
   })
   ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html
   */
  function getFileInfo(OBJECT: getFileInfo.Param): Promise<getFileInfo.Promised>

  // TODO: wx.getFileSystemManager
  // TODO: FileSystemManager
  // TODO: Stats
}
