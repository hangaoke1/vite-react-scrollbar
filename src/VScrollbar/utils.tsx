import React from 'react'
export type BarType = {
  offset: 'offsetWidth' | 'offsetHeight'
  scroll: 'scrollLeft' | 'scrollTop'
  scrollSize: 'scrollWidth' | 'scrollHeight'
  size: 'width' | 'height'
  key: 'horizontal' | 'vertical'
  axis: 'X' | 'Y'
  client: 'clientX' | 'clientY'
  direction: 'left' | 'top'
}
export type RenderThumbConfig = {
  move: number
  size: string
  bar: BarType
}

export const BAR_MAP = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  } as BarType,
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  } as BarType,
}

export function renderThumbStyle(config: RenderThumbConfig) {
  const { move, size, bar } = config
  const style: React.CSSProperties = {}
  const translate = `translate${bar.axis}(${move}%)`

  style[bar.size] = size
  style.transform = translate
  style.msTransform = translate
  style.WebkitTransform = translate

  return style
}

let scrollBarWidth: number | undefined;

export function calcScrollBarWidth() {
  if (scrollBarWidth !== undefined) return scrollBarWidth

  const outer = document.createElement('div')
  outer.className = 'v-scrollbar__calc'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)

  const widthNoScroll = outer.offsetWidth
  outer.style.overflow = 'scroll'

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode?.removeChild(outer)
  scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}
