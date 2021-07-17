import React from 'react'

const NOOP = () => {}
export default React.createContext<{
  onError(arg: unknown): void
  onClose(): void
}>({
      onError: NOOP,
      onClose: NOOP
    })
