import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Setting from './Setting'

const Index = () => (
  <HashRouter>
    <div className="container-fluid">
      <Switch> 
        <Route path="/设置/软件设置" component={Setting} />
      </Switch>
    </div>  
  </HashRouter>
)

export default Index