import * as React from 'react'
import { connect } from 'mqtt'
import { Map, Record } from 'immutable'

interface ButtonModel {
  state: boolean
  name: string
  baseTopic: string
}

const TopicButton = Record<ButtonModel>({
  state: false,
  name: "",
  baseTopic: "",
})

const topicPrefix = 'buy'

let buttons: Map<string, ButtonModel> = Map()
const client = connect('ws://10.1.12.1:9001/ws')
client.on('connect', () => {
  console.log("connected")
  client.on('message', handleMessage)

  client.subscribe(`buy/+`)
  client.subscribe(`buy/+/+`)  
})

client.on('error', (error) => {
  console.log(error)
})

function updateButton(changeSet: Partial<ButtonModel>, baseTopic: string) {
  buttons = buttons.update(baseTopic, (val) => ({...val, ...changeSet}))
  // setButtons(buttons)
}

function handleMessage(topic: string, payload: Buffer) {
  const topics = topic.split('/')
    .slice(1) // Remove topic prefix
  const value = payload.toString()
  const baseTopic = topics.slice(0, 2).join('/')

  if (!buttons.has(baseTopic)) {
    buttons = buttons.set(baseTopic, TopicButton({
      name: value,
      baseTopic,
    }))
  }
  const isButtonName = topics.length === 2
  if (isButtonName) {
    updateButton({name: value}, baseTopic)
  } else if (topics[2] === 'state') {
    updateButton({state: value === 'true'}, baseTopic)
  }
}
