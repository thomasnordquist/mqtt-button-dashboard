import * as React from 'react'
import AddIcon from '@material-ui/icons/Add'
import axios from 'axios'
import { actions, topicPrefix } from '../Actions'
import { AnyAction } from 'redux'
import {
  Button,
  Fab,
  IconButton,
  TextField,
  Typography
  } from '@material-ui/core'
import { ButtonRecordFactory } from '../Model'
import { connect } from 'react-redux'
import { Icon } from './Icon'
import { ThunkDispatch } from 'redux-thunk'

interface DispatchProps {
  actions: any
}

function AddButton(props: DispatchProps) {
  const [englishName, setEnglishName] = React.useState('')
  const [iconId, setIconId] = React.useState('')
  const [name, setName] = React.useState('')
  const [visible, setVisible] = React.useState(false)

  let buttonSettings = (
    <span style={{textAlign: 'center', display: 'block'}}>
      <div style={{paddingTop: '1em', display: 'inline-block', verticalAlign: 'top', minHeight: '12em', width: '50%', maxWidth: '45em', backgroundColor: 'rgba(70, 70, 70, 0.5)', marginRight: '16px'}}>
        <Typography>Select Icon</Typography>
        <IconSelection selected={iconId} term={englishName} didSelect={setIconId} />
      </div>
      <div style={{display: 'inline-block', verticalAlign: 'top'}}>
        <TextField label="Englisch" type="text" onBlur={(event) => {setEnglishName(event.target.value); setIconId('')}} /><br />
        <TextField label="Deutsch" type="text" onChange={(event) => setName(event.target.value)}/><br /><br />
        <Button variant="contained" color="primary" onClick={() => props.actions.addButton(englishName, name, iconId)}>Hinzufügen</Button>
      </div>
    </span>
  )
  return (
    <div>
      <Fab color="secondary" style={{ backgroundColor: visible ? '#f50057' : 'inherit', transition: 'all 0.75s ease-in', position: 'fixed', right: '16px', bottom: '16px', transform: `rotate(${visible ? 45 : 0}deg)` }} onClick={() => setVisible(!visible)}><AddIcon /></Fab>
      {visible ? buttonSettings : null}
    </div>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<any, any, AnyAction>): DispatchProps => {
  return {
    actions: {
      addButton: (englishName: string, name: string, iconId: string) => {
        console.log("hello1")

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

export default connect(undefined, mapDispatchToProps)(AddButton)

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
