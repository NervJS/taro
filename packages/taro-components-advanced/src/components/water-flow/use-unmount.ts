import { useEffect } from 'react'

export function useUnmount(cb: () => void) {
  useEffect(() => {
    return () => {
      cb()
    }
  }, [])
}
