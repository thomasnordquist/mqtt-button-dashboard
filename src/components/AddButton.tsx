import * as React from 'react'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import { actions, topicPrefix } from '../Actions'
import { AnyAction } from 'redux'
import {
  Button,
  Fab,
  IconButton,
  Modal,
  TextField,
  Typography,
  Fade,
  withStyles
  } from '@material-ui/core'
import { ButtonRecordFactory } from '../Model'
import { connect } from 'react-redux'
import { Icon } from './Icon'
import { Theme, withTheme } from '@material-ui/core'
import { ThunkDispatch } from 'redux-thunk'

interface Props {
  classes: any
}

interface DispatchProps {
  actions: any
}

const textFieldStyle = {
  width: '20em',
  maxWidth: '90%' 
}

const styles = (theme: Theme) => ({
  modal: {
    width: '100vw', height: '100vh', position: 'fixed', backgroundColor: 'rgba(20, 20, 20, 0.8)',
    overflow: 'auto'
  },
  modalRoot: {
    outline: 'none',
  }
})

function AddButton(props: Props & DispatchProps) {
  const [englishName, setEnglishName] = React.useState('')
  const [iconId, setIconId] = React.useState('')
  const [name, setName] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  function addToButtons() {
    setVisible(false)
    props.actions.addButton(englishName, name, iconId)
  }

  return (
    <div>
      <Fab color="secondary" style={{ zIndex: 1000000000, backgroundColor: visible ? '#f50057' : '#444', transition: 'all 0.75s ease-in', position: 'absolute', right: '16px', bottom: '16px', transform: `rotate(${visible ? 45 : 0}deg)` }} onClick={() => setVisible(!visible)}><AddIcon /></Fab>
      <Modal open={visible} className={props.classes.modal} classes={{ root: props.classes.modalRoot }}>
        <span style={{textAlign: 'center', display: 'block', outline: 'none'}}>
          <div style={{margin: '16px'}}>
            <TextField style={textFieldStyle} label="Englisch" type="text" onBlur={(event) => {setEnglishName(event.target.value); setIconId('')}} /><br />
            <TextField style={textFieldStyle} label="Deutsch" type="text" onChange={(event) => setName(event.target.value)}/>
            <div style={{paddingTop: '1em', display: 'block', verticalAlign: 'top', minHeight: '12em', margin: '16px', backgroundColor: 'rgba(70, 70, 70, 0.5)', passing: '8px'}}>
              <Typography>Select Icon</Typography>
              <IconSelection selected={iconId} term={englishName} didSelect={setIconId} />
            </div>
            <br /><br />
            <Button style={textFieldStyle} variant="contained" color="primary" onClick={addToButtons}>Hinzufügen</Button>
          </div>
        </span>
      </Modal>
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>): DispatchProps => {
  return {
    actions: {
      addButton: (englishName: string, name: string, iconId: string) => {

        let button = ButtonRecordFactory({
          name,
          iconId,
          baseTopic: `${topicPrefix}/${englishName}`,
        })
        return dispatch(actions.addButton(button))
      },
    },
  }
}

export default connect(undefined, mapDispatchToProps)(withStyles(styles)(AddButton))

interface IconSelectionProps {
  term: string
  selected: string
  didSelect: (id: string) => void
}

class IconSelection extends React.Component<IconSelectionProps, {ids?: Array<string>}> {
  constructor(props: IconSelectionProps) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    this.loadImages(this.props)
  }

  componentWillReceiveProps(nextProps: IconSelectionProps) {
    if (nextProps.term) {
      this.loadImages(nextProps)
    }
  }

  async loadImages(props: IconSelectionProps) {
    if (props.term) {
      let response = await axios.get(`/api/?query=${props.term}`)
      if (response.status === 200) {
        this.setState({ids: response.data})
      }
    }
  }

  render() {
    if (!this.props.term || !this.state.ids || !this.state.ids.length) {
      return <Typography color="textPrimary" variant="h5" style={{marginTop: '1em', color: '#ccc'}}>No icons</Typography>
    }

    console.log(this.state.ids)

    const icons = this.state.ids.map(id => <IconButton key={id} onClick={() => this.props.didSelect(id)}><Icon id={id} color={this.props.selected === id ? "red" : "white"} /></IconButton>)

    return (
      <div>{icons}</div>
    )
  }
}
