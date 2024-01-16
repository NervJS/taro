
import { navigateBack,reLaunch } from '../api'
import { loadNavigationBarStyle } from '../style'

import type PageHandler from './page'

export default class NavigationBarHandler {
  pageContext: PageHandler
  navigationBarElement: Element
  constructor (pageContext: PageHandler){
    this.pageContext = pageContext
    loadNavigationBarStyle()
  }

  private toHomeFn () {
    reLaunch({ url: this.pageContext.homePage })
  }

  private backFn () {
    navigateBack()
  }

  get fnElement (){
    if(!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByTagName('taro-navigation-bar-fn')?.[0]
  }

  get titleElement (){
    if(!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByTagName('taro-navigation-bar-title')?.[0]
  }

  setNavigationBarElement (pageEl: HTMLElement){
    this.navigationBarElement = pageEl.getElementsByTagName('taro-navigation-bar-wrap')?.[0]
  }

  load (pageEl: HTMLElement| null, methodName: string) {
    if(!pageEl) return
    let shouldShow =  this.pageContext.config.window?.showNavigationBar
    if (typeof this.pageContext.pageConfig?.showNavigationBar === 'boolean'){
      shouldShow = this.pageContext.pageConfig.showNavigationBar
    }
    this.setNavigationBarElement(pageEl)
    this.setNavigationBarVisible(!!shouldShow)
    if(this.titleElement){
      this.titleElement.innerHTML = this.pageContext.pageConfig?.navigationBarTitleText ?? document.title
    }
    const currentRouter = this.pageContext.currentPage
    const isFirstLoad = ['reLaunch', ''].includes(methodName)
    if (isFirstLoad) {
      if (currentRouter === this.pageContext.homePage) {
        this.fnBtnToggleToNone()
      } else {
        this.fnBtnToggleToHome()
      } 
    } else {
      if (this.pageContext.isTabBar(currentRouter)) {
        this.fnBtnToggleToNone()
      } else {
        this.fnBtnToggleToBack()
      }
    }
  }

  fnBtnToggleToHome (){
    if(!this.fnElement) return
    this.fnElement.classList.add('taro-navigation-bar-home')
    this.fnElement.classList.remove('taro-navigation-bar-back')
    this.fnElement.addEventListener('click', this.toHomeFn.bind(this))
  }

  fnBtnToggleToBack (){
    if(!this.fnElement) return
    this.fnElement.classList.remove('taro-navigation-bar-home')
    this.fnElement.classList.add('taro-navigation-bar-back')
    this.fnElement.addEventListener('click', this.backFn.bind(this))
  }

  fnBtnToggleToNone (){
    if(!this.fnElement) return
    this.fnElement.classList.remove('taro-navigation-bar-home')
    this.fnElement.classList.remove('taro-navigation-bar-back')
    this.fnElement.removeEventListener('click', this.toHomeFn)
    this.fnElement.removeEventListener('click', this.backFn)
  }

  setNavigationBarVisible (show:boolean){
    if(show) {
      this.navigationBarElement.classList.add('taro-navigation-bar-show')
      this.navigationBarElement.classList.remove('taro-navigation-bar-hide')
    } else {
      this.navigationBarElement.classList.add('taro-navigation-bar-hide')
      this.navigationBarElement.classList.remove('taro-navigation-bar-show')
    }
    if(this.titleElement){
      this.titleElement.innerHTML = this.pageContext.pageConfig?.navigationBarTitleText ?? document.title
    }
  }
}