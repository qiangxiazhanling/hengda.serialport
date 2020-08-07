import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

console.info('xx')

window.addEventListener('beforeunload', e => {
  let confirmationMessage = 'Exit?';
  e.returnValue = 'Exit?';
  e.returnValue = confirmationMessage;
  return confirmationMessage;
});

ReactDOM.render(
  <App />,
  document.getElementById('app')
)