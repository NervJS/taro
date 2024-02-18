import Taro from '@tarojs/api'

import native from '../NativeApi'

export class NativeFileSystemManager implements Taro.FileSystemManager {
  private static nativeFileSystemManager: NativeFileSystemManager

  static getFileSystemManager () {
    if ( !NativeFileSystemManager.nativeFileSystemManager ) {
      NativeFileSystemManager.nativeFileSystemManager =  new NativeFileSystemManager()
    }
    return NativeFileSystemManager.nativeFileSystemManager
  }


  access (option: any): void {
    native.access(option, { isAsync: true, autoRelease: false  })
  }


  getFileInfo (option: any): any {
    native.getFileInfo(option, { isAsync: true, autoRelease: false  })
  }

  readFile (option: any): any {
    native.readFile(option, { isAsync: true, autoRelease: false  })
  }

  readFileSync (option: any): any {
    native.readFileSync(option, { isAsync: true, autoRelease: true  })
  }

  accessSync (option: any): any {
    return option
  }

  appendFile (option: any): any {
    return option
  }

  appendFileSync (option: any): any {
    return option
  }

  close (option: any): any {
    return option
  }

  closeSync (option: any): any {
    return option
  }

  copyFile (option: any): any {
    return option
  }

  copyFileSync (option: any): any {
    return option
  }

  fstat (option: any): any {
    return option
  }

  fstatSync (option: any): any {
    return option
  }

  ftruncate (option: any): any {
    return option
  }

  ftruncateSync (option: any): any {
    return option
  }


  getSavedFileList (option: any): any {
    return option
  }

  mkdir (option: any): any {
    return option
  }

  mkdirSync (option: any): any {
    return option
  }

  open (option: any): any {
    return option
  }

  openSync (option: any): any {
    return option
  }

  read (option: any): any {
    return option
  }

  readCompressedFile (option: any): any {
    return option
  }

  readCompressedFileSync (option: any): any {
    return option
  }


  readSync (option: any): any {
    return option
  }

  readZipEntry (option: any): any {
    return option
  }

  readdir (option: any): any {
    return option
  }

  readdirSync (option: any): any {
    return option
  }

  removeSavedFile (option: any): any {
    return option
  }

  rename (option: any): any {
    return option
  }

  renameSync (option: any): any {
    return option
  }

  rmdir (option: any): any {
    return option
  }

  rmdirSync (option: any): any {
    return option
  }

  saveFile (option: any): any {
    return option
  }

  saveFileSync (option: any): any {
    return option
  }

  stat (option: any): any {
    return option
  }

  statSync (option: any): any {
    return option
  }

  truncate (option: any): any {
    return option
  }

  truncateSync (option: any): any {
    return option
  }

  unlink (option: any): any {
    return option
  }

  unlinkSync (option: any): any {
    return option
  }

  unzip (option: any): any {
    return option
  }

  write (option: any): any {
    return option
  }

  writeFile (option: any): any {
    return option
  }

  writeFileSync (option: any): any {
    return option
  }

  writeSync (option: any): any {
    return option
  }
}
