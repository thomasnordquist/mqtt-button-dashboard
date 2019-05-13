import * as React from 'react'
import { actions } from '../Actions'
import { AnyAction } from 'redux'
import { Button, withTheme, Theme, Badge } from '@material-ui/core'
import { ButtonRecord } from '../Model'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'redux-thunk'
import { Icon } from './Icon'

interface Props {
  button: ButtonRecord
  theme: Theme
}

interface DispatchProps {
  actions: any
}

const style = {
}

function MqttButton(props: Props & DispatchProps) {
  const [editing, setEditing] = React.useState(false)
  let timer: any

  function longPress(event: TouchEvent | MouseEvent | any) {
    event.preventDefault()
    setEditing(!editing)
  }

  const { button, actions, theme } = props

  let badge = <div onClick={() => {
    actions.deleteButton(button)
    setEditing(false)
  }}>X</div>

  return (
    <Badge invisible={!editing} badgeContent={badge} color="secondary" style={{margin: "1em", cursor: 'pointer'}} className={editing ? "wiggle" : ""}>
      <Button 
        style={style}
        color="primary"
        variant={button.get('state') ? "contained" : "outlined"}
        onClick={() => { actions.toggleButton(button) }}
        onContextMenu={longPress}
      >
        <Icon id={button.get('iconId')} color={button.get('state') ? theme.palette.primary.contrastText : theme.palette.primary.main} />
        <span style={{marginLeft: '8px', fontSize: '1.8em', fontWeight: 500, lineHeight: '1.4em'}}>{button.get('name')}</span>
      </Button>
    </Badge>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>): DispatchProps => {
  return {
    actions: {
      toggleButton: (button: ButtonRecord) => dispatch(actions.toggleButton(button)),
      deleteButton: (button: ButtonRecord) => dispatch(actions.deleteButton(button))
    },
  }
}

const ConnectedMqttButton = connect(undefined, mapDispatchToProps)(withTheme(MqttButton))

class ButtonContainer extends React.Component<{button: ButtonRecord}, {}> {
  render() {
    return <ConnectedMqttButton button={this.props.button} />
  }
}
export default ButtonContainer
