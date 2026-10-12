interface ShouldProcessCommonStylesOptions {
  hasCommonStyles: boolean
  hasAppStyle: boolean
  isWeappSubPackageIndieEnabled: boolean
}

export function isWeappSubPackageIndieEnabled (platform: string | undefined, newBlended: boolean): boolean {
  return platform === 'weapp' && newBlended
}

export function shouldProcessCommonStyles ({
  hasCommonStyles,
  hasAppStyle,
  isWeappSubPackageIndieEnabled,
}: ShouldProcessCommonStylesOptions): boolean {
  return hasCommonStyles && (!isWeappSubPackageIndieEnabled || hasAppStyle)
}
