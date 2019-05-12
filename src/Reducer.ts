import { Action, ReceiveMessageAction, actions } from './Actions'
import { ButtonRecord, ButtonRecordFactory, ButtonModel } from './Model'
import { combineReducers } from 'redux'
import { Map } from 'immutable'

export interface GlobalState {
  global: State
}

export interface State {
  buttons: Map<string, ButtonRecord>
}

const initialButtonState: State = {
  buttons: Map()
}

export const reducer = (state: State = initialButtonState, action: Action): State => {
  switch (action.type) {
  case 'TOGGLE':
    return state

  case 'MQTT_MESSAGE':
    let buttons = handleMessage(state, action)
    return {...state, buttons}

  default: 
    return initialButtonState
  }
}

export const globalReducer = combineReducers({
  global: reducer,
})

function handleMessage(state: State, action: ReceiveMessageAction): Map<string, ButtonRecord> {
  let mutableState = {...state}
  const topics = action.topic.split('/')
  const baseTopic = topics.slice(0, 2).join('/')

  // Handle button deletion
  if (!action.payload) {
    if (state.buttons.has(baseTopic)) {
      return state.buttons.remove(baseTopic)
    }

    return state.buttons
  }

  // Add Button if it does not exist
  if (!state.buttons.has(baseTopic)) {
    mutableState.buttons = state.buttons.set(baseTopic, ButtonRecordFactory({
      name: action.payload,
      baseTopic,
    }))
  }

  const isButtonName = topics.length === 2
  if (isButtonName) {
    return updateButton(mutableState, JSON.parse(action.payload), baseTopic)
  }

  return mutableState.buttons
}

function updateButton(state: State, changeSet: Partial<ButtonModel>, baseTopic: string): Map<string, ButtonRecord> {
  return state.buttons.update(baseTopic, (val) => val.merge(changeSet))
}
