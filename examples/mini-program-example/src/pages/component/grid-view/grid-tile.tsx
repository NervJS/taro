import { View } from '@tarojs/components'
import { FC } from 'react'
import './grid-tile.scss'

interface GridTileProps {
  height: number
  index: number
}

export const GridTile: FC<GridTileProps> = ({ height, index }) => {
  return (
    <View key={index} className='center' style={{ width: '100%', height: height + 'px', backgroundColor: '#6bbc7a' }}>
      <View
        className='center'
        style={{ width: '60px', height: '60px', borderRadius: '30px', backgroundColor: 'white', color: 'black' }}
      >
        {index}
      </View>
    </View>
  )
}
