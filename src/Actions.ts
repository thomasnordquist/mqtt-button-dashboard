import { batchActions } from 'redux-batched-actions'
import { ButtonRecord, calculateFrecency } from './Model'
import { connect } from 'mqtt'
import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { any } from 'prop-types';

export interface ToggleAction {
  type: 'TOGGLE'
  baseTopic: string
}

export interface ReceiveMessageAction {
  type: 'MQTT_MESSAGE'
  topic: string
  payload: string
}

export type Action = ToggleAction | ReceiveMessageAction

let messageTimer: any
let messageBuffer: Array<ReceiveMessageAction> = []
function didReceiveMessage(topic: string, payload: Buffer) {
  messageBuffer.push({
    topic,
    payload: payload.toString(),
    type: 'MQTT_MESSAGE',
  })
}

export const topicPrefix = 'buy'
var client: any

const toggleButton = (button: ButtonRecord): ThunkAction<Promise<void>, {}, {}, any> => {
  return async (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => {

      let frecencyDates = button.get('frecencyDates').slice(0, 19)
      frecencyDates.unshift(Date.now())

      let changes = button.merge({
        state: !button.get('state'),
        frecencyDates,
        frecency: calculateFrecency(frecencyDates),
      })
      client.publish(`${button.get('baseTopic')}`, JSON.stringify(changes.toJSON()), {retain: true, qos: 2})

      resolve()
    })
  }
}

export const deleteButton = (button: ButtonRecord): ThunkAction<Promise<void>, {}, {}, any> => {
  return async (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => { 
      client.publish(`${button.get('baseTopic')}`, "", {retain: true, qos: 2})

      resolve()
    })
  }
}

const addButton = (button: ButtonRecord): ThunkAction<Promise<void>, {}, {}, any> => {
  return async (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => { 
      client.publish(`${button.get('baseTopic')}`, JSON.stringify(button.toJSON()), {retain: true, qos: 2})
      
      resolve()
    })
  }
}

declare const __MQTT_URL__: string
declare const __MQTT_USER__: string
declare const __MQTT_PASS__: string

const connectToMqtt = (): ThunkAction<Promise<void>, {}, {}, any> => {
  // Invoke API
  return async (dispatch: Dispatch) => {
    return new Promise<void>((resolve) => { 
      client = connect(__MQTT_URL__, {username: __MQTT_USER__, password: __MQTT_PASS__})
      client.on('error', (error: Error) => {
        console.log(error)
      })

      client.on('message', async (topic: string, payload: Buffer) => {
        didReceiveMessage(topic, payload)

        messageTimer && clearTimeout(messageTimer)
        messageTimer = setTimeout(() => {
          messageTimer = undefined
          let messages = messageBuffer
          messageBuffer = []
          console.log('dispatch')
          dispatch(batchActions(messages))
        }, 100)
      })

      client.subscribe(`${topicPrefix}/+`, {qos: 2})
      client.subscribe(`${topicPrefix}/+/+`, {qos: 2})
    })
  }
}

export const actions = { connectToMqtt, toggleButton, deleteButton, addButton }