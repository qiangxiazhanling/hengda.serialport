import React from 'react'
import { HashRouter, Switch, Route } from 'react-router-dom'

import Navbar from '../components/Navbar'
import List from './List'
import Edit from './Edit'
import TestEdit from './TestEdit'
import Upload from './Upload'

const Index = () => (
  <HashRouter>
    <Navbar category="jueyuan" />
    <div className="container-fluid pt-5">
      <Switch> 
        <Route exact path="/" component={List} />
        <Route path="/绝缘/设备列表" component={List} />
        <Route path="/绝缘/设备设置/:comName/" component={Edit} />
        <Route path="/绝缘/测试配置/:comName/" component={TestEdit} />
        <Route path="/绝缘/数据上传/:comName/" component={Upload} />
      </Switch>
    </div>  
  </HashRouter>
)

export default Index