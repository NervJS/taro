
import { eventCenter } from '@tarojs/runtime'

import { navigateBack,reLaunch } from '../api'
import { loadNavigationBarStyle } from '../style'
import stacks from './stack'

import type PageHandler from './page'

export default class NavigationBarHandler {
  pageContext: PageHandler
  navigationBarElement: Element
  constructor (pageContext: PageHandler){
    this.pageContext = pageContext
    this.init()
    loadNavigationBarStyle()
    eventCenter.on('__taroH5SetNavigationTitle', (title)=>{
      this.setTitle(title)
    })
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

  load () {
    this.setTitle()
    this.setNavigationBarVisible()
    this.setFnBtnState()
    this.setNavigationStyle()
  }

  setFnBtnState () {
    const currentRouter = this.pageContext.currentPage
    if (this.pageContext.isTabBar(currentRouter) || this.pageContext.homePage === currentRouter) {
      this.fnBtnToggleToNone()
    } else if (stacks.length > 1) {
      this.fnBtnToggleToBack()
    } else {
      this.fnBtnToggleToHome()
    }
  }

  setNavigationStyle () {
    let navigationBarTextStyle = this.pageContext.config?.window?.navigationBarTextStyle || 'white'
    let navigationBarBackgroundColor = this.pageContext.config?.window?.navigationBarBackgroundColor || '#000000'
    if (typeof this.pageContext.pageConfig?.navigationBarTextStyle === 'string') {
      navigationBarTextStyle = this.pageContext.pageConfig.navigationBarTextStyle
    }
    if (typeof this.pageContext.pageConfig?.navigationBarBackgroundColor === 'string') {
      navigationBarBackgroundColor = this.pageContext.pageConfig.navigationBarBackgroundColor
    }
    if (!this.navigationBarElement) return
    (this.navigationBarElement as HTMLElement).style.color = navigationBarTextStyle;
    (this.navigationBarElement as HTMLElement).style.background = navigationBarBackgroundColor
  }

  setTitle (title?) {
    if(!this.titleElement) return
    let proceedTitle
    if(typeof title === 'string') {
      proceedTitle = title
    } else {
      proceedTitle = this.pageContext.pageConfig?.navigationBarTitleText ?? document.title
    }
    this.titleElement.innerHTML = proceedTitle
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

  setNavigationBarVisible (show?){
    let shouldShow
    if (typeof show === 'boolean') {
      shouldShow = show
    } else {
      shouldShow =  this.pageContext.config.window?.navigationStyle
      if (typeof this.pageContext.pageConfig?.navigationStyle === 'string'){
        shouldShow = this.pageContext.pageConfig.navigationStyle
      }
    }
    if(shouldShow === 'default') {
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