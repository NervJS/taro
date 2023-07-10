import Taro from "@tarojs/taro"
import { shouldBeObject } from "src/utils"
import { MethodHandler } from "src/utils/handler"

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
    complete
  } = options as Exclude<typeof options, undefined>

  const handle = new MethodHandler({ name, success, fail, complete })


  console.log('add phone contact')
  // @ts-ignore
  const ret = native.addPhoneContact({
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
      return handle.success(res)
    },
    fail: (err: any) => {
      return handle.fail(err)
    }
  })
  return ret
}
