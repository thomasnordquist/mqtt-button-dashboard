import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import { createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@material-ui/styles'
import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';
import amber from '@material-ui/core/colors/amber';
import { CssBaseline } from '@material-ui/core';

const theme = createMuiTheme({ 
  palette: {
    type: 'dark',
    primary: amber
  },
})

function Application() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div style={{width: '100vw', height: '100vh', overflow: 'hidden'}}>
          <CssBaseline />
          <App />
        </div>
      </ThemeProvider>
    </Provider>
  )
}

ReactDOM.render(
  <Application />,
  document.getElementById('app')
)
