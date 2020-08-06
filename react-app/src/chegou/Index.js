import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Upload from './Upload'

const Index = () => (
  <HashRouter>
    <Navbar category="chegou" />
    <div className="container-fluid pt-5">
      <Switch> 
        <Route path="/车钩/上传" component={Upload} />
      </Switch>
    </div>  
  </HashRouter>
)

export default Index