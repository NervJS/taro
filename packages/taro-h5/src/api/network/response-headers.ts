export const parseResponseHeaders = (rawHeaders: string) => {
  const headers: Record<string, string> = {}
  for (const line of rawHeaders.split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator <= 0) continue
    Object.defineProperty(headers, line.slice(0, separator).trim(), {
      value: line.slice(separator + 1).trim(),
      configurable: true,
      enumerable: true,
      writable: true
    })
  }
  return headers
}
