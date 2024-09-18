import Taro from '../../index'

declare module '../../index' {
  interface CacheManager {
    /** 当前缓存模式 */
    mode: keyof CacheManager.Mode
    /** 全局 origin */
    origin: string
    /** 全局缓存有效时间 */
    maxAge: number
    /** 当前缓存管理器状态 */
    state: keyof CacheManager.State
    /** 添加规则
     * @supported weapp
     * @example
     * ```tsx
     * const ruleId = cacheManager.addRule({
     *   id: 'haha-rule',
     *   method: 'GET',
     *   url: '/haha',
     *   maxAge: 123455,
     *   dataSchema: [
     *     // data 字段的匹配，默认为空，表示不匹配
     *     // 类型可以是：string、number、boolean、null、object、any（表示任意类型均可），以及这些类型的数组表示方式
     *     {name: 'aaa', schema: {type: 'string'}}, // 类型为 string
     *     {name: 'bbb', schema: [{type: 'number'}, {type: 'string'}]}, // 类型为 number, string
     *     {name: 'ccc', schema: {type: 'string', value: 'abc'}}, // 值为 abc
     *     {name: 'ddd', schema: {type: 'string', value: /(abc|cba)/ig}}, // 值符合该正则匹配，如果该值不是字符串类型，则会被尝试转成字符串后再进行比较
     *     {name: 'ddd', schema: {type: 'string', value: val => val === '123'}}, // 传入函数来校验值
     *     {name: 'eee', schema: {type: 'object', value: [{ // 类型为对象，则通过嵌套的方式来逐层校验
     *       name: 'aaa', schema: {type: 'string'},
     *       // ...
     *       // 嵌套 dataSchema，同上面的方式一样来匹配嵌套的对象
     *     }]}},
     *     {name: 'fff', schema: {type: 'string[]'}}, // 类型为 string 数组
     *     {name: 'ggg', schema: {type: 'any'}}, // 类型为任意类型
     *     {name: 'hhh', schema: {type: 'any[]'}}, // 类型为任意类型的数组
     *   ]
     * })
     * ```
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.addRule.html
     */
    addRule(option: CacheManager.AddRuleOption): string
    /** 批量添加规则
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.addRules.html
     */
    addRules(option: CacheManager.AddRulesOption): string[]
    /** 清空所有缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.clearCaches.html
     */
    clearCaches(): void
    /** 清空所有规则，同时会删除对应规则下所有缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.clearRules.html
     */
    clearRules(): void
    /** 删除缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.deleteCache.html
     */
    deleteCache(
      /** 缓存 id */
      id: string
    ): void
    /** 批量删除缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.deleteCaches.html
     */
    deleteCaches(
      /** 缓存 id 列表 */
      ids: string[]
    ): void
    /** 删除规则，同时会删除对应规则下所有缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.deleteRule.html
     */
    deleteRule(
      /** 规则 id */
      id: string
    ): void
    /** 批量删除规则，同时会删除对应规则下所有缓存
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.deleteRules.html
     */
    deleteRules(
      /** 规则 id 列表 */
      ids: string[]
    ): void
    /** 匹配命中的缓存规则，一般需要和 request 事件搭配使用
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.match.html
     */
    match(option: CacheManager.MatchOption): CacheManager.MatchResult
    /** 取消事件监听
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.off.html
     */
    off(
      /** 事件名称 */
      eventName: string,
      /** 事件监听函数 */
      handler: TaroGeneral.EventCallback
    ): void
    /** 监听事件
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.on.html
     */
    on(
      /** 事件名称 */
      eventName: keyof CacheManager.OnEventName,
      /** 事件监听函数 */
      handler: TaroGeneral.EventCallback
    ): void
    /** 开启缓存，仅在 mode 为 none 时生效，调用后缓存管理器的 state 会置为 1
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.start.html
     */
    start(): void
    /** 关闭缓存，仅在 mode 为 none 时生效，调用后缓存管理器的 state 会置为 0
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/CacheManager.stop.html
     */
    stop(): void
  }

  namespace CacheManager {
    interface Mode {
      /** 默认值，弱网/离线使用缓存返回 */
      weakNetwork
      /** 总是使用缓存返回 */
      always
      /** 不开启，后续可手动开启/停止使用缓存返回	*/
      none
    }
    interface State {
      /** 不使用缓存返回 */
      0
      /** 使用缓存返回 */
      1
      /** 未知 */
      2
    }
    interface DataSchema {
      /** 需要匹配的 data 对象的参数类型
       * string、number、boolean、null、object、any（表示任意类型），
       * 同时支持数组模式（数组模式则在类型后面加 []，如 string[] 表示字符串数组）
       */
      type: string
      /** 需要匹配的 data 对象的参数值
       * 当 type 为基本类型时，可以用 string/regexp 来匹配固定的值，
       * 也可以通过 function 来确定值是否匹配，
       * 如果传入的 type 是 object，那么表示需要嵌套匹配值是否正确，可以传入 Array
       */
      value?: string | RegExp | Function | DataRule[]
    }
    interface DataRule {
      /** 需要匹配的参数名 */
      name: string
      schema: DataSchema | DataSchema[]
    }
    interface RuleObject {
      /** 规则 id，如果不填则会由基础库生成  */
      id: string
      /** 请求方法，可选值 GET/POST/PATCH/PUT/DELETE，如果为空则表示前面提到的所有方法都能被匹配到  */
      method: string
      /** uri 匹配规则，可参考规则字符串写法和正则写法 */
      url: any
      /**
       * 缓存有效时间，单位为 ms，不填则默认取缓存管理器全局的缓存有效时间
       * @default 7 * 24 * 60 * 60 * 1000
       */
      maxAge: number
      /**
       * 匹配请求参数
       */
      dataSchema: DataRule[]
    }

    type Rule = string | RegExp | RuleObject

    interface AddRuleOption {
      /** 规则 */
      rule: Rule
    }
    interface AddRulesOption {
      /** 规则列表 */
      rules: Rule[]
    }
    interface MatchOption {
      /** request 事件对象  */
      evt: any
    }
    interface MatchResult {
      /** 命中的规则id */
      ruleId: string
      /** 缓存id */
      cacheId: string
      /** 缓存内容，会带有 fromCache 标记，方便开发者区分内容是否来自缓存 */
      data: any
      /** 缓存创建时间 */
      createTime: number
      /** 缓存有效时间 */
      maxAge: number
    }
    interface OnEventName {
      /** 发生 wx.request 请求，只在缓存管理器开启阶段会触发 */
      request
      /** 进入弱网/离线状态 */
      enterWeakNetwork
      /** 离开弱网/离线状态	 */
      exitWeakNetwork
    }
  }

  namespace createCacheManager {
    interface Mode {
      /** 弱网/离线使用缓存返回 */
      weakNetwork
      /** 总是使用缓存返回 */
      always
      /** 不开启，后续可手动开启/停止使用缓存返回 */
      none
    }
    interface Extra {
      /** 需要缓存的 wx api 接口，不传则表示支持缓存的接口全都做缓存处理。返回的如果是缓存数据，开发者可通过 fromCache 标记区分 */
      apiList?: string[]
    }
    interface Option {
      /** 全局 origin */
      origin?: string
      /** 缓存模式 */
      mode?: keyof Mode
      /** 全局缓存有效时间，单位为毫秒，默认为 7 天，最长不超过 30 天  */
      maxAge?: number
      /** 额外的缓存处理 */
      extra?: Extra
    }
  }

  interface TaroStatic {
    /** 创建缓存管理器
     * @supported weapp
     * @see https://developers.weixin.qq.com/miniprogram/dev/api/storage/cachemanager/wx.createCacheManager.html
     */
    createCacheManager(option: createCacheManager.Option): CacheManager
  }
}
