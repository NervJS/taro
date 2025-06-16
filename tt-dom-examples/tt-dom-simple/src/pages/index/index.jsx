import './index.css'

import { View } from '@tarojs/components'
import { useEffect, useRef, useState } from 'react'

const TOTAL = 1000
let timer = -1

const GridPage = () => {
  const [colors, setColors] = useState(
    () => new Array(TOTAL).fill(false) // false = 灰色，true = 蓝色
  )
  const currentIndex = useRef(0)

  useEffect(() => {
    console.log(' useEffect ')
  }, [])

  function start() {
    if (timer > 0) return
    timer = setInterval(() => {
      if (currentIndex.current >= TOTAL) {
        clearInterval(timer)
        timer = -1
        currentIndex.current = 0
        return
      }

      setColors((prev) => {
        const updated = [...prev]
        updated[currentIndex.current] = true
        currentIndex.current += 1
        return updated
      })
    }, 20)
  }

  function clear() {
    setColors(() => new Array(TOTAL).fill(false))
  }
  return (
    <View>
      <View className="controls">
        <View className="button start" onClick={start}>开始</View>
        <View className="button clear" onClick={clear}>清除</View>
      </View>
      <View className="grid-container">
        {colors
          .map((isActive, index) => (
            <View
              key={index}
              className="grid-box"
            >
              <View>
                <View>
                  <View>
                    <View style={{ backgroundColor: isActive ? '#3498db' : '#eee' }}>
                      <View className="font">{index}</View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))
        }
      </View>
    </View>

  )
}

export default GridPage
