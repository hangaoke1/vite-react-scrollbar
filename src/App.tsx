import { useEffect, useState } from 'react'
import Nativebar from './Nativebar/Nativebar'
import VScrollbar from './VScrollbar/VScrollbar'

import './App.less'
function App() {
  const [list, setList] = useState<number[]>([1, 1, 1, 1])

  const loadData = () => {
    const array = new Array(100).fill(1)
      setList(array)
  }

  return (
    <div className="App">
      <button onClick={loadData}>加载数据</button>
      <div className="container">
        <div style={{ width: 200, height: 500, marginRight: 20 }}>
          <Nativebar style={{ overflow: 'auto ' }}>
            {list.map((v, index) => {
              return (
                <div key={index} className="native-bar__item">
                  <div>{v}</div>
                  <div>》</div>
                </div>
              )
            })}
          </Nativebar>
          <div className="tip">overflow: auto</div>
        </div>
        <div style={{ width: 200, height: 500, marginRight: 20 }}>
          <Nativebar style={{ overflow: 'overlay ' }}>
            {list.map((v, index) => {
              return (
                <div key={index} className="native-bar__item">
                  <div>{v}</div>
                  <div>》</div>
                </div>
              )
            })}
          </Nativebar>
          <div className="tip">overflow: overlay</div>
        </div>
        <div style={{ width: 200, height: 500, marginRight: 20 }}>
          <VScrollbar>
            {list.map((v, index) => {
              return (
                <div key={index} className="native-bar__item">
                  <div>{v}</div>
                  <div>》</div>
                </div>
              )
            })}
          </VScrollbar>
          <div className="tip">负margin + 虚拟滚动条</div>
        </div>
      </div>
    </div>
  )
}

export default App
