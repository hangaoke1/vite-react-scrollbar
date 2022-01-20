import React, { useState, useRef, useEffect } from 'react'
import VBar from './VBar'
import { addResizeListener, removeResizeListener } from './resize-event'
import { WrapContext } from './context'
import { calcScrollBarWidth } from './utils'

import './VScrollbar.less'

interface VScrollbarProps {}

const VScrollbar: React.FunctionComponent<VScrollbarProps> = props => {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<HTMLDivElement | null>(null)
  const [moveY, setMoveY] = useState(0)
  const [sizeHeight, setSizeHeight] = useState('')
  const gutter = calcScrollBarWidth()

  useEffect(() => {
    updateSize()
  }, [])

  useEffect(() => {
    addResizeListener(viewRef.current, updateSize)
    return () => {
      removeResizeListener(viewRef.current, updateSize)
    }
  }, [])

  const updateSize = () => {
    let heightPercentage
    const wrap = wrapRef.current
    if (!wrap) return

    heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight
    const newSizeHeight = heightPercentage < 100 ? heightPercentage + '%' : ''
    setSizeHeight(newSizeHeight)
  }

  const scrollHandler = (e: React.UIEvent<React.ReactNode>) => {
    const wrap: HTMLDivElement | null = wrapRef.current
    if (wrap) {
      const newMoveY = (wrap.scrollTop * 100) / wrap.clientHeight
      setMoveY(newMoveY)
    }
  }

  const wrapStyle = {
    marginRight: `-${gutter}px`,
    height: `calc(100% + ${gutter}px)`,
  }
  return (
    <div className="v-scrollbar">
      <div ref={wrapRef} className="v-scrollbar__wrap" style={wrapStyle} onScroll={scrollHandler}>
        <div ref={viewRef} className="v-scrollbar__view">
          {props.children}
        </div>
      </div>

      <WrapContext.Provider value={wrapRef.current}>
        <VBar move={moveY} size={sizeHeight} direction="vertical" />
      </WrapContext.Provider>
    </div>
  )
}

export default VScrollbar
