
import { navigateBack,reLaunch } from '../api'
import { loadNavigationBarStyle } from '../style'

import type PageHandler from './page'

export default class NavigationBarHandler {
  pageContext: PageHandler
  navigationBarElement: Element
  constructor (pageContext: PageHandler){
    this.pageContext = pageContext
    this.init()
    loadNavigationBarStyle()
  }

  private toHomeFn () {
    reLaunch({ url: this.pageContext.homePage })
  }

  private backFn () {
    navigateBack()
  }

  get homeBtnElement (){
    if(!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByTagName('taro-navigation-bar-home')?.[0]
  }

  get backBtnElement (){
    if(!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByTagName('taro-navigation-bar-back')?.[0]
  }


  get titleElement (){
    if(!this.navigationBarElement) return null
    return this.navigationBarElement.getElementsByTagName('taro-navigation-bar-title')?.[0]
  }

  init () {
    this.setNavigationBarElement()
    if(!this.navigationBarElement) return
    this.homeBtnElement?.addEventListener('click', this.toHomeFn.bind(this))
    this.backBtnElement?.addEventListener('click', this.backFn.bind(this))
  }

  setNavigationBarElement (){
    this.navigationBarElement = document.getElementsByTagName('taro-navigation-bar-wrap')?.[0]
  }

  load ( methodName: string) {
    let shouldShow =  this.pageContext.config.window?.showNavigationBar
    if (typeof this.pageContext.pageConfig?.showNavigationBar === 'boolean'){
      shouldShow = this.pageContext.pageConfig.showNavigationBar
    }
    this.setNavigationBarVisible(!!shouldShow)
    if(this.titleElement){
      this.titleElement.innerHTML = this.pageContext.pageConfig?.navigationBarTitleText ?? document.title
    }
    const currentRouter = this.pageContext.currentPage
    const isFirstLoad = ['reLaunch', ''].includes(methodName)
    this.fnBtnToggleToNone()
    if (isFirstLoad) {
      if (currentRouter === this.pageContext.homePage) {
        this.fnBtnToggleToNone()
      } else {
        this.fnBtnToggleToHome()
      } 
    } else {
      if (this.pageContext.isTabBar(currentRouter) || this.pageContext.homePage === currentRouter) {
        this.fnBtnToggleToNone()
      } else {
        this.fnBtnToggleToBack()
      }
    }
  }

  fnBtnToggleToHome (){
    if(!this.navigationBarElement) return
    this.navigationBarElement.classList.add('taro-navigation-bar-home')
    this.navigationBarElement.classList.remove('taro-navigation-bar-back')
  }

  fnBtnToggleToBack (){
    if(!this.navigationBarElement) return
    this.navigationBarElement.classList.remove('taro-navigation-bar-home')
    this.navigationBarElement.classList.add('taro-navigation-bar-back')
  }

  fnBtnToggleToNone (){
    if(!this.navigationBarElement) return
    this.navigationBarElement.classList.remove('taro-navigation-bar-home')
    this.navigationBarElement.classList.remove('taro-navigation-bar-back')
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