let globalIsUsingStaticRendering = false

export function useStaticRendering (enable) {
  globalIsUsingStaticRendering = enable
}

export function isUsingStaticRendering () {
  return globalIsUsingStaticRendering
}
