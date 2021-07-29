/**
 * 暂不支持
 * @param key 
 */
export function getStorageSync(key: String): any {
    throw Error('RN 端暂不支持 getStorageSync，请使用 getStorage')
}