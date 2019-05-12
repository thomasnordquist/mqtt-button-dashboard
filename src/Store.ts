import thunk from 'redux-thunk'
import { applyMiddleware, createStore, compose } from 'redux'
import { ButtonRecord } from './Model'
import { globalReducer } from './Reducer'
import { Map } from 'immutable'
import {batchActions, enableBatching, batchDispatchMiddleware} from 'redux-batched-actions'

export interface RootState {
  buttons: Map<string, ButtonRecord>
}

const composeEnhancer = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default createStore(
  enableBatching(globalReducer),
  composeEnhancer(
    applyMiddleware(thunk)
  ),
)