import React from 'react'
import './Nativebar.less'

export type NativebarProps = {
  style: React.CSSProperties
}

const Nativebar: React.FC<NativebarProps> = props => {
  return (
    <div className="native-bar" style={props.style}>
      {props.children}
    </div>
  )
}

export default Nativebar
