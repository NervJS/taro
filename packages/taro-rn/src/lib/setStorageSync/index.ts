/**
 * 暂不支持
 * @param key 
 * @param data 
 */
export function setStorageSync(key: String, data: any) {
    throw Error('RN 端暂不支持 setStorageSync，请使用 setStorage')
}