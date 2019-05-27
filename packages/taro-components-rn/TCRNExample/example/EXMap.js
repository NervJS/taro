import React, { Component } from 'react'
import { View, Map } from '../../dist'

export default class EXAudio extends Component {
  state = {
    markers: [],
    polyline: [
      {
        points: [
          { latitude: 37.78815, longitude: -122.4314 },
          { latitude: 37.77805, longitude: -122.4204 },
          { latitude: 37.76795, longitude: -122.4194 }
        ],
        color: 'red',
        width: 1
      }
    ],
    polygons: [
      {
        points: [
          { latitude: 37.75815, longitude: -122.4014 },
          { latitude: 37.74805, longitude: -122.3904 },
          { latitude: 37.73795, longitude: -122.3894 },
        ],
        strokeColor: 'green',
        strokeWidth: 2,
        fillColor: 'orange'
      }
    ],
    circles: [
      {
        latitude: 37.71795,
        longitude: -122.3694,
        color: 'pink',
        fillColor: 'yellow',
        radius: 1200,
        strokeWidth: 2
      }
    ]
  }

  render () {
    return (
      <View style={{ marginVertical: 10, width: '80%', height: 300 }}>
        <Map
          latitude={37.78825}
          longitude={-122.4324}
          markers={this.state.markers}
          polyline={this.state.polyline}
          polygons={this.state.polygons}
          circles={this.state.circles}
          showCompass={true}
          onClick={(coordinate) => {
            console.log(coordinate)
            this.setState({
              markers: [
                {
                  id: 0,
                  ...coordinate,
                  callout: { content: '我我我我', color: 'red' },
                  anchor: { x: 1, y: 1 }
                }
              ]
            })
          }}
        />
      </View>
    )
  }
}
