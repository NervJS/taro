// @ts-ignore
export const syncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: true }) || (target => target)

// @ts-ignore
// const syncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: false, autoRelease: false }) || (target => target)

// @ts-ignore
export const asyncAndRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: true }) || (target => target)

// @ts-ignore
export const asyncAndNotRelease = window.MethodChannel && window.MethodChannel.jsBridgeMode({ isAsync: true, autoRelease: false }) || (target => target)