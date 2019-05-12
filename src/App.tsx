import * as React from 'react'
import { actions } from './Actions'
import AddButton from './components/AddButton'
import { AnyAction } from 'redux'
import { ButtonRecord } from './Model'
import { connect } from 'react-redux'
import { GlobalState } from './Reducer'
import { Grid } from './components/Grid'
import { Map } from 'immutable'
import { ThunkDispatch } from 'redux-thunk'
import { useEffect } from 'react'

interface DispatchProps {
  actions: any
}

interface StateProps {
  buttons: Map<string, ButtonRecord>
}

type Props = {}

function App(props: Props & DispatchProps & StateProps) {
  useEffect(() => {
    props.actions.connectToMqtt()
    return function cleanup() {
    }
  }, [])

  return <div>
    <Grid buttons={props.buttons} /><br />
    <AddButton />
  </div>
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>): DispatchProps => {
  return {
    actions: {
      connectToMqtt: () => dispatch(actions.connectToMqtt())
    },
  }
}

const mapStateToProps = (state: GlobalState, ownProps: Props): StateProps => {
  return {
    buttons: state.global.buttons,
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)