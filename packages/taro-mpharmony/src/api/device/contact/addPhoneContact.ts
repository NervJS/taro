import Taro from '@tarojs/taro'
import { shouldBeObject } from 'src/utils'
import { MethodHandler } from 'src/utils/handler'

/**
 * 添加手机通讯录联系人
 * 
 * @canUse addPhoneContact
 * @__object [firstName, photoFilePath, nickName, middleName, lastName, remark, mobilePhoneNumber,\
 * weChatNumber, addressCountry, addressState, addressCity, addressStreet, addressPostalCode,\
 * organization, title, workFaxNumber, workPhoneNumber, hostNumber, email, url, workAddressCountry,\
 * workAddressState, workAddressCity, workAddressStreet, workAddressPostalCode, homeFaxNumber,\
 * homePhoneNumber, homeAddressCountry, homeAddressState, homeAddressCity, homeAddressStreet,\
 * homeAddressPostalCode]
 */
export const addPhoneContact: typeof Taro.addPhoneContact = (options) => {
  const name = 'addPhoneContact'

  // options must be an Object
  const isObject = shouldBeObject(options)
  if (!isObject.flag) {
    const res = { errMsg: `${name}:fail ${isObject.msg}` }
    console.error(res.errMsg)
    return Promise.reject(res)
  }

  const {
    firstName,
    photoFilePath,
    nickName,
    middleName,
    lastName,
    remark,
    mobilePhoneNumber,
    weChatNumber,
    addressCountry,
    addressState,
    addressCity,
    addressStreet,
    addressPostalCode,
    organization,
    title,
    workFaxNumber,
    workPhoneNumber,
    hostNumber,
    email,
    url,
    workAddressCountry,
    workAddressState,
    workAddressCity,
    workAddressStreet,
    workAddressPostalCode,
    homeFaxNumber,
    homePhoneNumber,
    homeAddressCountry,
    homeAddressState,
    homeAddressCity,
    homeAddressStreet,
    homeAddressPostalCode,
    success,
    fail,
    complete,
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })

  return new Promise((resolve, reject) => {
    // @ts-ignore
    native.addPhoneContact({
      firstName: firstName,
      photoFilePath: photoFilePath,
      nickName: nickName,
      middleName: middleName,
      lastName: lastName,
      remark: remark,
      mobilePhoneNumber: mobilePhoneNumber,
      weChatNumber: weChatNumber,
      addressCountry: addressCountry,
      addressState: addressState,
      addressCity: addressCity,
      addressStreet: addressStreet,
      addressPostalCode: addressPostalCode,
      organization: organization,
      title: title,
      workFaxNumber: workFaxNumber,
      workPhoneNumber: workPhoneNumber,
      hostNumber: hostNumber,
      email: email,
      url: url,
      workAddressCountry: workAddressCountry,
      workAddressState: workAddressState,
      workAddressCity: workAddressCity,
      workAddressStreet: workAddressStreet,
      workAddressPostalCode: workAddressPostalCode,
      homeFaxNumber: homeFaxNumber,
      homePhoneNumber: homePhoneNumber,
      homeAddressCountry: homeAddressCountry,
      homeAddressState: homeAddressState,
      homeAddressCity: homeAddressCity,
      homeAddressStreet: homeAddressStreet,
      homeAddressPostalCode: homeAddressPostalCode,
      success: (res: any) => {
        handle.success(res, { resolve, reject })
      },
      fail: (err: any) => {
        handle.fail(err, { resolve, reject })
      },
    })
  })
}
