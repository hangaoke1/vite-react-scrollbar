import ResizeObserver from 'resize-observer-polyfill'
import { debounce } from 'throttle-debounce'

const isServer = typeof window === 'undefined'

const resizeHandler = function (entries: any) {
  for (let entry of entries) {
    const listeners = entry.target.__resizeListeners__ || []
    if (listeners.length) {
      listeners.forEach((fn: () => void) => {
        fn()
      })
    }
  }
}

export const addResizeListener = function (element: any, fn: () => void) {
  if (isServer) return
  if (!element.__resizeListeners__) {
    element.__resizeListeners__ = []
    element.__ro__ = new ResizeObserver(debounce(16, resizeHandler))
    element.__ro__.observe(element)
  }
  element.__resizeListeners__.push(fn)
}

export const removeResizeListener = function (element: any, fn: () => void) {
  if (!element || !element.__resizeListeners__) return
  element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1)
  if (!element.__resizeListeners__.length) {
    element.__ro__.disconnect()
  }
}
