declare namespace Taro {
  namespace saveFile {
    interface Option {
      /** 临时存储文件路径 */
      tempFilePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 要存储的文件路径 */
      filePath?: string
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface FailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;
       * - 'fail permission denied, open "${filePath}"': 指定的 filePath 路径没有写权限;
       * - 'fail no such file or directory "${dirPath}"': 上级目录不存在;
       * - 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; */
      errMsg: string
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 存储后的文件路径 */
      savedFilePath: string
      /** 调用结果 */
      errMsg: string
    }
  }
  /** 保存文件到本地。**注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用**
   * @supported weapp
   * @example
   * ```tsx
   * Taro.chooseImage({
   *   success: function (res) {
   *     var tempFilePaths = res.tempFilePaths
   *     Taro.saveFile({
   *       tempFilePath: tempFilePaths[0],
   *       success: function (res) {
   *         var savedFilePath = res.savedFilePath
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.saveFile.html
   */
  function saveFile(option: saveFile.Option): Promise<saveFile.SuccessCallbackResult | saveFile.FailCallbackResult>

  namespace removeSavedFile {
    interface Option {
      /** 需要删除的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface RemoveSavedFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail file not exist': 指定的 tempFilePath 找不到文件; */
      errMsg: string
    }
  }
  /** 删除该小程序下已保存的本地缓存文件
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getSavedFileList({
   *   success: function (res) {
   *     if (res.fileList.length > 0){
   *       Taro.removeSavedFile({
   *         filePath: res.fileList[0].filePath,
   *         complete: function (res) {
   *           console.log(res)
   *         }
   *       })
   *     }
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.removeSavedFile.html
   */
  function removeSavedFile(option: removeSavedFile.Option): Promise<General.CallbackResult>

  namespace openDocument {
    interface Option {
      /** 文件路径，可通过 downloadFile 获得 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 文件类型，指定文件类型打开文件 */
      fileType?: keyof fileType
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    /** 文件类型 */
    interface fileType {
      /** doc 格式 */
      doc
      /** docx 格式 */
      docx
      /** xls 格式 */
      xls
      /** xlsx 格式 */
      xlsx
      /** ppt 格式 */
      ppt
      /** pptx 格式 */
      pptx
      /** pdf 格式 */
      pdf
    }
  }
  /** 新开页面打开文档，支持格式
   * @supported weapp
   * @example
   ```tsx
   * Taro.downloadFile({
   *   url: 'http://example.com/somefile.pdf',
   *   success: function (res) {
   *     var filePath = res.tempFilePath
   *     Taro.openDocument({
   *       filePath: filePath,
   *       success: function (res) {
   *         console.log('打开文档成功')
   *       }
   *     })
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.openDocument.html
   */
  function openDocument(option: openDocument.Option): Promise<General.CallbackResult>

  namespace getSavedFileList {
    interface Option {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 文件数组 */
      fileList: FileItem[]
      /** 调用结果 */
      errMsg: string
    }
    /** 文件数组 */
    interface FileItem {
      /** 文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数 */
      createTime: number
      /** 本地路径 */
      filePath: string
      /** 本地文件大小，以字节为单位 */
      size: number
    }
  }
  /** 获取本地已保存的文件列表
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getSavedFileList({
   *   success: function (res) {
   *     console.log(res.fileList)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileList.html
   */
  function getSavedFileList(option?: getSavedFileList.Option): Promise<getSavedFileList.SuccessCallbackResult>

  namespace getSavedFileInfo {
    interface Option {
      /** 文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数 */
      createTime: number
      /** 文件大小，单位 B */
      size: number
      /** 调用结果 */
      errMsg: string
    }
  }
  /** 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 [Taro.getFileInfo](https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html) 接口。
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getSavedFileInfo({
   *   filePath: 'wxfile://somefile', //仅做示例用，非真正的文件路径
   *   success: function (res) {
   *     console.log(res.size)
   *     console.log(res.createTime)
   *   }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getSavedFileInfo.html
   */
  function getSavedFileInfo(option: getSavedFileInfo.Option): Promise<getSavedFileInfo.SuccessCallbackResult>

  namespace getFileInfo {
    interface Option {
      /** 要读取的文件路径 */
      filePath: string
      /**
       * 计算文件摘要的算法
       * @default 'md5'
       */
      digestAlgorithm?: 'md5' | 'sha1'
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: SuccessCallbackResult) => void
    }
    interface FailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail file not exist': 指定的 filePath 找不到文件; */
      errMsg: string
    }
    interface SuccessCallbackResult extends General.CallbackResult {
      /** 文件大小，以字节为单位 */
      size: number
      /** 按照传入的 digestAlgorithm 计算得出的的文件摘要 */
      digest: string
      /** 调用结果 */
      errMsg: string
    }
  }
  /**
   * 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
   * @supported weapp
   * @example
   * ```tsx
   * Taro.getFileInfo({
   *     success: function (res) {
   *         console.log(res.size)
   *         console.log(res.digest)
   *     }
   * })
   * ```
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileInfo.html
   */
  function getFileInfo(option: getFileInfo.Option): Promise<getFileInfo.SuccessCallbackResult | getFileInfo.FailCallbackResult>

  /** 获取全局唯一的文件管理器
   * @supported weapp
   * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/wx.getFileSystemManager.html
   */
  function getFileSystemManager(): FileSystemManager

  /** 文件管理器 */
  interface FileSystemManager {
    /** FileSystemManager.readdir 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdirSync.html
     */
    readdirSync(
      /** 要读取的目录路径 */
      dirPath: string,
    ): string[]
    /** 判断文件/目录是否存在
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.access.html
     */
    access(option: FileSystemManager.AccessOption): void
    /** FileSystemManager.access 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.accessSync.html
     */
    accessSync(
      /** 要判断是否存在的文件/目录路径 */
      path: string,
    ): void
    /** 在文件结尾追加内容
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFile.html
     */
    appendFile(option: FileSystemManager.AppendFileOption): void
    /** FileSystemManager.appendFile 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.appendFileSync.html
     */
    appendFileSync(
      /** 要追加内容的文件路径 */
      filePath: string,
      /** 要追加的文本或二进制数据 */
      data: string | ArrayBuffer,
      /** 指定写入文件的字符编码 */
      encoding?: keyof FileSystemManager.encoding,
    ): void
    /** 复制文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFile.html
     */
    copyFile(option: FileSystemManager.CopyFileOption): void
    /** FileSystemManager.copyFile 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.copyFileSync.html
     */
    copyFileSync(
      /** 源文件路径，只可以是普通文件 */
      srcPath: string,
      /** 目标文件路径 */
      destPath: string,
    ): void
    /** 获取该小程序下的 本地临时文件 或 本地缓存文件 信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getFileInfo.html
     */
    getFileInfo(option: FileSystemManager.getFileInfoOption): void
    /** 获取该小程序下已保存的本地缓存文件列表
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.getSavedFileList.html
     */
    getSavedFileList(option?: FileSystemManager.getSavedFileListOption): void
    /** 创建目录
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdir.html
     */
    mkdir(option: FileSystemManager.MkdirOption): void
    /** FileSystemManager.mkdir 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.mkdirSync.html
     */
    mkdirSync(
      /** 创建的目录路径 */
      dirPath: string,
      /** 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 */
      recursive?: boolean,
    ): void
    /** 读取本地文件内容
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFile.html
     */
    readFile(option: FileSystemManager.ReadFileOption): void
    /** 读取目录内文件列表
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readdir.html
     */
    readdir(option: FileSystemManager.ReaddirOption): void
    /** 删除该小程序下已保存的本地缓存文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.removeSavedFile.html
     */
    removeSavedFile(option: FileSystemManager.RemoveSavedFileOption): void
    /** 重命名文件。可以把文件从 oldPath 移动到 newPath
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rename.html
     */
    rename(option: FileSystemManager.RenameOption): void
    /** FileSystemManager.rename 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.renameSync.html
     */
    renameSync(
      /** 源文件路径，可以是普通文件或目录 */
      oldPath: string,
      /** 新文件路径 */
      newPath: string,
    ): void
    /** 删除目录
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdir.html
     */
    rmdir(option: FileSystemManager.RmdirOption): void
    /** FileSystemManager.rmdir 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.rmdirSync.html
     */
    rmdirSync(
      /** 要删除的目录路径 */
      dirPath: string,
      /** 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 */
      recursive?: boolean,
    ): void
    /** 保存临时文件到本地。此接口会移动临时文件，因此调用成功后，tempFilePath 将不可用。
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFile.html
     */
    saveFile(option: FileSystemManager.SaveFileOption): void
    /** 获取文件 Stats 对象
     * @supported weapp
     * https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.stat.html
     */
    stat(option: FileSystemManager.StatOption): void
    /** 删除文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlink.html
     */
    unlink(option: FileSystemManager.UnlinkOption): void
    /** FileSystemManager.unlink 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unlinkSync.html
     */
    unlinkSync(
      /** 要删除的文件路径 */
      filePath: string,
    ): void
    /** 解压文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.unzip.html
     */
    unzip(option: FileSystemManager.UnzipOption): void
    /** 写文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFile.html
     */
    writeFile(option: FileSystemManager.WriteFileOption): void
    /** FileSystemManager.writeFile 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeFileSync.html
     */
    writeFileSync(
      /** 要写入的文件路径 */
      filePath: string,
      /** 要写入的文本或二进制数据 */
      data: string | ArrayBuffer,
      /** 指定写入文件的字符编码 */
      encoding?: keyof FileSystemManager.encoding,
    ): void
    /** FileSystemManager.stat 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.statSync.html
     */
    statSync(
      /** 文件/目录路径 */
      path: string,
      /** 是否递归获取目录下的每个文件的 Stats 信息 */
      recursive?: boolean,
    ): Stats | General.IAnyObject
    /** FileSystemManager.saveFile 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.saveFileSync.html
     */
    saveFileSync(
      /** 临时存储文件路径 */
      tempFilePath: string,
      /** 要存储的文件路径 */
      filePath?: string,
    ): string
    /** FileSystemManager.readFile 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readFileSync.html
     */
    readFileSync(
      /** 要读取的文件的路径 */
      filePath: string,
      /**从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte */
      position?: number,
      /**指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte */
      length?: number,
      /** 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 */
      encoding?: keyof FileSystemManager.encoding,
    ): string | ArrayBuffer
    /** 获取文件的状态信息
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.fstat.html
     */
    fstat(option: FileSystemManager.FstatOption): void
    /** FileSystemManager.fstat 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.fstatSync.html
     */
    fstatSync(option: FileSystemManager.FstatSyncOption): Stats
    /**关闭文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.close.html
     */
    close(option: FileSystemManager.CloseOption): void
    /**FileSystemManager.close 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.closeSync.html
     */
    closeSync(option: FileSystemManager.CloseSyncOption): void
    /**对文件内容进行截断操作
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncate.html
     */
    ftruncate(option: FileSystemManager.FtruncateOption): void
    /**FileSystemManager.ftruncate 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncateSync.html
     */
    ftruncateSync(option: FileSystemManager.FtruncateSyncOption): void
    /**打开文件，返回文件描述符
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.open.html
     */
    open(option: FileSystemManager.OpenOption): void
    /**FileSystemManager.ftruncate 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.ftruncateSync.html
     */
    openSync(option: FileSystemManager.OpenSyncOption): string /** 文件描述符 */
    /** 读文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.read.html
     */
    read(option: FileSystemManager.ReadOption): void
    /** FileSystemManager.read 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.readSync.html
     */
    readSync(
      option: FileSystemManager.ReadSyncOption
    ): {
      /** 实际读取的字节数 */
      bytesRead: number
      /** 被写入的缓存区的对象，即接口入参的 arrayBuffer */
      arrayBuffer: ArrayBuffer
    }
    /** 对文件内容进行截断操作
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.truncate.html
     */
    truncate(option: FileSystemManager.TruncateOption): void
    /** truncate 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.truncateSync.html
     */
    truncateSync(option: FileSystemManager.TruncateSyncOption): void
    /** 写入文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.write.html
     */
    write(option: FileSystemManager.WriteOption): void
    /** write 的同步版本
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/FileSystemManager.writeSync.html
     */
    writeSync(
      option: FileSystemManager.WriteSyncOption
    ): {
      /** 实际被写入到文件中的字节数（注意，被写入的字节数不一定与被写入的字符串字符数相同） */
      bytesWritten: number
    }
  }

  namespace FileSystemManager {
    /** 字符编码 */
    interface encoding {
      ascii
      base64
      binary
      hex
      /** 以小端序读取 */
      ucs2
      /** 以小端序读取 */
      'ucs-2'
      /** 以小端序读取 */
      utf16le
      /** 以小端序读取 */
      'utf-16le'
      'utf-8'
      utf8
      latin1
    }
    /** 文件系统标志 */
    interface flag {
      a /**打开文件用于追加。 如果文件不存在，则创建该文件	*/
      ax /**类似于 'a'，但如果路径存在，则失败	*/
      'a+' /**打开文件用于读取和追加。 如果文件不存在，则创建该文件	*/
      'ax+' /**类似于 'a+'，但如果路径存在，则失败	*/
      as /**打开文件用于追加（在同步模式中）。 如果文件不存在，则创建该文件	*/
      'as+' /**打开文件用于读取和追加（在同步模式中）。 如果文件不存在，则创建该文件	*/
      r /**打开文件用于读取。 如果文件不存在，则会发生异常	*/
      'r+' /**打开文件用于读取和写入。 如果文件不存在，则会发生异常	*/
      w /**打开文件用于写入。 如果文件不存在则创建文件，如果文件存在则截断文件	*/
      wx /**类似于 'w'，但如果路径存在，则失败	*/
      'w+' /**打开文件用于读取和写入。 如果文件不存在则创建文件，如果文件存在则截断文件	*/
      'wx+' /**类似于 'w+'，但如果路径存在，则失败*/
    }
    interface AccessOption {
      /** 要判断是否存在的文件/目录路径 */
      path: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: AccessFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface AccessFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory ${path}': 文件/目录不存在; */
      errMsg: string
    }

    interface AppendFileOption {
      /** 要追加的文本或二进制数据 */
      data: string | ArrayBuffer
      /** 要追加内容的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 指定写入文件的字符编码 */
      encoding?: keyof FileSystemManager.encoding
      /** 接口调用失败的回调函数 */
      fail?: (result: AppendFileFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface AppendFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory, open ${filePath}': 指定的 filePath 文件不存在;
       * - 'fail illegal operation on a directory, open "${filePath}"': 指定的 filePath 是一个已经存在的目录;
       * - 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;
       * - 'fail sdcard not mounted': 指定的 filePath 是一个已经存在的目录; */
      errMsg: string
    }

    interface CopyFileOption {
      /** 目标文件路径 */
      destPath: string
      /** 源文件路径，只可以是普通文件 */
      srcPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: CopyFileFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface CopyFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail permission denied, copyFile ${srcPath} -> ${destPath}': 指定目标文件路径没有写权限;
       * - 'fail no such file or directory, copyFile ${srcPath} -> ${destPath}': 源文件不存在，或目标文件路径的上层目录不存在;
       * - 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; */
      errMsg: string
    }

    interface getFileInfoOption {
      /** 要读取的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: GetFileInfoFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: GetFileInfoSuccessCallbackResult) => void
    }

    interface GetFileInfoFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail file not exist': 指定的 filePath 找不到文件; */
      errMsg: string
    }
    interface GetFileInfoSuccessCallbackResult extends General.CallbackResult {
      /** 文件大小，以字节为单位 */
      size: number
      /** 调用结果 */
      errMsg: string
    }

    interface getSavedFileListOption {
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: GetSavedFileListSuccessCallbackResult) => void
    }

    interface GetSavedFileListSuccessCallbackResult extends General.CallbackResult {
      /** 文件数组 */
      fileList: GetSavedFileListSuccessCallbackResultFileItem[]
      /** 调用结果 */
      errMsg: string
    }
    /** 文件数组 */
    interface GetSavedFileListSuccessCallbackResultFileItem {
      /** 文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数 */
      createTime: number
      /** 本地路径 */
      filePath: string
      /** 本地文件大小，以字节为单位 */
      size: number
    }

    interface MkdirOption {
      /** 创建的目录路径 */
      dirPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: MkdirFailCallbackResult) => void
      /** 是否在递归创建该目录的上级目录后再创建该目录。如果对应的上级目录已经存在，则不创建该上级目录。如 dirPath 为 a/b/c/d 且 recursive 为 true，将创建 a 目录，再在 a 目录下创建 b 目录，以此类推直至创建 a/b/c 目录下的 d 目录。 */
      recursive?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface MkdirFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory ${dirPath}': 上级目录不存在;
       * - 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;
       * - 'fail file already exists ${dirPath}': 有同名文件或目录; */
      errMsg: string
    }

    interface ReadFileOption {
      /** 要读取的文件的路径 */
      filePath: string
      /** 从文件指定位置开始读，如果不指定，则从文件头开始读。读取的范围应该是左闭右开区间 [position, position+length)。有效范围：[0, fileLength - 1]。单位：byte*/
      position?: number
      /**指定文件的长度，如果不指定，则读到文件末尾。有效范围：[1, fileLength]。单位：byte */
      length?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 指定读取文件的字符编码，如果不传 encoding，则以 ArrayBuffer 格式读取文件的二进制内容 */
      encoding?: keyof FileSystemManager.encoding
      /** 接口调用失败的回调函数 */
      fail?: (result: ReadFileFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: ReadFileSuccessCallbackResult) => void
    }
    interface ReadFileSuccessCallbackResult extends General.CallbackResult {
      /** 文件内容 */
      data: string | ArrayBuffer
      /** 调用结果 */
      errMsg: string
    }
    interface ReadFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;
       * - 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限; */
      errMsg: string
    }

    interface ReaddirOption {
      /** 要读取的目录路径 */
      dirPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: ReaddirFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (result: ReaddirSuccessCallbackResult) => void
    }

    interface ReaddirFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory ${dirPath}': 目录不存在;
       * - 'fail not a directory ${dirPath}': dirPath 不是目录;
       * - 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有读权限; */
      errMsg: string
    }
    interface ReaddirSuccessCallbackResult extends General.CallbackResult {
      /** 指定目录下的文件名数组。 */
      files: string[]
      /** 调用结果 */
      errMsg: string
    }

    interface RemoveSavedFileOption {
      /** 需要删除的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: RemoveSavedFileFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface RemoveSavedFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail file not exist': 指定的 tempFilePath 找不到文件; */
      errMsg: string
    }

    interface RenameOption {
      /** 新文件路径 */
      newPath: string
      /** 源文件路径，可以是普通文件或目录 */
      oldPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: RenameFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface RenameFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail permission denied, rename ${oldPath} -> ${newPath}': 指定源文件或目标文件没有写权限;
       * - 'fail no such file or directory, rename ${oldPath} -> ${newPath}': 源文件不存在，或目标文件路径的上层目录不存在; */
      errMsg: string
    }

    interface RmdirOption {
      /** 要删除的目录路径 */
      dirPath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: RmdirFailCallbackResult) => void
      /** 是否递归删除目录。如果为 true，则删除该目录和该目录下的所有子目录以及文件。 */
      recursive?: boolean
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface RmdirFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory ${dirPath}': 目录不存在;
       * - 'fail directory not empty': 目录不为空;
       * - 'fail permission denied, open ${dirPath}': 指定的 dirPath 路径没有写权限; */
      errMsg: string
    }

    interface SaveFileOption {
      /** 临时存储文件路径 */
      tempFilePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: SaveFileFailCallbackResult) => void
      /** 要存储的文件路径 */
      filePath?: string
      /** 接口调用成功的回调函数 */
      success?: (result: SaveFileSuccessCallbackResult) => void
    }

    interface SaveFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail tempFilePath file not exist': 指定的 tempFilePath 找不到文件;
       * - 'fail permission denied, open "${filePath}"': 指定的 filePath 路径没有写权限;
       * - 'fail no such file or directory "${dirPath}"': 上级目录不存在;
       * - 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; */
      errMsg: string
    }
    interface SaveFileSuccessCallbackResult extends General.CallbackResult {
      /** 存储后的文件路径 */
      savedFilePath: string
      /** 调用结果 */
      errMsg: string
    }

    interface StatOption {
      /** 文件/目录路径 */
      path: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: StatFailCallbackResult) => void
      /** 是否递归获取目录下的每个文件的 Stats 信息 */
      recursive?: boolean
      /** 接口调用成功的回调函数 */
      success?: (result: StatSuccessCallbackResult) => void
    }
    interface StatFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;
       * - 'fail no such file or directory ${path}': 文件不存在; */
      errMsg: string
    }
    interface StatSuccessCallbackResult extends General.CallbackResult {
      /** [Stats](https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.html)|Object
       *
       * 当 recursive 为 false 时，res.stats 是一个 Stats 对象。当 recursive 为 true 且 path 是一个目录的路径时，res.stats 是一个 Object，key 以 path 为根路径的相对路径，value 是该路径对应的 Stats 对象。 */
      stats: Stats | General.IAnyObject
      /** 调用结果 */
      errMsg: string
    }

    interface UnlinkOption {
      /** 要删除的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: UnlinkFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface UnlinkFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail permission denied, open ${path}': 指定的 path 路径没有读权限;
       * - 'fail no such file or directory ${path}': 文件不存在;
       * - 'fail operation not permitted, unlink ${filePath}': 传入的 filePath 是一个目录; */
      errMsg: string
    }

    interface UnzipOption {
      /** 目标目录路径 */
      targetPath: string
      /** 源文件路径，只可以是 zip 压缩文件 */
      zipFilePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: UnzipFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }

    interface UnzipFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail permission denied, unzip ${zipFilePath} -> ${destPath}': 指定目标文件路径没有写权限;
       * - 'fail no such file or directory, unzip ${zipFilePath} -> "${destPath}': 源文件不存在，或目标文件路径的上层目录不存在; */
      errMsg: string
    }

    interface WriteFileOption {
      /** 要写入的文本或二进制数据 */
      data: string | ArrayBuffer
      /** 要写入的文件路径 */
      filePath: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 指定写入文件的字符编码 */
      encoding?: keyof FileSystemManager.encoding
      /** 接口调用失败的回调函数 */
      fail?: (result: WriteFileFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface WriteFileFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory, open ${filePath}': 指定的 filePath 所在目录不存在;
       * - 'fail permission denied, open ${dirPath}': 指定的 filePath 路径没有写权限;
       * - 'fail the maximum size of the file storage limit is exceeded': 存储空间不足; */
      errMsg: string
    }
    interface FstatOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FstatFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: FstatSuccessCallbackResult) => void
    }

    interface FstatFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'bad file descriptor':	无效的文件描述符;
       * - 'fail permission denied':	指定的 fd 路径没有读权限; */
      errMsg: string
    }
    interface FstatSuccessCallbackResult extends General.CallbackResult {
      /** Stats 对象，包含了文件的状态信息 */
      stats: Stats
      /** 调用结果 */
      errMsg: string
    }
    interface FstatSyncOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
    }
    interface CloseOption {
      /** 需要被关闭的文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: CloseFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface CloseFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'bad file descriptor':	无效的文件描述符 */
      errMsg: string
    }
    interface CloseSyncOption {
      /** 需要被关闭的文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
    }
    interface FtruncateOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 截断位置，默认0。如果 length 小于文件长度（单位：字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） */
      length: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: FtruncateFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface FtruncateFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'bad file descriptor':	无效的文件描述符
       * - 'fail permission denied':	指定的 fd 没有写权限
       * - 'fail the maximum size of the file storage limit is exceeded':	存储空间不足
       * - 'fail sdcard not mounted	android sdcard': 挂载失败 */
      errMsg: string
    }
    interface FtruncateSyncOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /**截断位置，默认0。如果 length 小于文件长度（单位：字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） */
      length: number
    }

    interface OpenOption {
      /** 文件路径 (本地路径) */
      filePath: string
      /** 文件系统标志，默认值: 'r' */
      flag?: keyof FileSystemManager.flag
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: OpenFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: OpenSuccessCallbackResult) => void
    }
    interface OpenFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory "${filePath}"':	上级目录不存在 */
      errMsg: string
    }
    interface OpenSuccessCallbackResult extends General.CallbackResult {
      /** 文件描述符 */
      fd: string
      /** 调用结果 */
      errMsg: string
    }
    interface OpenSyncOption {
      /** 文件路径 (本地路径) */
      filePath: string
      /** 文件系统标志，默认值: 'r' */
      flag?: keyof FileSystemManager.flag
    }
    interface ReadOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 数据写入的缓冲区，必须是 ArrayBuffer 实例 */
      arrayBuffer: ArrayBuffer
      /** 缓冲区中的写入偏移量，默认0 */
      offset?: number
      /** 要从文件中读取的字节数，默认0 */
      length?: number
      /** 文件读取的起始位置，如不传或传 null，则会从当前文件指针的位置读取。如果 position 是正整数，则文件指针位置会保持不变并从 position 读取文件。 */
      position?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: ReadFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: ReadSuccessCallbackResult) => void
    }
    interface ReadFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'bad file descriptor':	无效的文件描述符	
        - 'fail permission denied':	指定的 fd 路径没有读权限	
        - 'fail the value of "offset" is out of range':	传入的 offset 不合法	
        - 'fail the value of "length" is out of range':	传入的 length 不合法	
        - 'fail sdcard not mounted':	android sdcard 挂载失败	
        - 'bad file descriptor':	无效的文件描述符 
       *  */
      errMsg: string
    }
    interface ReadSuccessCallbackResult extends General.CallbackResult {
      /** 实际读取的字节数 */
      bytesRead: string
      /** 被写入的缓存区的对象，即接口入参的 arrayBuffer */
      arrayBuffer: ArrayBuffer
      /** 调用结果 */
      errMsg: string
    }
    interface ReadSyncOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 数据写入的缓冲区，必须是 ArrayBuffer 实例 */
      arrayBuffer: ArrayBuffer
      /** 缓冲区中的写入偏移量，默认0 */
      offset?: number
      /** 要从文件中读取的字节数，默认0 */
      length?: number
      /** 文件读取的起始位置，如不传或传 null，则会从当前文件指针的位置读取。如果 position 是正整数，则文件指针位置会保持不变并从 position 读取文件。 */
      position?: number
    }
    interface TruncateOption {
      /** 要截断的文件路径 (本地路径) */
      filePath: string
      /** 截断位置，默认0。如果 length 小于文件长度（字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） */
      length?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: TruncateFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: General.CallbackResult) => void
    }
    interface TruncateFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * - 'fail no such file or directory, open ${filePath}':	指定的 filePath 所在目录不存在	
        - 'fail illegal operation on a directory, open "${filePath}"':	指定的 filePath 是一个已经存在的目录
        - 'fail permission denied, open ${dirPath}':	指定的 filePath 路径没有写权限	
        - 'fail the maximum size of the file storage limit is exceeded':	存储空间不足	
        - 'fail sdcard not mounted':	android sdcard 挂载失败	
       *  */
      errMsg: string
    }
    interface TruncateSyncOption {
      /** 要截断的文件路径 (本地路径) */
      filePath: string
      /** 截断位置，默认0。如果 length 小于文件长度（字节），则只有前面 length 个字节会保留在文件中，其余内容会被删除；如果 length 大于文件长度，则会对其进行扩展，并且扩展部分将填充空字节（'\0'） */
      length?: number
    }
    interface WriteOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 写入的内容，类型为 String 或 ArrayBuffer */
      data: string | ArrayBuffer
      /** 只在 data 类型是 ArrayBuffer 时有效，决定 arrayBuffe 中要被写入的部位，即 arrayBuffer 中的索引，默认0 */
      offset?: number
      /** 只在 data 类型是 ArrayBuffer 时有效，指定要写入的字节数，默认为 arrayBuffer 从0开始偏移 offset 个字节后剩余的字节数 */
      length?: number
      /** 只在 data 类型是 String 时有效，指定写入文件的字符编码，默认为 utf8 */
      encoding?: keyof FileSystemManager.encoding
      /** 指定文件开头的偏移量，即数据要被写入的位置。当 position 不传或者传入非 Number 类型的值时，数据会被写入当前指针所在位置。 */
      position?: number
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (result: WriteFailCallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: WriteSuccessCallbackResult) => void
    }
    interface WriteFailCallbackResult extends General.CallbackResult {
      /** 错误信息
       *
       * 可选值：
       * 'bad file descriptor':	无效的文件描述符
       * 'fail permission denied':	指定的 fd 路径没有写权限
       * 'fail sdcard not mounted':	android sdcard 挂载失败
       *  */
      errMsg: string
    }
    interface WriteSuccessCallbackResult extends General.CallbackResult {
      /** 实际被写入到文件中的字节数（注意，被写入的字节数不一定与被写入的字符串字符数相同） */
      bytesWritten: number
      /** 调用结果 */
      errMsg: string
    }
    interface WriteSyncOption {
      /** 文件描述符。fd 通过 FileSystemManager.open 或 FileSystemManager.openSync 接口获得 */
      fd: string
      /** 写入的内容，类型为 String 或 ArrayBuffer */
      data: string | ArrayBuffer
      /** 只在 data 类型是 ArrayBuffer 时有效，决定 arrayBuffe 中要被写入的部位，即 arrayBuffer 中的索引，默认0 */
      offset?: number
      /** 只在 data 类型是 ArrayBuffer 时有效，指定要写入的字节数，默认为 arrayBuffer 从0开始偏移 offset 个字节后剩余的字节数 */
      length?: number
      /** 只在 data 类型是 String 时有效，指定写入文件的字符编码，默认为 utf8 */
      encoding?: keyof FileSystemManager.encoding
      /** 指定文件开头的偏移量，即数据要被写入的位置。当 position 不传或者传入非 Number 类型的值时，数据会被写入当前指针所在位置。 */
      position?: number
    }
  }

  /** 描述文件状态的对象 */
  interface Stats {
    /** 文件最近一次被存取或被执行的时间，UNIX 时间戳，对应 POSIX stat.st_atime */
    lastAccessedTime: number
    /** 文件最后一次被修改的时间，UNIX 时间戳，对应 POSIX stat.st_mtime */
    lastModifiedTime: number
    /** 文件的类型和存取的权限，对应 POSIX stat.st_mode */
    mode: string
    /** 文件大小，单位：B，对应 POSIX stat.st_size */
    size: number
    /** 判断当前文件是否一个目录
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isDirectory.html
     */
    isDirectory(): boolean
    /** 判断当前文件是否一个普通文件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/file/Stats.isFile.html
     */
    isFile(): boolean
  }
}
