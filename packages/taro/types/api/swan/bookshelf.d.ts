import Taro from '../../index'

declare module '../../index' {
  namespace insertBookshelf {
    interface Option {
      /** 添加的内容分类 */
      category: keyof Category | string
      /** 要添加到书架内容的 id，支持传多个，最多 100 条；注释：contentId 为内容 id，内容的唯一标识，自定义，最长 22 字符（不能含有空格、中文字符） */
      contentIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface Category {
      /** 专栏模板 */
      article
      /** 文档模板 */
      doc
      /** 动漫模板 */
      cartoon
      /** 影音模板 */
      av
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 添加到书架的结果列表 */
      list: IListItem[]
    }
    interface IListItem {
      /** 内容的唯一标识 */
      contentId: string
      /** 添加状态：值为 0 时是失败，为 1 时是成功 */
      status: keyof Status
      /** 添加信息 */
      msg: string
    }
    interface Status {
      /** 失败 */
      0
      /** 成功 */
      1
    }
  }

  namespace deleteBookshelf {
    interface Option {
      /** 要删除的内容分类 */
      category: keyof Category | string
      /** 要删除书架内容的 id，支持传多个，最多 100 条；注释：contentId 为内容 id，内容的唯一标识，自定义，最长 22 字符（不能含有空格、中文字符）。支持批量删除的同一个 category 下的多个 id，不同 category 下的 id 请分别调用该接口删除 */
      contentIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface Category {
      /** 专栏模板 */
      article
      /** 文档模板 */
      doc
      /** 动漫模板 */
      cartoon
      /** 影音模板 */
      av
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 添加到书架的结果列表 */
      list: IListItem[]
    }
    interface IListItem {
      /** 内容的唯一标识 */
      contentId: string
      /** 删除状态：值为 0 时是失败，为 1 时是成功 */
      status: keyof Status
      /** 删除信息 */
      msg: string
    }
    interface Status {
      /** 失败 */
      0
      /** 成功 */
      1
    }
  }

  namespace queryBookshelf {
    interface Option {
      /** 要查询内容的 id，支持传多个，最多 100 条；注释：contentId 为内容 id，内容的唯一标识，自定义，最长 22 字符（不能含有空格、中文字符） */
      contentIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 查询的内容结果列表 */
      list: IListItem[]
    }
    interface IListItem {
      /** 内容的唯一标识 */
      contentId: string
      /** 状态 */
      status: keyof Status
    }
    interface Status {
      /** 不存在 */
      0
      /** 存在 */
      1
    }
  }

  namespace updateBookshelfReadTime {
    interface Option {
      /** 添加的内容分类 */
      category: keyof Category | string
      /** 要更新内容的 id；注释：contentId 为内容 id，内容的唯一标识，自定义，最长 22 字符（不能含有空格、中文字符） */
      contentIds: string[]
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: SuccessCallbackResult) => void
    }
    interface Category {
      /** 专栏模板 */
      article
      /** 文档模板 */
      doc
      /** 动漫模板 */
      cartoon
      /** 影音模板 */
      av
    }
    interface SuccessCallbackResult extends TaroGeneral.CallbackResult {
      /** 更新状态 */
      status: keyof Status
      /** 更新的结果信息 */
      msg: string
    }
    interface Status {
      /** 失败 */
      0
      /** 成功 */
      1
    }
  }

  namespace navigateToBookshelf {
    interface Option {
      /** 跳转到指定的内容分类
       * @supported swan
       */
      category: keyof Category | string
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用失败的回调函数 */
      fail?: (res: TaroGeneral.CallbackResult) => void
      /** 接口调用成功的回调函数 */
      success?: (res: TaroGeneral.CallbackResult) => void
    }
    interface Category {
      /** 专栏模板 */
      article
      /** 文档模板 */
      doc
      /** 动漫模板 */
      cartoon
      /** 影音模板 */
      av
    }
  }

  interface TaroStatic {
    /** 添加内容到宿主书架
     * @supported swan, qq
     * @swan （需宿主支持书架入口）
     * @example
     * ```tsx
     * Taro.insertBookshelf({
     *   category: 'doc',
     *   contentIds: ['test1', 'test2'],
     *   success(res) {
     *     Taro.showModal({
     *       title: 'success',
     *       content: JSON.stringify(res)
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-insertBookshelf/
     */
    insertBookshelf(option: insertBookshelf.Option): void

    /** 删除书架中的内容（需宿主支持书架入口)
     * @supported swan
     * @example
     * ```tsx
     * Taro.deleteBookshelf({
     *   category: 'doc',
     *   contentIds: ['test1', 'test2'],
     *   success(res) {
     *     Taro.showModal({
     *       title: 'success',
     *       content: JSON.stringify(res)
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * ```
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-deleteBookshelf/
     */
    deleteBookshelf(option: deleteBookshelf.Option): void

    /** 查询宿主书架的相关内容
     * @supported swan, qq
     * @swan （需宿主支持书架入口）
     * @example
     * ```tsx
     * Taro.queryBookshelf({
     *   contentIds: ['test1', 'test2'],
     *   success(res) {
     *     Taro.showModal({
     *       title: 'success',
     *       content: JSON.stringify(res)
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * ```
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-queryBookshelf/
     */
    queryBookshelf(option: queryBookshelf.Option): void

    /** 更新已加入宿主书架的内容的阅读时间
     * @supported swan, qq
     * @swan （需宿主支持书架入口）
     * @example
     * ```tsx
     * Taro.updateBookshelfReadTime({
     *   category: 'doc',
     *   contentIds: 'test1',
     *   success(res) {
     *     Taro.showModal({
     *       title: 'success',
     *       content: JSON.stringify(res)
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-queryBookshelf/
     */
    updateBookshelfReadTime(option: updateBookshelfReadTime.Option): void

    /** 跳转到宿主书架
     * @supported swan
     * @swan （需宿主支持书架入口）
     * @example
     * ```tsx
     * Taro.navigateToBookshelf({
     *   category: 'article',
     *   contentIds: 'test1',
     *   success(res) {
     *     Taro.showModal({
     *       title: 'navigateToBookshelf',
     *       content: 'success'
     *     })
     *   },
     *   fail(err) {
     *     Taro.showModal({
     *       title: 'fail',
     *       content: JSON.stringify(err)
     *     })
     *   }
     * })
     * @see https://smartprogram.baidu.com/docs/develop/api/open/swan-navigateToBookshelf/
     */
    navigateToBookshelf(option: navigateToBookshelf.Option): void
  }
}
