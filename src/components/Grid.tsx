import * as React from 'react'
import MqttButton from './MqttButton'
import { ButtonRecord } from '../Model'
import { Map } from 'immutable'
import FlipMove from 'react-flip-move'

interface Props {
  buttons: Map<string, ButtonRecord>
}

export function Grid(props: Props) {
  const buttons = props.buttons
    .toArray()
    .map(a => a[1]) // Unwrap map
    .sort((a: ButtonRecord, b: ButtonRecord) => {
      let stateOrder = Number(b.get('state')) - Number(a.get('state'))
      if (stateOrder != 0) {
        return stateOrder
      }

      return a.get('frecency') - b.get('frecency')
    })

  return (
      <span style={{textAlign: 'center', display: 'block'}}>
      <FlipMove>
        {buttons.map((button) => {
          return (<MqttButton key={button.get('baseTopic')} button={button} />)
        })}
      </FlipMove>
    </span>
  )
}