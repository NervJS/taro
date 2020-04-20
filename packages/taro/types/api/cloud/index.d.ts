declare namespace Taro {
  namespace cloud {
    /** 云函数通用返回 */
    interface CallFunctionResult extends General.CallbackResult {
      /** 云函数返回的结果 */
      result: General.IAnyObject | string | undefined
      /** 调用结果 */
      errMsg: string
    }
    /** 云函数通用参数 */
    interface IAPIParam<T = any> {
      /** 配置 */
      config?: IConfig
      /** 接口调用成功的回调函数 */
      success?: (res: T) => void
      /** 接口调用失败的回调函数 */
      fail?: (err: General.CallbackResult) => void
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (val: T | General.CallbackResult) => void
    }
  
    // type IAPIFunction<T, P extends IAPIParam<T>> = (param?: P) => Promise<T>

    /** 初始化配置 */
    interface IInitConfig {
      /** 默认环境配置，传入字符串形式的环境 ID 可以指定所有服务的默认环境，传入对象可以分别指定各个服务的默认环境 */
      env?:
        | string
        | {
            /** 数据库 API 默认环境配置 */
            database?: string
            /** 存储 API 默认环境配置 */
            functions?: string
            /** 云函数 API 默认环境配置 */
            storage?: string,
          }
      /** 是否在将用户访问记录到用户管理中，在控制台中可见 */
      traceUser?: boolean
    }
    /** 配置 */
    interface IConfig {
      /** 使用的环境 ID，填写后忽略 init 指定的环境 */
      env?: string
      /** 是否在将用户访问记录到用户管理中，在控制台中可见 */
      traceUser?: boolean
    }
    /** 云函数 API 通用参数 */
    interface ICloudAPIParam<T = any> extends IAPIParam<T> {
      /** 配置 */
      config?: IConfig
    }
    // interface IICloudAPI {
    //   init: (config?: cloud.IInitConfig) => void
    //   [api: string]: (...args: any[]) => any | cloud.IAPIFunction<any, any>
    // }
    // interface ICloudService {
    //   name: string
  
    //   getAPIs: () => { [name: string]: cloud.IAPIFunction<any, any> }
    // }
    // interface ICloudServices {
    //   [serviceName: string]: ICloudService
    // }
    // interface ICloudMetaData {
    //   session_id: string
    // }

    /** 调用云函数参数 */
    interface CallFunctionParam extends ICloudAPIParam<CallFunctionResult> {
      /** 云函数名 */
      name: string
      /** 传递给云函数的参数，在云函数中可通过 event 参数获取 */
      data?: General.IAnyObject
      slow?: boolean
      /** 配置 */
      config?: IConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: CallFunctionResult | General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: CallFunctionResult) => void
    }

    /** 上传文件结果 */
    interface UploadFileResult extends General.CallbackResult {
      /** 文件 ID */
      fileID: string
      /** 服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 调用结果 */
      errMsg: string
    }

    /** 上传文件参数 */
    interface UploadFileParam extends ICloudAPIParam<UploadFileResult> {
      /** 云存储路径，命名限制见[文件名命名限制](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/guide/storage/naming.html) */
      cloudPath: string
      /** 要上传文件资源的路径 */
      filePath: string
      header?: General.IAnyObject
      /** 配置 */
      config?: IConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: UploadFileResult | General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: UploadFileResult) => void
    }

    /** 下载文件结果 */
    interface DownloadFileResult extends General.CallbackResult {
      /** 临时文件路径 */
      tempFilePath: string
      /** 服务器返回的 HTTP 状态码 */
      statusCode: number
      /** 调用结果 */
      errMsg: string
    }

    /** 下载文件参数 */
    interface DownloadFileParam extends ICloudAPIParam<DownloadFileResult> {
      /** 云文件 ID */
      fileID: string
      cloudPath?: string
      /** 配置 */
      config?: IConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: DownloadFileResult | General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: DownloadFileResult) => void
    }

    /** 获取临时文件结果 */
    interface GetTempFileURLResult extends General.CallbackResult {
      /** 文件列表 */
      fileList: GetTempFileURLResultItem[]
      /** 调用结果 */
      errMsg: string
    }

    /** 临时文件列表 */
    interface GetTempFileURLResultItem extends General.CallbackResult {
      /** 云文件 ID */
      fileID: string
      /** 临时文件路径 */
      tempFileURL: string
      maxAge: number
      /** 状态码 */
      status: number
      /** 调用结果 */
      errMsg: string
    }

    /** 获取临时文件参数 */
    interface GetTempFileURLParam extends ICloudAPIParam<GetTempFileURLResult> {
      fileList: string[]
      /** 配置 */
      config?: IConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: GetTempFileURLResult | General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: GetTempFileURLResult) => void
    }

    /** 删除文件结果 */
    interface DeleteFileResult extends General.CallbackResult {
      /** 文件列表 */
      fileList: DeleteFileResultItem[]
      /** 调用结果 */
      errMsg: string
    }

    /** 删除文件列表 */
    interface DeleteFileResultItem extends General.CallbackResult {
      /** 云文件 ID */
      fileID: string
      /** 状态码 */
      status: number
      /** 调用结果 */
      errMsg: string
    }

    /** 删除文件参数 */
    interface DeleteFileParam extends ICloudAPIParam<DeleteFileResult> {
      /** 文件列表 */
      fileList: string[]
      /** 配置 */
      config?: IConfig
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: DeleteFileResult | General.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: General.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: DeleteFileResult) => void
    }
  }

  /** 云开发 SDK 实例
   * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.html
   */
  abstract class cloud {
    /** 在调用云开发各 API 前，需先调用初始化方法 init 一次（全局只需一次，多次调用时只有第一次生效）
     * @supported weapp
     * @example
     * ```tsx
     * Taro.cloud.init({
     *   env: 'test-x1dzi'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/init/client.init.html
     */
    static init(config?: cloud.IInitConfig): void

    /** 调用云函数
     * @supported weapp
     * @example
     * 假设已有一个云函数 add，在小程序端发起对云函数 add 的调用：
     * 
     * ```tsx
     * Taro.cloud.callFunction({
     * // 要调用的云函数名称
     * name: 'add',
     *   // 传递给云函数的event参数
     *   data: {
     *     x: 1,
     *     y: 2,
     *   }
     * }).then(res => {
     *   // output: res.result === 3
     * }).catch(err => {
     *   // handle error
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/functions/Cloud.callFunction.html
     */
    static callFunction(param: OQ<cloud.CallFunctionParam>): void
    static callFunction(param: RQ<cloud.CallFunctionParam>): Promise<cloud.CallFunctionResult>

    /** 将本地资源上传至云存储空间，如果上传至同一路径则是覆盖写
     * @supported weapp
     * @example
     * ```tsx
     * Taro.cloud.uploadFile({
     *   cloudPath: 'example.png',
     *   filePath: '', // 文件路径
     *   success: res => {
     *     // get resource ID
     *     console.log(res.fileID)
     *   },
     *   fail: err => {
     *     // handle error
     *   }
     * })
     * ```
     * @example
     * ```tsx
     * Taro.cloud.uploadFile({
     *   cloudPath: 'example.png',
     *   filePath: '', // 文件路径
     * }).then(res => {
     *   // get resource ID
     *   console.log(res.fileID)
     * }).catch(error => {
     *   // handle error
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/uploadFile/client.uploadFile.html
     */
    static uploadFile(param: OQ<cloud.UploadFileParam>): Taro.UploadTask
    static uploadFile(param: RQ<cloud.UploadFileParam>): Promise<cloud.UploadFileResult>

    /** 从云存储空间下载文件
     * @supported weapp
     * @example
     * ```tsx
     * Taro.cloud.downloadFile({
     *   fileID: 'a7xzcb',
     *   success: res => {
     *     // get temp file path
     *     console.log(res.tempFilePath)
     *   },
     *   fail: err => {
     *     // handle error
     *   }
     * })
     * ```
     * @example
     * ```tsx
     * Taro.cloud.downloadFile({
     *   fileID: 'a7xzcb'
     * }).then(res => {
     *   // get temp file path
     *   console.log(res.tempFilePath)
     * }).catch(error => {
     *   // handle error
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/downloadFile/client.downloadFile.html
     */
    static downloadFile(param: OQ<cloud.DownloadFileParam>): Taro.DownloadTask
    static downloadFile(param: RQ<cloud.DownloadFileParam>): Promise<cloud.DownloadFileResult>

    /** 用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 个。
     * @supported weapp
     * @example
     * ```tsx
     * Taro.cloud.getTempFileURL({
     *   fileList: [{
     *     fileID: 'a7xzcb',
     *     maxAge: 60 * 60, // one hour
     *   }]
     * }).then(res => {
     *   // get temp file URL
     *   console.log(res.fileList)
     * }).catch(error => {
     *   // handle error
     * })
     * ```
     * @example
     * ```tsx
     * Taro.cloud.getTempFileURL({
     *   fileList: ['cloud://xxx', 'cloud://yyy'],
     *   success: res => {
     *     // get temp file URL
     *     console.log(res.fileList)
     *   },
     *   fail: err => {
     *     // handle error
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.getTempFileURL.html
     */
    static getTempFileURL(param: OQ<cloud.GetTempFileURLParam>): void
    static getTempFileURL(param: RQ<cloud.GetTempFileURLParam>): Promise<cloud.GetTempFileURLResult>

    /** 从云存储空间删除文件，一次最多 50 个
     * @supported weapp
     * @example
     * ```tsx
     * .cloud.deleteFile({
     *   fileList: ['a7xzcb']
     * }).then(res => {
     *   // handle success
     *   console.log(res.fileList)
     * }).catch(error => {
     *   // handle error
     * })
     * ```
     * @example
     * ```tsx
     * Taro.cloud.deleteFile({
     *   fileList: ['a7xzcb'],
     *   success: res => {
     *     // handle success
     *     console.log(res.fileList)
     *   },
     *   fail: err => {
     *     // handle error
     *   },
     *   complete: res => {
     *     // ...
     *   }
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/storage/Cloud.deleteFile.html
     */
    static deleteFile(param: OQ<cloud.DeleteFileParam>): void
    static deleteFile(param: RQ<cloud.DeleteFileParam>): Promise<cloud.DeleteFileResult>

    /** 获取数据库实例
     * @supported weapp
     * @example
     * 以下调用获取默认环境的数据库的引用：
     * 
     * ```tsx
     * const db = Taro.cloud.database()
     * ```
     * @example
     * 假设有一个环境名为 test-123，用做测试环境，那么可以如下获取测试环境数据库：
     * 
     * ```tsx
     * const testDB = Taro.cloud.database({
     *   env: 'test-123'
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/Cloud.database.html
     */
    static database(config?: cloud.IConfig): DB.Database
  }

  namespace DB {
    /** 云开发 SDK 数据库实例
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.html
     */
    interface Database {
      /** 数据库配置 */
      readonly config: cloud.IConfig
      /** 数据库操作符，通过 db.command 获取
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Command.html
       */
      readonly command: Command
      /** 数据库地理位置结构集
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Geo.html
       */
      readonly Geo: IGeo
      /** 构造一个服务端时间的引用。可用于查询条件、更新字段值或新增记录时的字段值。
       * @supported weapp
       * @example
       * 新增记录时设置字段为服务端时间：
       * 
       * ```tsx
       * db.collection('todos').add({
       *   description: 'eat an apple',
       *   createTime: db.serverDate()
       * })
       * ```
       * 更新字段为服务端时间往后一小时：
       * 
       * ```tsx
       * db.collection('todos').doc('my-todo-id').update({
       *   due: db.serverDate({
       *     offset: 60 * 60 * 1000
       *   })
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.serverDate.html
       */
      serverDate(): Database.ServerDate
      /** 构造正则表达式，仅需在普通 js 正则表达式无法满足的情况下使用
       * @supported weapp
       * @example
       * ```tsx
       * // 原生 JavaScript 对象
       * db.collection('todos').where({
       *   description: /miniprogram/i
       * })
       * 
       * // 数据库正则对象
       * db.collection('todos').where({
       *   description: db.RegExp({
       *     regexp: 'miniprogram',
       *     options: 'i',
       *   })
       * })
       * 
       * // 用 new 构造也是可以的
       * db.collection('todos').where({
       *   description: new db.RegExp({
       *     regexp: 'miniprogram',
       *     options: 'i',
       *   })
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.RegExp.html
       */
      RegExp(options: Database.IRegExp.IRegExpOptions): Database.IRegExp
      /** 获取集合的引用。方法接受一个 `name` 参数，指定需引用的集合名称。
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * const todosCollection = db.collection('todos')
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Database.collection.html
       */
      collection(collectionName: string): Collection
    }

    namespace Database {
      /** 可用于查询条件、更新字段值或新增记录时的字段值。 */
      interface ServerDate {
        readonly options: ServerDate.IOptions
      }
  
      namespace ServerDate {
        interface IOptions {
          offset: number
        }
      }

      /** 构造正则表达式 */
      interface IRegExp {
        readonly regexp: string
        readonly options: string
      }
  
      namespace IRegExp {    
        interface IRegExpOptions {
          regexp: string
          options?: string
        }
      }

      /** 内部符号 */
      interface InternalSymbol {}
    }

    /** 数据库集合引用
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Collection.html
     */
    interface Collection extends Query {
      /** 集合名称 */
      readonly collectionName: string
      /** 集合所在数据库引用 */
      readonly database: Database

      /** 获取集合中指定记录的引用。方法接受一个 `id` 参数，指定需引用的记录的 `_id`。
       * @supported weapp
       * @example
       * ```tsx
       * const myTodo = db.collection('todos').doc('my-todo-id')
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.doc.html
       */
      doc(
        /** 记录 _id */
        docId: string | number
      ): Document

      /** 发起聚合操作，定义完聚合流水线阶段之后需调用 end 方法标志结束定义并实际发起聚合操作
       * @supported weapp
       * @example
       * ```tsx
       * const $ = db.command.aggregate
       * db.collection('books').aggregate()
       *   .group({
       *     // 按 category 字段分组
       *     _id: '$category',
       *     // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
       *     avgSales: $.avg('$sales')
       *   })
       *   .end()
       *   .then(res => console.log(res))
       *   .catch(err => console.error(err))
       * ```
       * @example
       * ```tsx
       * const $ = db.command.aggregate
       * db.collection('books').aggregate()
       *   .group({
       *     // 按 category 字段分组
       *     _id: '$category',
       *     // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
       *     avgSales: $.avg('$sales')
       *   })
       *   .end({
       *     success: function(res) {
       *       console.log(res)
       *     },
       *     fail: function(err) {
       *       console.error(err)
       *     }
       *   })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.aggregate.html
       */
      aggregate(): Aggregate

      /** 指定查询条件，返回带新查询条件的新的集合引用
       * @supported weapp
       * @example
       * ```tsx
       * const _ = db.command
       * const result = await db.collection('todos').where({
       *   price: _.lt(100)
       * }).get()
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.where.html
       */
      where(condition: Query.IQueryCondition): Collection

      /** 指定查询结果集数量上限
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').limit(10)
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.limit.html
       */
      limit(value: number): Collection

      /** 指定查询排序条件
       * @supported weapp
       * @example
       * 按一个字段排序：按进度排升序取待办事项
       * 
       * ```tsx
       * db.collection('todos').orderBy('progress', 'asc')
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * 
       * 按多个字段排序：先按 progress 排降序（progress 越大越靠前）、再按 description 排升序（字母序越前越靠前）取待办事项
       * 
       * ```tsx
       * db.collection('todos')
       *   .orderBy('progress', 'desc')
       *   .orderBy('description', 'asc')
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.orderBy.html
       */
      orderBy(fieldPath: string, string: 'asc' | 'desc'): Collection

      /** 指定查询返回结果时从指定序列后的结果开始返回，常用于分页
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').skip(10)
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.skip.html
       */
      skip(offset: number): Collection

      /** 指定返回结果中记录需返回的字段
       * 
       * **说明**
       * 
       * 方法接受一个必填对象用于指定需返回的字段，对象的各个 key 表示要返回或不要返回的字段，value 传入 true|false（或 1|-1）表示要返回还是不要返回。
       * 如果指定的字段是数组字段，还可以用以下方法只返回数组的第一个元素：在该字段 key 后面拼接上 `.$` 成为 `字段.$` 的形式。
       * 如果指定的字段是数组字段，还可以用 `db.command.project.slice` 方法返回数组的子数组：
       * 方法既可以接收一个正数表示返回前 n 个元素，也可以接收一个负数表示返回后 n 个元素；还可以接收一个包含两个数字 `[ skip, limit ]` 的数组，如果 `skip` 是正数，表示跳过 `skip` 个元素后再返回接下来的 `limit` 个元素，如果 `skip` 是负数，表示从倒数第 `skip` 个元素开始，返回往后数的 `limit` 个元素
       * 
       * - 返回数组的前 5 个元素：`{ tags: db.command.project.slice(5) }`
       * - 返回数组的后 5 个元素：`{ tags: db.command.project.slice(-5) }`
       * - 跳过前 5 个元素，返回接下来 10 个元素：`{ tags: db.command.project.slice(5, 10) }`
       * - 从倒数第 5 个元素开始，返回接下来正方向数的 10 个元素：`{ tags: db.command.project.slice(-5, 10) }`
       * @supported weapp
       * @example
       * 返回 description, done 和 progress 三个字段：
       * 
       * ```tsx
       * db.collection('todos').field({
       *   description: true,
       *   done: true,
       *   progress: true,
       *   // 只返回 tags 数组前 3 个元素
       *   tags: db.command.project.slice(3),
       * })
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.field.html
       */
      field(object: General.IAnyObject): Collection

      /** 获取集合数据，或获取根据查询条件筛选后的集合数据。
       * 
       * **使用说明**
       * 
       * 统计集合记录数或统计查询语句对应的结果记录数
       * 
       * 小程序端与云函数端的表现会有如下差异：
       * 
       * - 小程序端：如果没有指定 limit，则默认且最多取 20 条记录。
       * - 云函数端：如果没有指定 limit，则默认且最多取 100 条记录。
       * 
       * 如果没有指定 skip，则默认从第 0 条记录开始取，skip 常用于分页。
       * 
       * 如果需要取集合中所有的数据，仅在数据量不大且在云函数中时
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).get().then(res => {
       *   console.log(res.data)
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.get.html
       */
      get(): Promise<Query.IQueryResult>

      /** 统计匹配查询条件的记录的条数
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).count().then(res => {
       *   console.log(res.total)
       * })
       * ```
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).count({
       *   success: function(res) {
       *     console.log(res.total)
       *   },
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.count.html
       */
      count(): Promise<Query.ICountResult>

      /** 新增记录，如果传入的记录对象没有 _id 字段，则由后台自动生成 _id；若指定了 _id，则不能与已有记录冲突
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').add({
       *   // data 字段表示需新增的 JSON 数据
       *   data: {
       *     description: "learn cloud database",
       *     due: new Date("2018-09-01"),
       *     tags: [
       *       "cloud",
       *       "database"
       *     ],
       *     location: new db.Geo.Point(113, 23),
       *     done: false
       *   }
       * })
       * .then(res => {
       *   console.log(res)
       * })
       * .catch(console.error)
       * ```
       * @example
       * ```tsx
       * db.collection('todos').add({
       *   // data 字段表示需新增的 JSON 数据
       *   data: {
       *     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
       *     description: "learn cloud database",
       *     due: new Date("2018-09-01"),
       *     tags: [
       *       "cloud",
       *       "database"
       *     ],
       *     // 为待办事项添加一个地理位置（113°E，23°N）
       *     location: new db.Geo.Point(113, 23),
       *     done: false
       *   },
       *   success: function(res) {
       *     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
       *     console.log(res)
       *   },
       *   fail: console.error,
       *   complete: cosnole.log
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.add.html 
       */
      add(options: OQ<Document.IAddDocumentOptions>): void
      add(options: RQ<Document.IAddDocumentOptions>): Promise<Query.IAddResult>

      /** 监听集合中符合查询条件的数据的更新事件。注意使用 watch 时，只有 where 语句会生效，orderBy、limit 等不生效。
       * @supported weapp
       * @example
       * 根据查询条件监听
       * 
       * ```tsx
       * const db = Taro.cloud.database()
       * const watcher = db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).watch({
       *   onChange: function(snapshot) {
       *     console.log('snapshot', snapshot)
       *   },
       *   onError: function(err) {
       *     console.error('the watch closed because of error', err)
       *   }
       * })
       * ```
       * @example
       * 监听一个记录的变化
       * 
       * ```tsx
       * const db = Taro.cloud.database()
       * const watcher = db.collection('todos').doc('x').watch({
       *   onChange: function(snapshot) {
       *     console.log('snapshot', snapshot)
       *   },
       *   onError: function(err) {
       *     console.error('the watch closed because of error', err)
       *   }
       * })
       * ```
       * @example
       * 关闭监听
       * 
       * ```tsx
       * const db = Taro.cloud.database()
       * const watcher = db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).watch({
       *   onChange: function(snapshot) {
       *     console.log('snapshot', snapshot)
       *   },
       *   onError: function(err) {
       *     console.error('the watch closed because of error', err)
       *   }
       * })
       * // ...
       * // 关闭
       * await watcher.close()
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.watch.html
       */
      watch(options: Document.IWatchDocumentOptions): Document.IWatcher
    }

    /** 数据库记录引用
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Document.html
     */
    interface Document {
      /** 获取记录数据，或获取根据查询条件筛选后的记录数据
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').doc('<some-todo-id>').get().then(res => {
       *   console.log(res.data)
       * })
       * ```
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').doc('<some-todo-id>').get({
       *   success: function(res) {
       *     console.log(res.data)
       *   },
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.get.html
       */
      get(options: OQ<Document.IGetDocumentOptions>): void
      get(options: RQ<Document.IGetDocumentOptions>): Promise<Query.IQuerySingleResult>

      /** 替换更新一条记
       * @supported weapp
       * @example
       * ```tsx
       * const _ = db.command
       * db.collection('todos').doc('todo-identifiant-aleatoire').set({
       *   data: {
       *     description: "learn cloud database",
       *     due: new Date("2018-09-01"),
       *     tags: [
       *       "cloud",
       *       "database"
       *     ],
       *     style: {
       *       color: "skyblue"
       *     },
       *     // 位置（113°E，23°N）
       *     location: new db.Geo.Point(113, 23),
       *     done: false
       *   }
       * }).then(res => {
       *   console.log(res)
       * }).catch(err => {
       *   console.error(err)
       * })
       * ```
       * @example
       * ```tsx
       * const _ = db.command
       * db.collection('todos').doc('todo-identifiant-aleatoire').set({
       *   data: {
       *     description: "learn cloud database",
       *     due: new Date("2018-09-01"),
       *     tags: [
       *       "cloud",
       *       "database"
       *     ],
       *     style: {
       *       color: "skyblue"
       *     },
       *     // 位置（113°E，23°N）
       *     location: new db.Geo.Point(113, 23),
       *     done: false
       *   },
       *   success: function(res) {
       *     console.log(res.data)
       *   },
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.set.html
       */
      set(options: OQ<Document.ISetSingleDocumentOptions>): void
      set(options: RQ<Document.ISetSingleDocumentOptions>): Promise<Query.ISetResult>

      /** 更新一条记录
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').doc('todo-identifiant-aleatoire').update({
       *   // data 传入需要局部更新的数据
       *   data: {
       *     // 表示将 done 字段置为 true
       *     done: true
       *   }
       * })
       * .then(console.log)
       * .catch(console.error)
       * ```
       * @example
       * db.collection('todos').doc('todo-identifiant-aleatoire').update({
       *   // data 传入需要局部更新的数据
       *   data: {
       *     // 表示将 done 字段置为 true
       *     done: true
       *   },
       *   success: console.log,
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.update.html
       */
      update(options: OQ<Document.IUpdateSingleDocumentOptions>): void
      update(options: RQ<Document.IUpdateSingleDocumentOptions>): Promise<Query.IUpdateResult>

      /** 删除一条记录
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').doc('todo-identifiant-aleatoire').remove()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @example
       * ```tsx
       * db.collection('todos').doc('todo-identifiant-aleatoire').remove({
       *   success: console.log,
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/document/Document.remove.html
       */
      remove(options: OQ<Document.IRemoveSingleDocumentOptions>): void
      remove(options: RQ<Document.IRemoveSingleDocumentOptions>): Promise<Query.IRemoveResult>
    }

    namespace Document {
      /** 记录 ID */
      type DocumentId = string | number

      /** 记录结构 */
      interface IDocumentData {
        /** 新增的记录 _id */
        _id?: DocumentId
        [key: string]: any
      }
  
      /** 数据库 API 通用参数 */
      type IDBAPIParam = cloud.IAPIParam
  
      /** 新增记录的定义 */
      interface IAddDocumentOptions extends IDBAPIParam {
        /** 新增记录的定义 */
        data: IDocumentData
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }
  
      /** 监听集合中符合查询条件的数据的更新事件 */
      interface IWatchDocumentOptions {
        /** 成功回调，回调传入的参数 snapshot 是变更快照 */
        onChange?: (res: General.CallbackResult) => void
        /** 失败回调 */
        onError?: (res: General.CallbackResult) => void
      }

      /** 变更快照 */
      interface ISnapshot {
        /** 更新事件数组 */
        docChanges: ChangeEvent[]
        /** 数据快照，表示此更新事件发生后查询语句对应的查询结果 */
        docs: General.IAnyObject[]
        /** 快照类型，仅在第一次初始化数据时有值为 init */
        type: string
        /** 变更事件 id */
        id: number
      }

      /** 更新事件 */
      interface ChangeEvent {
        /** 更新事件 id */
        id: number
        /** 列表更新类型，表示更新事件对监听列表的影响，枚举值 */
        queueType: keyof QueueType
        /** 数据更新类型，表示记录的具体更新类型，枚举值 */
        dataType: keyof DataType
        /** 更新的记录 id */
        docId: string
        /** 更新的完整记录 */
        doc: General.IAnyObject
        /** 所有更新的字段及字段更新后的值，`key` 为更新的字段路径，`value` 为字段更新后的值，仅在 `update` 操作时有此信息 */
        updatedFields: General.IAnyObject
        /** 所有被删除的字段，仅在 `update` 操作时有此信息 */
        removedFields: string[]
      }

      /** 列表更新类型，表示更新事件对监听列表的影响，枚举值 */
      interface QueueType {
        /** 初始化列表 */
        init
        /** 列表中的记录内容有更新，但列表包含的记录不变 */
        update
        /** 记录进入列表 */
        enqueue
        /** 记录离开列表 */
        dequeue
      }

      /** 数据更新类型，表示记录的具体更新类型，枚举值 */
      interface DataType {
        /** 初始化列表 */
        init
        /** 记录内容更新，对应 `update` 操作 */
        update
        /** 记录内容被替换，对应 `set` 操作 */
        replace
        /** 记录新增，对应 `add` 操作 */
        add
        /** 记录被删除，对应 `remove` 操作 */
        remove
      }

      interface IWatcher {
        /** 关闭监听，无需参数，返回 Promise，会在关闭完成时 resolve */
        close(): Promise<any>
      }
  
      /** 获取记录参数 */
      type IGetDocumentOptions = IDBAPIParam
  
      /** 获取记录条数参数 */
      type ICountDocumentOptions = IDBAPIParam
  
      /** 更新记录参数 */
      interface IUpdateDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }
  
      /** 更新单条记录参数 */
      interface IUpdateSingleDocumentOptions extends IDBAPIParam {
        /** 替换记录的定义 */
        data: IUpdateCondition
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }
  
      /** 替换记录参数 */
      interface ISetDocumentOptions extends IDBAPIParam {
        /** 替换记录的定义 */
        data: IUpdateCondition
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }
  
      /** 替换一条记录参数 */
      interface ISetSingleDocumentOptions extends IDBAPIParam {
        data: IUpdateCondition
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }

      /** 删除记录参数 */
      interface IRemoveDocumentOptions extends IDBAPIParam {
        query: Query.IQueryCondition
        /** 配置 */
        config?: cloud.IConfig
        /** 接口调用结束的回调函数（调用成功、失败都会执行） */
        complete?: (res: General.CallbackResult) => void
        /** 接口调用失败的回调函数 */
        fail?: (res: General.CallbackResult) => void
        /** 接口调用成功的回调函数 */
        success?: (res: General.CallbackResult) => void
      }
  
      /** 删除一条记录参数 */
      type IRemoveSingleDocumentOptions = IDBAPIParam  

      /** 更新记录定义 */
      interface IUpdateCondition {
        [key: string]: any
      }
    }

    /** 数据库 Query 引用
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Query.html
     */
    interface Query {
      /** 指定查询条件，返回带新查询条件的新的集合引用
       * @supported weapp
       * @example
       * ```tsx
       * const _ = db.command
       * const result = await db.collection('todos').where({
       *   price: _.lt(100)
       * }).get()
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.where.html
       */
      where(condition: Query.IQueryCondition): Query

      /** 指定查询排序条件
       * @supported weapp
       * @example
       * 按一个字段排序：按进度排升序取待办事项
       * 
       * ```tsx
       * db.collection('todos').orderBy('progress', 'asc')
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * 
       * 按多个字段排序：先按 progress 排降序（progress 越大越靠前）、再按 description 排升序（字母序越前越靠前）取待办事项
       * 
       * ```tsx
       * db.collection('todos')
       *   .orderBy('progress', 'desc')
       *   .orderBy('description', 'asc')
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.orderBy.html
       */
      orderBy(fieldPath: string, order: string): Query

      /** 指定查询结果集数量上限
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').limit(10)
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.limit.html
       */
      limit(max: number): Query

      /** 指定查询返回结果时从指定序列后的结果开始返回，常用于分页
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').skip(10)
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.skip.html
       */
      skip(offset: number): Query

      /** 指定返回结果中记录需返回的字段
       * 
       * **说明**
       * 
       * 方法接受一个必填对象用于指定需返回的字段，对象的各个 key 表示要返回或不要返回的字段，value 传入 true|false（或 1|-1）表示要返回还是不要返回。
       * 如果指定的字段是数组字段，还可以用以下方法只返回数组的第一个元素：在该字段 key 后面拼接上 `.$` 成为 `字段.$` 的形式。
       * 如果指定的字段是数组字段，还可以用 `db.command.project.slice` 方法返回数组的子数组：
       * 方法既可以接收一个正数表示返回前 n 个元素，也可以接收一个负数表示返回后 n 个元素；还可以接收一个包含两个数字 `[ skip, limit ]` 的数组，如果 `skip` 是正数，表示跳过 `skip` 个元素后再返回接下来的 `limit` 个元素，如果 `skip` 是负数，表示从倒数第 `skip` 个元素开始，返回往后数的 `limit` 个元素
       * 
       * - 返回数组的前 5 个元素：`{ tags: db.command.project.slice(5) }`
       * - 返回数组的后 5 个元素：`{ tags: db.command.project.slice(-5) }`
       * - 跳过前 5 个元素，返回接下来 10 个元素：`{ tags: db.command.project.slice(5, 10) }`
       * - 从倒数第 5 个元素开始，返回接下来正方向数的 10 个元素：`{ tags: db.command.project.slice(-5, 10) }`
       * @supported weapp
       * @example
       * 返回 description, done 和 progress 三个字段：
       * 
       * ```tsx
       * db.collection('todos').field({
       *   description: true,
       *   done: true,
       *   progress: true,
       *   // 只返回 tags 数组前 3 个元素
       *   tags: db.command.project.slice(3),
       * })
       *   .get()
       *   .then(console.log)
       *   .catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.field.html
       */
      field(object: General.IAnyObject): Query

      /** 获取集合数据，或获取根据查询条件筛选后的集合数据。
       * 
       * **使用说明**
       * 
       * 统计集合记录数或统计查询语句对应的结果记录数
       * 
       * 小程序端与云函数端的表现会有如下差异：
       * 
       * - 小程序端：如果没有指定 limit，则默认且最多取 20 条记录。
       * - 云函数端：如果没有指定 limit，则默认且最多取 100 条记录。
       * 
       * 如果没有指定 skip，则默认从第 0 条记录开始取，skip 常用于分页。
       * 
       * 如果需要取集合中所有的数据，仅在数据量不大且在云函数中时
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).get().then(res => {
       *   console.log(res.data)
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.get.html
       */
      get(options: OQ<Document.IGetDocumentOptions>): void
      get(options: RQ<Document.IGetDocumentOptions>): Promise<Query.IQueryResult>

      /** 统计匹配查询条件的记录的条数
       * @supported weapp
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).count().then(res => {
       *   console.log(res.total)
       * })
       * ```
       * @example
       * ```tsx
       * const db = Taro.cloud.database()
       * db.collection('todos').where({
       *   _openid: 'xxx' // 填入当前用户 openid
       * }).count({
       *   success: function(res) {
       *     console.log(res.total)
       *   },
       *   fail: console.error
       * })
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/collection/Collection.count.html
       */
      count(options: OQ<Document.ICountDocumentOptions>): void
      count(options: RQ<Document.ICountDocumentOptions>): Promise<Query.ICountResult>
    }

    namespace Query {
      interface IQueryCondition {
        [key: string]: any
      }
  
      type IStringQueryCondition = string
  
      interface IQueryResult extends General.CallbackResult {
        /** 查询的结果数组，数据的每个元素是一个 Object，代表一条记录 */
        data: Document.IDocumentData[]
        /** 调用结果 */
        errMsg: string
      }
  
      interface IQuerySingleResult extends General.CallbackResult {
        data: Document.IDocumentData
        /** 调用结果 */
        errMsg: string
      }

      interface IAddResult extends General.CallbackResult {
        _id: Document.DocumentId
        /** 调用结果 */
        errMsg: string
      }
  
      interface IUpdateResult extends General.CallbackResult {
        stats: {
          updated: number
          // created: number
        }
        /** 调用结果 */
        errMsg: string
      }
  
      interface ISetResult extends General.CallbackResult {
        _id: Document.DocumentId
        stats: {
          updated: number
          created: number
        }
        /** 调用结果 */
        errMsg: string
      }
  
      interface IRemoveResult extends General.CallbackResult {
        stats: {
          removed: number,
        }
        /** 调用结果 */
        errMsg: string
      }
  
      interface ICountResult extends General.CallbackResult {
        /** 结果数量 */
        total: number
        /** 调用结果 */
        errMsg: string
      }
    }

    /** 数据库操作符，通过 db.command 获取
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Command.html
     */
    interface Command {
      /** 查询筛选条件，表示字段等于某个值。eq 指令接受一个字面量 (literal)，可以是 number, boolean, string, object, array, Date。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.eq.html
       */
      eq(val: any): Command.DatabaseQueryCommand
      /** 查询筛选条件，表示字段不等于某个值。eq 指令接受一个字面量 (literal)，可以是 number, boolean, string, object, array, Date。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.neq.html
       */
      neq(val: any): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示需大于指定值。可以传入 Date 对象用于进行日期比较。
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gt.html
       */
      gt(val: any): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示需大于或等于指定值。可以传入 Date 对象用于进行日期比较。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gte.html
       */
      gte(val: any): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示需小于指定值。可以传入 Date 对象用于进行日期比较。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lt.html
       */
      lt(val: any): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示需小于或等于指定值。可以传入 Date 对象用于进行日期比较。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lte.html
       */
      lte(val: any): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示要求值在给定的数组内。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.in.html
       */
      in(val: any[]): Command.DatabaseQueryCommand
      /** 查询筛选操作符，表示要求值不在给定的数组内。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.nin.html
       */
      nin(val: any[]): Command.DatabaseQueryCommand

      /** 按从近到远的顺序，找出字段值在给定点的附近的记录。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoNear.html
       */
      geoNear(options: Command.NearCommandOptions): Command.DatabaseQueryCommand
      /** 找出字段值在指定区域内的记录，无排序。指定的区域必须是多边形（Polygon）或多边形集合（MultiPolygon）。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoWithin.html
       */
      geoWithin(options: Command.WithinCommandOptions): Command.DatabaseQueryCommand
      /** 找出给定的地理位置图形相交的记录
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoIntersects.html
       */
      geoIntersects(
          options: Command.IntersectsCommandOptions,
      ): Command.DatabaseQueryCommand

      /** 查询操作符，用于表示逻辑 "与" 的关系，表示需同时满足多个查询筛选条件
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.and.html
       */
      and(
        ...expressions: Array<Command.DatabaseLogicCommand | Query.IQueryCondition>
      ): Command.DatabaseLogicCommand
      /** 查询操作符，用于表示逻辑 "或" 的关系，表示需同时满足多个查询筛选条件。或指令有两种用法，一是可以进行字段值的 “或” 操作，二是也可以进行跨字段的 “或” 操作。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.or.html
       */
      or(
        ...expressions: Array<Command.DatabaseLogicCommand | Query.IQueryCondition>
      ): Command.DatabaseLogicCommand

      /** 查询操作符，用于表示逻辑 "与" 的关系，表示需同时满足多个查询筛选条件
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.set.html
       */
      set(val: any): Command.DatabaseUpdateCommand
      /** 更新操作符，用于表示删除某个字段。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.remove.html
       */
      remove(): Command.DatabaseUpdateCommand
      /** 更新操作符，原子操作，用于指示字段自增
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.inc.html
       */
      inc(val: number): Command.DatabaseUpdateCommand
      /** 更新操作符，原子操作，用于指示字段自乘某个值
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.mul.html
       */
      mul(val: number): Command.DatabaseUpdateCommand

      /** 数组更新操作符。对一个值为数组的字段，往数组添加一个或多个值。或字段原为空，则创建该字段并设数组为传入值。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.push.html
       */
      push(...values: any[]): Command.DatabaseUpdateCommand
      /** 数组更新操作符，对一个值为数组的字段，将数组尾部元素删除
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.pop.html
       */
      pop(): Command.DatabaseUpdateCommand
      /** 数组更新操作符，对一个值为数组的字段，将数组头部元素删除。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.shift.html
       */
      shift(): Command.DatabaseUpdateCommand
      /** 数组更新操作符，对一个值为数组的字段，往数组头部添加一个或多个值。或字段原为空，则创建该字段并设数组为传入值。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.unshift.html
       */
      unshift(...values: any[]): Command.DatabaseUpdateCommand
    }

    namespace Command {
      /** 数据库逻辑操作符 */
      interface DatabaseLogicCommand {
        /** 作用域名称 */
        fieldName: string | Database.InternalSymbol
        /** 操作符 */
        operator: keyof LOGIC_COMMANDS_LITERAL | string
        /** 操作数 */
        operands: any[]

        /** 设置作用域名称 */
        _setFieldName: (fieldName: string) => DatabaseLogicCommand

        /** 查询操作符，用于表示逻辑 "与" 的关系，表示需同时满足多个查询筛选条件
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.and.html
         */
        and(
          ...expressions: Array<DatabaseLogicCommand | Query.IQueryCondition>
        ): DatabaseLogicCommand
        /** 查询操作符，用于表示逻辑 "或" 的关系，表示需同时满足多个查询筛选条件。或指令有两种用法，一是可以进行字段值的 “或” 操作，二是也可以进行跨字段的 “或” 操作。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.or.html
         */
        or(
          ...expressions: Array<DatabaseLogicCommand | Query.IQueryCondition>
        ): DatabaseLogicCommand
      }
  
      /** 数据库查询操作符 */
      interface DatabaseQueryCommand extends DatabaseLogicCommand {
        /** 操作符 */
        operator: keyof QUERY_COMMANDS_LITERAL | string

        /** 设置作用域名称 */
        _setFieldName: (fieldName: string) => DatabaseQueryCommand
  
        /** 查询筛选条件，表示字段等于某个值。eq 指令接受一个字面量 (literal)，可以是 number, boolean, string, object, array, Date。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.eq.html
         */
        eq(val: any): DatabaseLogicCommand
        /** 查询筛选条件，表示字段不等于某个值。eq 指令接受一个字面量 (literal)，可以是 number, boolean, string, object, array, Date。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.neq.html
         */
        neq(val: any): DatabaseLogicCommand
        /** 查询筛选操作符，表示需大于指定值。可以传入 Date 对象用于进行日期比较。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gt.html
         */
        gt(val: any): DatabaseLogicCommand
        /** 查询筛选操作符，表示需大于或等于指定值。可以传入 Date 对象用于进行日期比较。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.gte.html
         */
        gte(val: any): DatabaseLogicCommand
        /** 查询筛选操作符，表示需小于指定值。可以传入 Date 对象用于进行日期比较。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lt.html
         */
        lt(val: any): DatabaseLogicCommand
        /** 查询筛选操作符，表示需小于或等于指定值。可以传入 Date 对象用于进行日期比较。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.lte.html
         */
        lte(val: any): DatabaseLogicCommand
        /** 查询筛选操作符，表示要求值在给定的数组内。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.in.html
         */
        in(val: any[]): DatabaseLogicCommand
        /** 查询筛选操作符，表示要求值不在给定的数组内。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.nin.html
         */
        nin(val: any[]): DatabaseLogicCommand

        /** 按从近到远的顺序，找出字段值在给定点的附近的记录。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoNear.html
         */
        geoNear(options: NearCommandOptions): DatabaseLogicCommand
        /** 找出字段值在指定区域内的记录，无排序。指定的区域必须是多边形（Polygon）或多边形集合（MultiPolygon）。
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoWithin.html
         */
        geoWithin(options: WithinCommandOptions): DatabaseLogicCommand
        /** 找出给定的地理位置图形相交的记录
         * @supported weapp
         * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/command/Command.geoIntersects.html
         */
        geoIntersects(
          options: IntersectsCommandOptions,
        ): DatabaseLogicCommand
      }

      /** 数据库更新操作符 */
      interface DatabaseUpdateCommand {
        /** 作用域名称 */
        fieldName: string | Database.InternalSymbol
        /** 操作符 */
        operator: keyof UPDATE_COMMANDS_LITERAL
        /** 操作数 */
        operands: any[]
  
        /** 设置作用域名称 */
        _setFieldName: (fieldName: string) => DatabaseUpdateCommand
      }

      /** 逻辑命令字面量 */
      interface LOGIC_COMMANDS_LITERAL {
        /** 与 */
        and
        /** 或 */
        or
        /** 非 */
        not
        /** 都不 */
        nor
      }

      /** 查询命令字面量 */
      interface QUERY_COMMANDS_LITERAL {
        // normal
        /** 等于 */
        eq
        /** 不等于 */
        neq
        /** 大于 */
        gt
        /** 大于等于 */
        gte
        /** 小于 */
        lt
        /** 小于等于 */
        lte
        /** 范围内 */
        in
        /** 范围外 */
        nin

        // geo
        /** 附近排序 */
        geoNear
        /** 指定区域内 */
        geoWithin
        /** 相交区域 */
        geoIntersects
      }

      /** 更新命令字面量 */
      interface UPDATE_COMMANDS_LITERAL {
        /** 等于 */
        set
        /** 删除 */
        remove
        /** 自增 */
        inc
        /** 自乘 */
        mul
        /** 尾部添加 */
        push
        /** 尾部删除 */
        pop
        /** 头部删除 */
        shift
        /** 头部添加 */
        unshift
      }
  
      /** 按从近到远的顺序，找出字段值在给定点的附近的记录参数 */
      interface NearCommandOptions {
        /** 地理位置点 (Point) */
        geometry: IGeo.GeoPoint
        /** 最大距离，单位为米 */
        maxDistance?: number
        /** 最小距离，单位为米 */
        minDistance?: number
      }
  
      /** 找出字段值在指定区域内的记录，无排序参数 */
      interface WithinCommandOptions {
        /** 地理信息结构，Polygon，MultiPolygon，或 { centerSphere } */
        geometry: IGeo.GeoPolygon | IGeo.GeoMultiPolygon
      }
  
      /** 找出给定的地理位置图形相交的记录 */
      interface IntersectsCommandOptions {
        /** 地理信息结构 */
        geometry:
          | IGeo.GeoPoint
          | IGeo.GeoMultiPoint
          | IGeo.GeoLineString
          | IGeo.GeoMultiLineString
          | IGeo.GeoPolygon
          | IGeo.GeoMultiPolygon
      }
    }

    /** 数据库集合的聚合操作实例
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.html
     */
    interface Aggregate {
      /** 聚合阶段。添加新字段到输出的记录。经过 addFields 聚合阶段，输出的所有记录中除了输入时带有的字段外，还将带有 addFields 指定的字段。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.addFields.html
       */
      addFields(object: Object): Aggregate

      /** 聚合阶段。将输入记录根据给定的条件和边界划分成不同的组，每组即一个 bucket。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.bucket.html
       */
      bucket(object: Object): Aggregate

      /** 聚合阶段。将输入记录根据给定的条件划分成不同的组，每组即一个 bucket。与 bucket 的其中一个不同之处在于无需指定 boundaries，bucketAuto 会自动尝试将记录尽可能平均的分散到每组中。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.bucketAuto.html
       */
      bucketAuto(object: Object): Aggregate

      /** 聚合阶段。计算上一聚合阶段输入到本阶段的记录数，输出一个记录，其中指定字段的值为记录数。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.count.html
       */
      count(fieldName: string): Aggregate

      /** 标志聚合操作定义完成，发起实际聚合操作
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.end.html
       */
      end(): Promise<Object>

      /** 聚合阶段。将记录按照离给定点从近到远输出。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.geoNear.html
       */
      geoNear(options: Object): Aggregate

      /** 聚合阶段。将输入记录按给定表达式分组，输出时每个记录代表一个分组，每个记录的 _id 是区分不同组的 key。输出记录中也可以包括累计值，将输出字段设为累计值即会从该分组中计算累计值。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.group.html
       */
      group(object: Object): Aggregate

      /** 聚合阶段。限制输出到下一阶段的记录数。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.limit.html
       */
      limit(value: number): Aggregate

      /** 聚合阶段。聚合阶段。联表查询。与同个数据库下的一个指定的集合做 left outer join(左外连接)。对该阶段的每一个输入记录，lookup 会在该记录中增加一个数组字段，该数组是被联表中满足匹配条件的记录列表。lookup 会将连接后的结果输出给下个阶段。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.lookup.html
       */
      lookup(object: Object): Aggregate

      /** 聚合阶段。根据条件过滤文档，并且把符合条件的文档传递给下一个流水线阶段。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.match.html
       */
      match(object: Object): Aggregate
      
      /** 聚合阶段。把指定的字段传递给下一个流水线，指定的字段可以是某个已经存在的字段，也可以是计算出来的新字段。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.project.html
       */
      project(object: Object): Aggregate

      /** 聚合阶段。指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.replaceRoot.html
       */
      replaceRoot(object: Object): Aggregate

      /** 聚合阶段。随机从文档中选取指定数量的记录。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sample.html
       */
      sample(size: number): Aggregate

      /** 聚合阶段。指定一个正整数，跳过对应数量的文档，输出剩下的文档。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.skip.html
       */
      skip(value: number): Aggregate

      /** 聚合阶段。根据指定的字段，对输入的文档进行排序。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sort.html
       */
      sort(object: Object): Aggregate

      /** 聚合阶段。根据传入的表达式，将传入的集合进行分组（group）。然后计算不同组的数量，并且将这些组按照它们的数量进行排序，返回排序后的结果。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.sortByCount.html
       */
      sortByCount(object: Object): Aggregate

      /** 聚合阶段。使用指定的数组字段中的每个元素，对文档进行拆分。拆分后，文档会从一个变为一个或多个，分别对应数组的每个元素。
       * @supported weapp
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/aggregate/Aggregate.unwind.html
       */
      unwind(value: string|object): Aggregate
    }

    /** 数据库地理位置结构集
     * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/Geo.html
     */
    interface IGeo {
      /** 构造一个地理位置 ”点“。方法接受两个必填参数，第一个是经度（longitude），第二个是纬度（latitude），务必注意顺序。
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: db.Geo.Point(113, 23)
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造一个点外，也可以使用等价的 GeoJSON 的 点 (Point) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "Point",
       *   "coordinates": [longitude, latitude] // 数字数组：[经度, 纬度]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'Point',
       *       coordinates: [113, 23]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.Point.html
       */
      Point(longitude: number, latitide: number): IGeo.GeoPoint
      // Point(geojson: IGeo.JSONPoint): IGeo.GeoPoint

      /** 构造一个地理位置的 ”线“。一个线由两个或更多的点有序连接组成。
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: db.Geo.LineString([
       *       db.Geo.Point(113, 23),
       *       db.Geo.Point(120, 50),
       *       // ... 可选更多点
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造一条 LineString 外，也可以使用等价的 GeoJSON 的 线 (LineString) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "LineString",
       *   "coordinates": [
       *     [p1_lng, p1_lat],
       *     [p2_lng, p2_lng]
       *     // ... 可选更多点
       *   ]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'LineString',
       *       coordinates: [
       *         [113, 23],
       *         [120, 50]
       *       ]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.LineString.html
       */
      LineString(points: IGeo.GeoPoint[] | IGeo.JSONMultiPoint): IGeo.GeoMultiPoint

      /** 构造一个地理位置 ”多边形“
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * 
       * **说明**
       * 
       * 一个多边形由一个或多个线性环（Linear Ring）组成，一个线性环即一个闭合的线段。一个闭合线段至少由四个点组成，其中最后一个点和第一个点的坐标必须相同，以此表示环的起点和终点。如果一个多边形由多个线性环组成，则第一个线性环表示外环（外边界），接下来的所有线性环表示内环（即外环中的洞，不计在此多边形中的区域）。如果一个多边形只有一个线性环组成，则这个环就是外环。
       * 
       * 多边形构造规则：
       * 
       * 1. 第一个线性环必须是外环
       * 2. 外环不能自交
       * 3. 所有内环必须完全在外环内
       * 4. 各个内环间不能相交或重叠，也不能有共同的边
       * 5. 外环应为逆时针，内环应为顺时针
       * @supported weapp
       * @example
       * 单环多边形
       * 
       * ```tsx
       * const { Polygon, LineString, Point } = db.Geo
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: Polygon([
       *       LineString([
       *         Point(0, 0),
       *         Point(3, 2),
       *         Point(2, 3),
       *         Point(0, 0)
       *       ])
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 含一个外环和一个内环的多边形
       * 
       * ```tsx
       * const { Polygon, LineString, Point } = db.Geo
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: Polygon([
       *       // 外环
       *       LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
       *       // 内环
       *       LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造一个 Polygon 外，也可以使用等价的 GeoJSON 的 多边形 (Polygon) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "Polygon",
       *   "coordinates": [
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // 外环
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // 可选内环 1
       *     ...
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ], // 可选内环 n
       *   ]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'Polygon',
       *       coordinates: [
       *         [ [0, 0], [30, 20], [20, 30], [0, 0] ],
       *         [ [10, 10], [16, 14], [14, 16], [10, 10]]
       *       ]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.Polygon.html
       */
      Polygon(lineStrings: IGeo.GeoLineString[] | IGeo.JSONPolygon): IGeo.GeoPolygon

      /** 构造一个地理位置的 ”点“ 的集合。一个点集合由一个或更多的点组成。
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * @supported weapp
       * @example
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: db.Geo.MultiPoint([
       *       db.Geo.Point(113, 23),
       *       db.Geo.Point(120, 50),
       *       // ... 可选更多点
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造 MultiPoint 外，也可以使用等价的 GeoJSON 的 点集合 (MultiPoint) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "MultiPoint",
       *   "coordinates": [
       *     [p1_lng, p1_lat],
       *     [p2_lng, p2_lng]
       *     // ... 可选更多点
       *   ]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'MultiPoint',
       *       coordinates: [
       *         [113, 23],
       *         [120, 50]
       *       ]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiPoint.html
       */
      MultiPoint(polygons: IGeo.GeoPolygon[] | IGeo.JSONMultiPolygon): IGeo.GeoMultiPolygon

      /** 构造一个地理位置 ”线“ 集合。一个线集合由多条线组成。
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * @supported weapp
       * @example
       * ```tsx
       * const { LineString, MultiLineString, Point } = db.Geo
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: MultiLineString([
       *       LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
       *       LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造一个 MultiLineString 外，也可以使用等价的 GeoJSON 的 线集合 (MultiLineString) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "MultiLineString",
       *   "coordinates": [
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *     ...
       *     [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
       *   ]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'MultiLineString',
       *       coordinates: [
       *         [ [0, 0], [3, 3] ],
       *         [ [5, 10], [20, 30] ]
       *       ]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiLineString.html
       */
      MultiLineString(
        lineStrings: IGeo.GeoLineString[] | IGeo.JSONMultiLineString,
      ): IGeo.GeoMultiLineString

      /** 构造一个地理位置 ”多边形“ 集合。一个多边形集合由多个多边形组成。
       * 
       * 如存储地理位置信息的字段有被查询的需求，务必对字段建立地理位置索引
       * 
       * **说明**
       * 
       * 一个多边形由一个或多个线性环（Linear Ring）组成，一个线性环即一个闭合的线段。一个闭合线段至少由四个点组成，其中最后一个点和第一个点的坐标必须相同，以此表示环的起点和终点。如果一个多边形由多个线性环组成，则第一个线性环表示外环（外边界），接下来的所有线性环表示内环（即外环中的洞，不计在此多边形中的区域）。如果一个多边形只有一个线性环组成，则这个环就是外环。
       * 
       * 多边形构造规则：
       * 
       * 1. 第一个线性环必须是外环
       * 2. 外环不能自交
       * 3. 所有内环必须完全在外环内
       * 4. 各个内环间不能相交或重叠，也不能有共同的边
       * 5. 外环应为逆时针，内环应为顺时针
       * @supported weapp
       * @example
       * ```tsx
       * const { MultiPolygon, Polygon, LineString, Point } = db.Geo
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: MultiPolygon([
       *       Polygon([
       *         LineString([ Point(50, 50), Point(60, 80), Point(80, 60), Point(50, 50) ]),
       *       ]),
       *       Polygon([
       *         LineString([ Point(0, 0), Point(30, 20), Point(20, 30), Point(0, 0) ]),
       *         LineString([ Point(10, 10), Point(16, 14), Point(14, 16), Point(10, 10) ])
       *       ]),
       *     ])
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @example
       * 除了使用接口构造一个 MultiPolygon 外，也可以使用等价的 GeoJSON 的 多边形 (MultiPolygon) 的 JSON 表示，其格式如下：
       * 
       * ```json
       * {
       *   "type": "MultiPolygon",
       *   "coordinates": [
       *     // polygon 1
       *     [
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *       ...
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
       *     ],
       *     ...
       *     // polygon n
       *     [
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ],
       *       ...
       *       [ [lng, lat], [lng, lat], [lng, lat], ..., [lng, lat] ]
       *     ],
       *   ]
       * }
       * ```
       * 
       * ```tsx
       * db.collection('todos').add({
       *   data: {
       *     description: 'eat an apple',
       *     location: {
       *       type: 'MultiPolygon',
       *       coordinates: [
       *         [
       *           [ [50, 50], [60, 80], [80, 60], [50, 50] ]
       *         ],
       *         [
       *           [ [0, 0], [30, 20], [20, 30], [0, 0] ],
       *           [ [10, 10], [16, 14], [14, 16], [10, 10]]
       *         ]
       *       ]
       *     }
       *   }
       * }).then(console.log).catch(console.error)
       * ```
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/Geo.MultiPolygon.html
       */
      MultiPolygon(polygons: IGeo.GeoPolygon[] | IGeo.JSONMultiPolygon): IGeo.GeoMultiPolygon
    }

    namespace IGeo {
      /** 地理位置 “点”
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoPoint.html
       */
      interface GeoPoint {
        /** 经度 */
        longitude: number
        /** 纬度 */
        latitude: number
  
        /** 格式化为 JSON 结构 */
        toJSON(): object
        /** 格式化为字符串 */
        toString(): string
      }
  
      /** 地理位置的 ”线“。一个线由两个或更多的点有序连接组成。
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoLineString.html
       */
      interface GeoLineString {
        /** 点集合 */
        points: GeoPoint[]
  
        /** 格式化为 JSON 结构 */
        toJSON(): JSONLineString
        /** 格式化为字符串 */
        toString(): string
      }
  
      /** 地理位置 ”多边形“
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoPolygon.html
       */
      interface GeoPolygon {
        /** 线集合 */
        lines: GeoLineString[]
  
        /** 格式化为 JSON 结构 */
        toJSON(): JSONPolygon
        /** 格式化为字符串 */
        toString(): string
      }

      /** 地理位置的 ”点“ 的集合。一个点集合由一个或更多的点组成。
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiPoint.html
       */
      interface GeoMultiPoint {
        /** 点集合 */
        points: GeoPoint[]
  
        /** 格式化为 JSON 结构 */
        toJSON(): JSONMultiPoint
        /** 格式化为字符串 */
        toString(): string
      }
  
      /** 地理位置 ”线“ 集合。一个线集合由多条线组成。
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiLineString.html
       */
      interface GeoMultiLineString {
        /** 线集合 */
        lines: GeoLineString[]
  
        /** 格式化为 JSON 结构 */
        toJSON(): JSONMultiLineString
        /** 格式化为字符串 */
        toString(): string
      }
  
      /** 地理位置 ”多边形“ 集合。一个多边形集合由多个多边形组成。
       * @see https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-sdk-api/database/geo/GeoMultiPolygon.html
       */
      interface GeoMultiPolygon {
        /** 多边形集合 */
        polygons: GeoPolygon[]
  
        /** 格式化为 JSON 结构 */
        toJSON(): JSONMultiPolygon
        /** 格式化为字符串 */
        toString(): string
      }

      /** 地理位置 “点” 的 JSON 结构 */
      interface JSONPoint {
        /** 类型  */
        type: 'Point'
        /** 坐标 */
        coordinates: [number, number]
      }
  
      /** 地理位置 ”线“ 的 JSON 结构 */
      interface JSONLineString {
        /** 类型  */
        type: 'LineString'
        /** 坐标 */
        coordinates: Array<[number, number]>
      }
  
      /** 地理位置 ”多边形“ 的 JSON 结构 */
      interface JSONPolygon {
        /** 类型  */
        type: 'Polygon'
        /** 坐标 */
        coordinates: Array<Array<[number, number]>>
      }
  
      /** 地理位置的 ”点“ 集合的 JSON 结构 */
      interface JSONMultiPoint {
        /** 类型  */
        type: 'MultiPoint'
        /** 坐标 */
        coordinates: Array<[number, number]>
      }
  
      /** 地理位置 ”线“ 集合的 JSON 结构 */
      interface JSONMultiLineString {
        /** 类型  */
        type: 'MultiLineString'
        /** 坐标 */
        coordinates: Array<Array<[number, number]>>
      }
  
      /** 地理位置 ”多边形“ 集合的 JSON 结构 */
      interface JSONMultiPolygon {
        /** 类型  */
        type: 'MultiPolygon'
        /** 坐标 */
        coordinates: Array<Array<Array<[number, number]>>>
      }
    }
  }
}

type Optional<T> = { [K in keyof T]+?: T[K] }

type OQ<
  T extends Optional<
    Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
  >
> =
  | (RQ<T> & Required<Pick<T, 'success'>>)
  | (RQ<T> & Required<Pick<T, 'fail'>>)
  | (RQ<T> & Required<Pick<T, 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'success' | 'fail'>>)
  | (RQ<T> & Required<Pick<T, 'success' | 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'fail' | 'complete'>>)
  | (RQ<T> & Required<Pick<T, 'fail' | 'complete' | 'success'>>)

type RQ<
  T extends Optional<
    Record<'complete' | 'success' | 'fail', (...args: any[]) => any>
  >
> = Pick<T, Exclude<keyof T, 'complete' | 'success' | 'fail'>>