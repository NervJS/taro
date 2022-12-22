export const IS_PROD = process.env.NODE_ENV === 'production'
export const IS_WEB = process.env.TARO_ENV === 'h5'
export const IS_VUE3 = process.env.FRAMEWORK === 'vue3'
