import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Navbar from '../components/Navbar'
import List from './List'
import Edit from './Edit'
import TestEdit from './TestEdit'
import Upload from './Upload'

const Index = () => (
  <HashRouter>
    <Navbar category="fangganshao" />
    <div className="container-fluid pt-5">
      <Switch> 
        <Route path="/防干烧/设备列表" component={List} />
        <Route path="/防干烧/设备设置/:comName/" component={Edit} />
        <Route path="/防干烧/茶炉设置/:comName/" component={TestEdit} />
        <Route path="/防干烧/数据上传/:comName/" component={Upload} />
      </Switch>
    </div>  
  </HashRouter>
)

export default Index