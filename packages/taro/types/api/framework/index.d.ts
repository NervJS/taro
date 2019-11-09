declare namespace Taro {
  interface Page {
    /**
     * 当前页面的路径
     */
    route: string

    [k: string]: any
  }
  function getCurrentPages(): Page[]
  function getApp(): any
}
