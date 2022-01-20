import React, { useMemo, useRef, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { BAR_MAP, renderThumbStyle } from './utils'
import type { BarType } from './utils'
import { WrapContext } from './context'
import './VBar.less'

interface VBarProps {
  /** 滚动条方向 */
  direction: 'vertical' | 'horizontal'
  /** 滚动thumb占比高度 */
  size: string
  /** 滚动偏移百分比 */
  move: number
}

const VBar: React.FunctionComponent<VBarProps> = props => {
  const { size, move, direction } = props
  const wrap = React.useContext(WrapContext)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRef = useRef<HTMLDivElement | null>(null)
  const thumbClickPositionRef = useRef<number>(0)

  const bar: BarType = useMemo(() => {
    return BAR_MAP[direction]
  }, [direction])

  /** 轨道点击 */
  const clickTrackHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrap || !thumbRef.current || !trackRef.current) {
      return
    }

    /** 点击位置距离轨道顶部偏移量 */
    const offset = Math.abs(
      (e.target as HTMLDivElement).getBoundingClientRect()[bar.direction] - e[bar.client],
    )
    const thumbHalf = thumbRef.current[bar.offset] / 2
    /** 计算拇指偏移百分比 */
    const thumbPositionPercentage = ((offset - thumbHalf) * 100) / trackRef.current[bar.offset]

    /** 设置滚动容器滚动 */
    wrap[bar.scroll] = (thumbPositionPercentage * wrap[bar.scrollSize]) / 100
  }

  /** 拇指点击 */
  const clickThumbHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }

  const bind = useDrag(({ down, first, last, initial, target, xy }) => {
    if (!wrap || !thumbRef.current || !trackRef.current) {
      return
    }

    if (first) {
      /** 计算thumb点击位置 */
      const clientY = initial[1]
      const thumbTop = (target as HTMLDivElement).getBoundingClientRect()[bar.direction]
      thumbClickPositionRef.current = clientY - thumbTop
    }
    if (last) {
      thumbClickPositionRef.current = 0
    }
    if (down) {
      const clientY = xy[1]
      const offset = clientY - trackRef.current.getBoundingClientRect()[bar.direction]
      /** 计算thumb偏移百分比 */
      const thumbPositionPercentage =
        ((offset - thumbClickPositionRef.current) * 100) / trackRef.current[bar.offset]
      /** 设置滚动容器滚动 */
      wrap[bar.scroll] = (thumbPositionPercentage * wrap[bar.scrollSize]) / 100
    }
  })

  const thumbStyle = renderThumbStyle({ size, move, bar })
  return (
    <div ref={trackRef} className="v-scrollbar__bar" onClick={clickTrackHandler}>
      <div
        ref={thumbRef}
        className="v-scrollbar__thumb"
        onClick={clickThumbHandler}
        style={thumbStyle}
        {...bind()}
      ></div>
    </div>
  )
}

export default VBar
